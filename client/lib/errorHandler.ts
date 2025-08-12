// Global error handler for suppressing expected fetch errors in demo mode

export const setupGlobalErrorHandling = () => {
  // Handle unhandled promise rejections (like fetch errors)
  window.addEventListener("unhandledrejection", (event) => {
    const error = event.reason;

    // Check if it's a fetch-related error that we expect in demo mode
    if (
      error instanceof TypeError &&
      (error.message.includes("fetch") ||
        error.message.includes("Failed to fetch") ||
        error.message.includes("Network request failed"))
    ) {
      event.preventDefault(); // Prevent the error from being logged as unhandled
      return;
    }

    // Check if it's a backend unavailable error
    if (
      error instanceof Error &&
      error.message.includes("Backend unavailable")
    ) {
      event.preventDefault();
      return;
    }

    // Let other errors through normally (silently)
    // console.error('Unhandled promise rejection:', error);
  });

  // Handle regular JavaScript errors
  window.addEventListener("error", (event) => {
    const error = event.error;

    // Suppress fetch-related errors
    if (
      error instanceof TypeError &&
      (error.message.includes("fetch") ||
        error.message.includes("Failed to fetch"))
    ) {
      event.preventDefault();
      return;
    }

    // Let other errors through (silently)
    // console.error('Global error:', error);
  });
};

// Auto-setup when module loads
if (typeof window !== "undefined") {
  setupGlobalErrorHandling();
}
