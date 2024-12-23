export interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  category?: string;
}

export interface ShoppingList {
  id: string;
  name: string;
  items: ShoppingItem[];
}