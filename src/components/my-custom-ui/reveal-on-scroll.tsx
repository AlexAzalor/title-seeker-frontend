"use client";

import { useEffect, useRef, type PropsWithChildren } from "react";
import { motion, useInView, useAnimation } from "framer-motion";

const VARIANTS = {
  hidden: { opacity: 0, y: 75 },
  visible: { opacity: 1, y: 0 },
};

const TRANSITION = { duration: 0.5, delay: 0.25 };

export const RevealOnScroll = ({ children }: PropsWithChildren) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const mainControls = useAnimation();

  useEffect(() => {
    if (isInView) {
      mainControls.start("visible");
    }
  }, [isInView, mainControls]);

  return (
    <div ref={ref} className="relative w-full overflow-hidden">
      <motion.div
        variants={VARIANTS}
        initial="hidden"
        animate={mainControls}
        transition={TRANSITION}
      >
        {children}
      </motion.div>
    </div>
  );
};
