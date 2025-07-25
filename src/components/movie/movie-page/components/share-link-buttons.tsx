"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { Check, Copy } from "lucide-react";
import { TelegramIcon } from "@/lib/portfolio/tech-icons";
import { cn } from "@/lib/utils";

export const ShareLinkButtons = () => {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const [copied, setCopied] = useState(false);
  const url = window.location.origin + pathname;

  // Content: &text=${encodeURIComponent("Check this out!")}
  const telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <div
      className={cn(
        isMobile
          ? "fixed bottom-2 left-2 z-50 flex flex-col gap-2 opacity-70"
          : "flex items-center gap-2",
      )}
    >
      <button
        title="Copy link"
        onClick={handleCopy}
        className="flex items-center gap-2 rounded bg-neutral-100 px-4 py-2 transition-colors hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600"
      >
        {copied ? (
          <Check className="stroke-gray-500 dark:stroke-gray-300" />
        ) : (
          <Copy className="stroke-gray-500 dark:stroke-gray-300" />
        )}
      </button>

      <a
        title="Share on Telegram"
        href={telegramShareUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center rounded bg-neutral-100 px-4 py-2 transition-colors hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600"
      >
        <TelegramIcon />
      </a>
    </div>
  );
};
