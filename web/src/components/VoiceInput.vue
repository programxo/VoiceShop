<script setup lang="ts">
import { ref } from 'vue';
import { voiceService } from '../services/voice.service';
import { openAIService } from '../services/openai.service';
import { useShoppingStore } from '../stores/shopping';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const isListening = ref(false);
const isProcessing = ref(false);
const error = ref<string | null>(null);
const transcript = ref<string>('');
const shoppingStore = useShoppingStore();

async function processVoiceText(text: string) {
  try {
    isProcessing.value = true;
    transcript.value = text;
    console.log('Processing voice text:', text);
    const items = await openAIService.processShoppingText(text);
    items.forEach(item => {
      shoppingStore.addItem(item);
    });
  } catch (err) {
    console.error('Voice processing error:', err);
    error.value = err instanceof Error ? err.message : 'Failed to process voice input';
  } finally {
    isProcessing.value = false;
  }
}

function startListening() {
  error.value = null;
  transcript.value = '';
  isListening.value = true;
  
  voiceService.startListening(
    async (text) => {
      isListening.value = false;
      await processVoiceText(text);
    },
    (err) => {
      console.error('Voice recognition error:', err);
      error.value = typeof err === 'string' ? err : 'Error during voice recognition';
      isListening.value = false;
    }
  );
}

function stopListening() {
  voiceService.stopListening();
  isListening.value = false;
}
</script>

<template>
  <Card class="max-w-md mx-auto mt-8">
    <CardHeader>
      <CardTitle>Voice Input</CardTitle>
    </CardHeader>
    <CardContent>
      <div class="flex flex-col items-center gap-4">
        <Button
          @click="isListening ? stopListening() : startListening()"
          :variant="isListening ? 'destructive' : 'default'"
          :disabled="isProcessing"
          size="lg"
        >
          {{ isListening ? 'Stop' : 'Start Voice Input' }}
        </Button>
        
        <div v-if="error" class="w-full p-4 rounded-lg bg-destructive/10 text-destructive">
          {{ error }}
        </div>
        
        <div v-if="isListening" class="text-primary animate-pulse">
          Listening...
        </div>
        
        <div v-if="isProcessing" class="text-primary">
          Processing...
        </div>

        <div v-if="transcript" class="w-full mt-2 p-3 rounded-lg bg-muted">
          <p class="text-sm text-muted-foreground">Recognized text:</p>
          <p class="text-foreground">{{ transcript }}</p>
        </div>
      </div>
    </CardContent>
  </Card>
</template>