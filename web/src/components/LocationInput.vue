<script setup lang="ts">
import { ref } from 'vue';
import { useLocationStore } from '../stores/location';

const location = ref('');
const locationStore = useLocationStore();

function saveLocation() {
  locationStore.setLocation(location.value);
}
</script>

<template>
  <div class="max-w-md mx-auto mt-4 p-4">
    <label class="block text-sm font-medium text-gray-700 mb-2">
      Your Location
    </label>
    <input
      v-model="location"
      type="text"
      placeholder="Enter your location (e.g., Berlin, Alexanderplatz)"
      class="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
    />
    <button
      @click="saveLocation"
      class="mt-2 w-full bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
    >
      Save Location
    </button>
  </div>
</template>