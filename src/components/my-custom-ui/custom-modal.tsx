import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBodyScrollLock } from "@/hooks/use-body-scroll-lock";
import { X } from "lucide-react";

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
            className="dark:bg-main-dark-bg bg-main-bg-surface w-full max-w-lg rounded-2xl p-6 shadow-xl"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <X
              onClick={onClose}
              className="ml-auto h-4 w-4 cursor-pointer transition-transform hover:scale-125"
            />
            <div className="max-h-180 overflow-auto px-2">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
