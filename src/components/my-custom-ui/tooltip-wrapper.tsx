"use client";

import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Props = {
  children?: React.ReactNode;
  content: string | React.ReactNode;
  asChild?: boolean;
  side?: "top" | "right" | "bottom" | "left";
  className?: string;
  delay?: number;
};

export const TooltipWrapper = ({
  children = <Info height={16} width={16} />,
  content,
  asChild,
  side,
  className,
  delay = 300,
}: Props) => {
  const isMobile = useMediaQuery("(max-width: 640px)");

  if (isMobile) {
    return null; // Do not render tooltip on mobile
  }

  return (
    <TooltipProvider delayDuration={delay}>
      <Tooltip>
        <TooltipTrigger className="cursor-default" asChild={asChild}>
          {children}
        </TooltipTrigger>
        <TooltipContent side={side} className={cn("w-[684px]", className)}>
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
