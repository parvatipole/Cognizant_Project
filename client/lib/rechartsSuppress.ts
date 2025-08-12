// Suppress Recharts defaultProps warnings - these are internal to the library
// and cannot be fixed by explicit props in our code

const originalConsoleWarn = console.warn;

console.warn = (...args: any[]) => {
  // Suppress specific Recharts defaultProps warnings
  const message = args[0];
  if (
    typeof message === "string" &&
    message.includes("Support for defaultProps will be removed") &&
    (message.includes("XAxis") || message.includes("YAxis"))
  ) {
    // Silently ignore these warnings from Recharts library
    return;
  }

  // Let other warnings through
  originalConsoleWarn.apply(console, args);
};

export {};
