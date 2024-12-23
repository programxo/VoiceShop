<script setup lang="ts">
import { onMounted } from 'vue';
import VoiceInput from './components/VoiceInput.vue';
import ShoppingList from './components/ShoppingList.vue';
import LocationInput from './components/LocationInput.vue';
import ProductRecommendations from './components/ProductRecommendations.vue';
import { useShoppingStore } from './stores/shopping';

const store = useShoppingStore();

onMounted(() => {
  store.createList('My Shopping List');
});
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-8">
    <h1 class="text-4xl font-bold text-center mb-8">VoiceShop</h1>
    <LocationInput />
    <VoiceInput />
    <ShoppingList />
    <ProductRecommendations />
  </div>
</template>