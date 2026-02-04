"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { manageSearchParameters } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";
import { MAX_LIMIT, MIN_LIMIT } from "@/lib/constants";

const durationPresets = [
  { value: `${MIN_LIMIT},90`, label: "< 1.30h" },
  { value: "90,120", label: "1.30h - 2h" },
  { value: "120,150", label: "2h - 2.30h" },
  { value: `150,${MAX_LIMIT}`, label: "> 2.30h" },
];

export const DurationFilterPreset = () => {
  const router = useRouter();
  const currentSearchParams = useSearchParams();
  const currentDuration = currentSearchParams.get("duration");

  function handleDuration(value: string) {
    manageSearchParameters(
      "duration",
      value,
      currentDuration === value ? value : undefined,
      currentSearchParams,
      router,
      undefined,
      "duration",
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Clock className="text-muted-foreground hidden h-5 w-5 xl:block" />
      {durationPresets.map((item) => {
        const isActive = currentDuration === item.value;
        return (
          <button
            key={item.value}
            onClick={() => handleDuration(item.value)}
            className={cn(
              "group relative cursor-pointer overflow-hidden rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-300",
              "border-2",
              // Light mode - vibrant purple gradient
              "border-main-ui-purple from-main-ui-purple to-subgenre bg-gradient-to-br via-[#6b5cff]",
              "hover:scale-105 hover:border-[#6b5cff]",
              "hover:shadow-[0_0_12px_rgba(74,58,255,0.5),0_0_24px_rgba(74,58,255,0.25)]",
              // Dark mode
              "dark:border-specification/30 dark:from-dark-blue dark:via-main-dark-bg dark:to-main-ui-purple/40 dark:bg-gradient-to-br",
              "dark:hover:border-specification",
              "dark:hover:shadow-[0_0_12px_rgba(100,252,254,0.4),0_0_24px_rgba(100,252,254,0.2)]",
              "active:scale-95",
              isActive && [
                // Light mode active - much more distinct
                "border-success from-success bg-gradient-to-br via-[#3dd87a] to-[#25b35a]",
                "shadow-[0_0_15px_rgba(45,194,106,0.6),0_0_30px_rgba(45,194,106,0.3)]",
                "hover:border-[#25b35a]",
                "hover:shadow-[0_0_18px_rgba(45,194,106,0.7),0_0_36px_rgba(45,194,106,0.4)]",
                // Dark mode active
                "dark:border-specification dark:from-specification/30 dark:via-dark-blue dark:to-specification/20 dark:bg-gradient-to-br",
                "dark:shadow-[0_0_15px_rgba(100,252,254,0.5),0_0_30px_rgba(100,252,254,0.25)]",
                "dark:hover:shadow-[0_0_18px_rgba(100,252,254,0.6),0_0_36px_rgba(100,252,254,0.35)]",
              ],
            )}
          >
            <span
              className={cn(
                "relative z-10 transition-colors duration-300",
                isActive
                  ? "dark:text-specification font-bold text-white drop-shadow-md dark:drop-shadow-lg"
                  : "dark:text-white-dark dark:group-hover:text-specification text-white group-hover:text-white",
              )}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
