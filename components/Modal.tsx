"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Surface } from "@/components/DesignPrimitives";

export default function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 px-4 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-lg"
          >
            <Surface variant="glass" tone="accent" elevation="high" motion="medium" className="cm-noise-overlay rounded-[28px] p-6">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-xl font-semibold text-white">{title}</h2>
                <button
                  type="button"
                  onClick={onClose}
                  className="cm-button-secondary h-10 w-10 px-0 py-0"
                  aria-label="Close modal"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="mt-5">{children}</div>
            </Surface>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
