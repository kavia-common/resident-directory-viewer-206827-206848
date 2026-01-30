/**
 * Jest setup for the CRA test environment.
 *
 * - Adds jest-dom matchers.
 * - Polyfills/mocks browser APIs not implemented by JSDOM (e.g., matchMedia).
 */

// jest-dom adds custom jest matchers for asserting on DOM nodes.
import "@testing-library/jest-dom";

// Some components use matchMedia for responsive behavior; JSDOM doesn't provide it.
// This mock keeps tests deterministic and prevents crashes during initial render.
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {}, // deprecated
    removeListener: () => {}, // deprecated
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});
