import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

global.IntersectionObserver = class {
  constructor() {}

  observe() {
    return null;
  }

  unobserve() {
    return null;
  }

  disconnect() {
    return null;
  }
};

beforeAll(() => {
  global.HTMLDialogElement = class extends HTMLElement {
    showModal = jest.fn();
    close = jest.fn();
  };
});

afterAll(() => {
  // Clean up the global mock after all tests
  delete global.HTMLDialogElement;
});
