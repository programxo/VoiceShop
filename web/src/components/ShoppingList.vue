<script setup lang="ts">
import { useShoppingStore } from '../stores/shopping';
import type { ShoppingItem } from '../types';

const store = useShoppingStore();

function removeItem(itemId: string) {
  if (!store.activeListId) return;
  const list = store.lists.find(l => l.id === store.activeListId);
  if (!list) return;
  
  list.items = list.items.filter(item => item.id !== itemId);
}
</script>

<template>
  <div v-if="store.activeListId" class="max-w-md mx-auto mt-8">
    <h2 class="text-2xl font-bold mb-4">Shopping List</h2>
    
    <ul v-if="store.lists.find(l => l.id === store.activeListId)?.items.length" class="space-y-2">
      <li
        v-for="item in store.lists.find(l => l.id === store.activeListId)?.items"
        :key="item.id"
        class="flex items-center justify-between p-3 bg-white rounded shadow"
      >
        <span>{{ item.name }} ({{ item.quantity }})</span>
        <button
          @click="removeItem(item.id)"
          class="text-red-500 hover:text-red-700"
        >
          Remove
        </button>
      </li>
    </ul>
    
    <p v-else class="text-gray-500 text-center">
      No items in the list. Use voice input to add items.
    </p>
  </div>
</template>