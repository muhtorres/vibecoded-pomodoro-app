const store = {};

module.exports = {
  setItem: jest.fn((key, value) => {
    store[key] = value;
    return Promise.resolve();
  }),
  getItem: jest.fn((key) => {
    return Promise.resolve(store[key] ?? null);
  }),
  removeItem: jest.fn((key) => {
    delete store[key];
    return Promise.resolve();
  }),
  clear: jest.fn(() => {
    Object.keys(store).forEach((key) => delete store[key]);
    return Promise.resolve();
  }),
  getAllKeys: jest.fn(() => Promise.resolve(Object.keys(store))),
  multiGet: jest.fn((keys) =>
    Promise.resolve(keys.map((key) => [key, store[key] ?? null]))
  ),
  multiSet: jest.fn((entries) => {
    entries.forEach(([key, value]) => {
      store[key] = value;
    });
    return Promise.resolve();
  }),
};
