import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Custom error class for storage quota exceeded errors
 */
export class StorageQuotaError extends Error {
  constructor(message: string = "Storage quota exceeded") {
    super(message);
    this.name = "StorageQuotaError";
  }
}

/**
 * Checks if an error is a storage quota error
 * @param error - The error to check
 * @returns true if the error is a storage quota error
 */
export function isStorageQuotaError(error: unknown): error is StorageQuotaError {
  if (error instanceof StorageQuotaError) {
    return true;
  }
  // Check for DOMException QuotaExceededError (web)
  if (typeof DOMException !== "undefined" && error instanceof DOMException && error.name === "QuotaExceededError") {
    return true;
  }
  // Check for error messages that indicate quota issues
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return (
      message.includes("quota") ||
      message.includes("exceeded") ||
      message.includes("full")
    );
  }
  return false;
}

/**
 * Storage utility that provides a consistent API for persistent storage
 * across all platforms (iOS, Android, Web)
 */
class Storage {
  /**
   * Store a value in storage
   * @param key - The storage key
   * @param value - The value to store (will be JSON stringified)
   * @returns Promise that resolves when the value is stored
   */
  async set<T>(key: string, value: T): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error(`Error storing value for key "${key}":`, error);
      
      if (isStorageQuotaError(error)) {
        throw new StorageQuotaError(
          `Storage quota exceeded while storing key "${key}". Please free up some storage space.`
        );
      }
      else {
        throw error;
      }
    }
  }

  /**
   * Retrieve a value from storage
   * @param key - The storage key
   * @returns Promise that resolves to the stored value, or null if not found
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      if (jsonValue === null) {
        return null;
      }
      return JSON.parse(jsonValue) as T;
    } catch (error) {
      console.error(`Error retrieving value for key "${key}":`, error);
      return null;
    }
  }

  /**
   * Remove a value from storage
   * @param key - The storage key
   * @returns Promise that resolves when the value is removed
   */
  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing value for key "${key}":`, error);
      throw error;
    }
  }

  /**
   * Clear all storage
   * @returns Promise that resolves when all storage is cleared
   */
  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error("Error clearing storage:", error);
      throw error;
    }
  }

  /**
   * Get all keys in storage
   * @returns Promise that resolves to an array of all keys
   */
  async getAllKeys(): Promise<readonly string[]> {
    try {
      return await AsyncStorage.getAllKeys();
    } catch (error) {
      console.error("Error getting all keys:", error);
      return [];
    }
  }
}

// Export a singleton instance
export const storage = new Storage();

// Export the class for testing or custom instances
export default Storage;

