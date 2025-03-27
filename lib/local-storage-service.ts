// Create a new service for localStorage operations
// This will ensure data persistence even when Firebase is not available

// Check if we're in the browser environment
const isBrowser = typeof window !== "undefined"

// Generic function to get data from localStorage
export const getFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  if (!isBrowser) return defaultValue;
  
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error getting ${key} from localStorage:`, error);
    return defaultValue;
  }
};

// Generic function to save data to localStorage
export const saveToLocalStorage = <T>(key: string, data: T): void => {
  if (!isBrowser) return;
  
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

// Function to clear specific keys from localStorage
export const clearFromLocalStorage = (keys: string[]): void => {
  if (!isBrowser) return;
  
  try {
    keys.forEach(key => localStorage.removeItem(key));
  } catch (error) {
    console.error(`Error clearing keys from localStorage:`, error);
  }
};

// Function to get all items with a specific prefix
export const getItemsWithPrefix = (prefix: string): Record<string, any> => {
  if (!isBrowser) return {};
  
  const items: Record<string, any> = {};
  
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix)) {
        items[key] = JSON.parse(localStorage.getItem(key) || "null");
      }
    }
  } catch (error) {
    console.error(`Error getting items with prefix ${prefix}:`, error);
  }
  
  return items;
};

// Function to trigger a refresh event
export const triggerRefreshEvent = (): void => {
  if (!isBrowser) return;
  
  try {
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new CustomEvent("portfolio-data-updated"));
  } catch (error) {
    console.error("Error triggering refresh event:", error);
  }
};

