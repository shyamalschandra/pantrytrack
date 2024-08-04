// Placeholder functions - replace with actual API calls
export const fetchPantryItems = async () => {
  // Simulated API call
  return Promise.resolve([
    { id: 1, name: 'Apple', quantity: 5 },
    { id: 2, name: 'Banana', quantity: 3 },
  ]);
};

export const addPantryItem = async (item) => {
  // Simulated API call
  return Promise.resolve({ ...item, id: Date.now() });
};

export const updatePantryItem = async (item) => {
  // Simulated API call
  return Promise.resolve(item);
};

export const deletePantryItem = async (id) => {
  // Simulated API call
  return Promise.resolve();
};
