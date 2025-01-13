import { useMemo } from "react";
import { toast } from "sonner";

export const useLocalStorage = <T>(key: string, initialValue: T): T => {
  return useMemo(() => {
    try {
      const savedData = localStorage.getItem(key);
      return savedData ? (JSON.parse(savedData) as T) : initialValue;
    } catch (error) {
      console.error(`Error parsing local storage data for key "${key}"`, error);
      toast.error(`Error parsing local storage data for key "${key}"`);
      return initialValue;
    }
  }, [key, initialValue]);
};
