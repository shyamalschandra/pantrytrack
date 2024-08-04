// Placeholder functions - replace with actual API calls
export const fetchPantryItems = async () => {
  // Simulated API call
  return Promise.resolve([
    { id: 1, name: 'Apple', quantity: 5 },
    { id: 2, name: 'Banana', quantity: 3 },
  ]);
};

// Add an interface definition for Item
interface Item {
  id: number;
  name: string;
  quantity: number;
}

export const addPantryItem = async (item: Item) => {
  // Simulated API call
  return Promise.resolve({ ...item, id: Date.now() });
};

export const updatePantryItem = async (item: Item) => {
  // Simulated API call
  return Promise.resolve(item);
};

export const deletePantryItem = async (_id: number) => {
  // Simulated API call
  return Promise.resolve();
};