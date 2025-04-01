"use client";

import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type Props = {
  children?: React.ReactNode;
  content: string | React.ReactNode;
  asChild?: boolean;
  side?: "top" | "right" | "bottom" | "left";
  className?: string;
};

export const TooltipWrapper = ({
  children = <Info height={16} width={16} />,
  content,
  asChild,
  side,
  className,
}: Props) => {
  const isMobile = useMediaQuery("(max-width: 640px)");

  if (isMobile) {
    return null;
  }

  // TODO: add tooltip for mobile - dropdown or modal
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild={asChild}>{children}</TooltipTrigger>
        <TooltipContent side={side} className={cn("w-[684px]", className)}>
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
