<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useShoppingStore } from '../stores/shopping';
import { useLocationStore } from '../stores/location';
import { recommendationsService } from '../services/recommendations.service';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const shoppingStore = useShoppingStore();
const locationStore = useLocationStore();
const recommendations = ref<string>('');
const loading = ref(false);
const error = ref<string | null>(null);
const lastRequestTime = ref<number>(0);
const THROTTLE_TIME = 2000;

// Add debug logging
onMounted(() => {
  console.log('Recommendations component mounted');
  console.log('Initial location:', locationStore.location);
  console.log('Initial shopping items:', shoppingStore.lastAddedItem);
});

async function updateRecommendations() {
  console.log('updateRecommendations called');
  console.log('Current location:', locationStore.location);
  console.log('Current lastAddedItem:', shoppingStore.lastAddedItem);

  if (!locationStore.location || !shoppingStore.lastAddedItem) {
    console.log('Missing required data - location or lastAddedItem');
    return;
  }

  const now = Date.now();
  if (now - lastRequestTime.value < THROTTLE_TIME) {
    console.log('Throttled - skipping request');
    return;
  }
  lastRequestTime.value = now;

  loading.value = true;
  error.value = null;

  try {
    console.log('Fetching recommendations for:', {
      item: shoppingStore.lastAddedItem.name,
      location: locationStore.location
    });
    
    recommendations.value = await recommendationsService.getRecommendations(
      shoppingStore.lastAddedItem.name,
      locationStore.location
    );
    
    console.log('Received recommendations:', recommendations.value);
  } catch (err) {
    console.error('Recommendation error:', err);
    error.value = err instanceof Error ? err.message : 'Failed to get recommendations';
  } finally {
    loading.value = false;
  }
}

// Modified watchers with immediate option
watch(() => shoppingStore.lastAddedItem, (newVal, oldVal) => {
  console.log('lastAddedItem changed:', { old: oldVal, new: newVal });
  updateRecommendations();
}, { immediate: true });

watch(() => locationStore.location, (newVal, oldVal) => {
  console.log('location changed:', { old: oldVal, new: newVal });
  updateRecommendations();
}, { immediate: true });
</script>

<template>
  <Card v-if="locationStore.location" class="max-w-md mx-auto mt-4">
    <CardHeader>
      <CardTitle>Lokale Empfehlungen</CardTitle>
    </CardHeader>
    <CardContent>
      <div v-if="loading" class="flex items-center justify-center p-6">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
      
      <div v-else-if="error" class="p-4 rounded-lg bg-destructive/10 text-destructive">
        {{ error }}
      </div>
      
      <div v-else-if="recommendations" class="prose max-w-none">
        <div class="whitespace-pre-line text-foreground">
          {{ recommendations }}
        </div>
      </div>

      <div v-else class="text-muted-foreground text-center p-4">
        Fügen Sie Produkte hinzu, um Empfehlungen zu erhalten
      </div>
    </CardContent>
  </Card>
</template>