module.exports = {
  activateKeepAwakeAsync: jest.fn(() => Promise.resolve()),
  deactivateKeepAwake: jest.fn(),
  useKeepAwake: jest.fn(),
};
