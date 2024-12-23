import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import type { ShoppingList, ShoppingItem } from '../types';

const STORAGE_KEY = 'shopping-lists';

export const useShoppingStore = defineStore('shopping', () => {
  // Initialize state from localStorage if available
  const initialState = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse stored shopping lists:', e);
        return [];
      }
    }
    return [];
  };

  const lists = ref<ShoppingList[]>(initialState());
  const activeListId = ref<string | null>(null);
  const lastAddedItem = ref<ShoppingItem | null>(null);

  // Ensure there's always at least one list
  function initializeDefaultList() {
    if (lists.value.length === 0) {
      const defaultList = createList('Default List');
      console.log('Created default list:', defaultList);
    }
    if (!activeListId.value && lists.value.length > 0) {
      activeListId.value = lists.value[0].id;
      console.log('Set active list to:', activeListId.value);
    }
  }

  // Initialize on store creation
  initializeDefaultList();

  // Persist lists to localStorage whenever they change
  watch(
    lists,
    (newLists) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newLists));
      console.log('Lists saved to localStorage:', newLists);
    },
    { deep: true }
  );

  function createList(name: string) {
    const newList: ShoppingList = {
      id: crypto.randomUUID(),
      name,
      items: []
    };
    lists.value.push(newList);
    activeListId.value = newList.id;
    console.log('Created new list:', newList);
    return newList;
  }

  function addItem(item: Omit<ShoppingItem, 'id'>) {
    // Ensure there's an active list
    if (!activeListId.value) {
      initializeDefaultList();
    }
    
    const list = lists.value.find(l => l.id === activeListId.value);
    if (!list) {
      console.error('No active list found');
      return;
    }

    const newItem = {
      id: crypto.randomUUID(),
      ...item
    };

    list.items.push(newItem);
    lastAddedItem.value = newItem;
    console.log('Added new item:', newItem);
    console.log('To list:', list.name);
  }

  function getActiveList(): ShoppingList | null {
    return lists.value.find(l => l.id === activeListId.value) || null;
  }

  function setActiveList(listId: string) {
    if (lists.value.some(l => l.id === listId)) {
      activeListId.value = listId;
      console.log('Active list set to:', listId);
    }
  }

  function removeList(listId: string) {
    const index = lists.value.findIndex(l => l.id === listId);
    if (index !== -1) {
      lists.value.splice(index, 1);
      if (activeListId.value === listId) {
        activeListId.value = lists.value.length > 0 ? lists.value[0].id : null;
        initializeDefaultList();
      }
      console.log('Removed list:', listId);
    }
  }

  function clearLastAddedItem() {
    lastAddedItem.value = null;
    console.log('Cleared last added item');
  }

  return {
    lists,
    activeListId,
    lastAddedItem,
    createList,
    addItem,
    getActiveList,
    setActiveList,
    removeList,
    clearLastAddedItem
  };
});