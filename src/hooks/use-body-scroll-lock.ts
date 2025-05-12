import { useLayoutEffect } from "react";

/**
 * useBodyScrollLock is a custom hook that locks the body scroll when the lock parameter is true.
 * It sets the body's overflow to hidden and adds padding to prevent layout shift.
 * When the lock parameter is false, it resets the body's overflow and padding.
 *
 * @param {boolean} lock - A boolean value to lock or unlock the body scroll.
 */
export const useBodyScrollLock = (lock: boolean) => {
  useLayoutEffect(() => {
    if (lock) {
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [lock]);
};
