"use client";

import { useState } from "react";
import { Check, Copy, X } from "lucide-react";
import { cn } from "@/lib/utils";

type CopyState = "idle" | "success" | "error";

/**
 * Writes both an HTML hyperlink and a plain-text fallback to the clipboard.
 *
 * - Applications that support rich clipboard content (Gmail, Google Docs,
 *   Slack, Microsoft Word, etc.) will paste a clickable `<a>` element.
 * - Plain-text fields receive a human-readable fallback: "label (url)".
 *
 * The modern `ClipboardItem` API is used when available; older browsers and
 * restricted contexts (e.g. non-HTTPS) fall back to `writeText`.
 * @example url={`${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/movies/${movie_key}`}
 */
async function copyLinkToClipboard(label: string, url: string): Promise<void> {
  const htmlContent = `<a href="${url}">${label}</a>`;
  const plainContent = `${label} (${url})`;

  if (typeof ClipboardItem !== "undefined" && navigator.clipboard.write) {
    // Provide both MIME types so the receiving app can pick the richest format
    const htmlBlob = new Blob([htmlContent], { type: "text/html" });
    const textBlob = new Blob([plainContent], { type: "text/plain" });
    await navigator.clipboard.write([
      new ClipboardItem({ "text/html": htmlBlob, "text/plain": textBlob }),
    ]);
  } else {
    // Fallback for browsers that do not support ClipboardItem
    await navigator.clipboard.writeText(plainContent);
  }
}

interface CopyButtonProps {
  /** Visible text for the hyperlink (e.g. the movie title) */
  label: string;
  /** Fully-qualified URL the hyperlink points to */
  url?: string;
  className?: string;
}

export const CopyButton = ({ label, url, className }: CopyButtonProps) => {
  const [copyState, setCopyState] = useState<CopyState>("idle");

  const handleCopy = async () => {
    try {
      if (!url) {
        await navigator.clipboard.writeText(label);
      } else {
        await copyLinkToClipboard(label, url);
      }
      setCopyState("success");
    } catch (err) {
      console.error("Failed to copy link:", err);
      setCopyState("error");
    } finally {
      // Reset back to idle after giving the user time to see the feedback
      setTimeout(() => setCopyState("idle"), 2000);
    }
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <button
        title="Copy title to clipboard"
        onClick={handleCopy}
        className="flex items-center gap-2 rounded opacity-50 transition-opacity hover:opacity-100"
      >
        {copyState === "success" ? (
          <Check size={14} className="stroke-green-500 dark:stroke-green-400" />
        ) : copyState === "error" ? (
          <X size={14} className="stroke-red-500 dark:stroke-red-400" />
        ) : (
          <Copy size={14} className="stroke-gray-500 dark:stroke-gray-300" />
        )}
      </button>
    </div>
  );
};
