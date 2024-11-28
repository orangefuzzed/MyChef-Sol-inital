// app/utils/sessionUtils.ts

// Utility function to generate a new session ID
export function generateNewSessionId(): string {
    return Date.now().toString(); // Using timestamp for unique session ID generation
  }
  