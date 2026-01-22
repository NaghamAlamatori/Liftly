import * as React from "react";
import { X } from "lucide-react";
import { Button } from "./button";

/**
 * ConfirmDialog (Figma Delete Modal)
 * Matches node `362:1585`:
 * - Centered white modal with close icon
 * - Single primary action button
 */
export function ConfirmDialog({
  open,
  title = "Confirm Delete",
  description,
  confirmText = "Yes, Delete",
  showCancel = false,
  cancelText = "Cancel",
  loading = false,
  onConfirm,
  onClose,
}) {
  React.useEffect(() => {
    if (!open) return;
    function onKey(e) {
      if (e.key === "Escape") onClose?.();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/60" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        className="fixed left-1/2 top-1/2 z-50 w-[620px] max-w-[calc(100%-32px)] -translate-x-1/2 -translate-y-1/2 rounded-[20px] bg-[#fffefb] px-[54px] py-[53px] shadow-[0px_24px_60px_rgba(0,0,0,0.45)]"
      >
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute right-[21px] top-[22px] text-black/70"
          disabled={loading}
        >
          <X className="h-[17px] w-[17px]" />
        </button>

        <div className="flex flex-col items-center whitespace-pre-wrap">
          <p className="w-[512px] text-[24px] font-bold leading-[35px] text-[hsl(var(--brand-2))]">
            {title}
          </p>
          {description ? (
            <p className="mt-2 w-[512px] text-[18px] font-bold leading-[50px] text-black">{description}</p>
          ) : null}
        </div>

        <div className="mt-10 flex justify-center gap-4">
          {showCancel ? (
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              {cancelText}
            </Button>
          ) : null}
          <Button
            type="button"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Deleting..." : confirmText}
          </Button>
        </div>
      </div>
    </>
  );
}

