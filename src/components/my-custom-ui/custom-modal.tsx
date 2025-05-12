import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBodyScrollLock } from "@/hooks/use-body-scroll-lock";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const CustomModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
}) => {
  const backdropRef = useRef(null);

  useBodyScrollLock(isOpen);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={backdropRef}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => {
            if (e.target === backdropRef.current) onClose();
          }}
        >
          <motion.div
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl dark:bg-[#1a183d]"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
