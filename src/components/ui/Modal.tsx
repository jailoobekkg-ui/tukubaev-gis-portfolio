"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import Icon from "@/components/Icon";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  closeLabel?: string;
  children: React.ReactNode;
  wide?: boolean;
};

export default function Modal({ open, onClose, title, closeLabel = "Close", children, wide }: Props) {
  const panel = useRef<HTMLDivElement>(null);
  // Parents pass inline callbacks; keep the latest in a ref so focus handling runs only on open/close.
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeRef.current();
      if (e.key === "Tab" && panel.current) {
        const items = panel.current.querySelectorAll<HTMLElement>("a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex='-1'])");
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    setTimeout(() => panel.current?.querySelector<HTMLElement>("button")?.focus(), 30);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      prev?.focus?.();
    };
  }, [open]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 p-3 backdrop-blur-sm sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ y: 20, scale: 0.98 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 20, scale: 0.98 }}
            className={`card relative flex max-h-full w-full flex-col overflow-hidden bg-bg2 ${wide ? "max-w-6xl" : "max-w-3xl"}`}
          >
            <div className="flex items-start justify-between gap-4 border-b border-line/10 px-5 py-3.5">
              <h3 className="font-display text-base font-semibold leading-snug">{title}</h3>
              <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-muted hover:bg-fg/5 hover:text-fg" aria-label={closeLabel}>
                <Icon name="x" />
              </button>
            </div>
            <div className="overflow-auto p-4 sm:p-5">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
