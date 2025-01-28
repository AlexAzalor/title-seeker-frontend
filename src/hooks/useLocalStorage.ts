import { useRef } from "react";
import { toast } from "sonner";

export const useLocalStorage = <T extends object>(
  key: string,
  initialValue: T,
): T => {
  const dataRef = useRef<T>(initialValue);

  if (!dataRef.current.hasOwnProperty("key")) {
    try {
      const savedData = localStorage.getItem(key);
      dataRef.current = savedData ? (JSON.parse(savedData) as T) : initialValue;
    } catch (error) {
      console.error(`Error parsing local storage data for key "${key}"`, error);
      toast.error(`Error parsing local storage data for key "${key}"`);
      dataRef.current = initialValue;
    }
  }

  return dataRef.current;
};
