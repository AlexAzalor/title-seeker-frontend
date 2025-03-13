import { useEffect } from "react";

type UseDebounceCallback<T> = (...args: T[]) => void;

export const useDebounce = <T>(
  callback: UseDebounceCallback<T>,
  delay = 500,
) => {
  let debounceTimer: NodeJS.Timeout | null = null;

  useEffect(() => {
    // Clear the previous debounce timer when the component unmounts
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  const debounce = (...args: T[]) => {
    // Clear the previous debounce timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // Set a new debounce timer
    debounceTimer = setTimeout(() => {
      callback(...args);
    }, delay);
  };

  return { debounce } as const;
};
