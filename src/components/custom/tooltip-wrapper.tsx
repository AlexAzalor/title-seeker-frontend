import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
type Props = {
  children: React.ReactNode;
  content: string | React.ReactNode;
  asChild?: boolean;
  side?: "top" | "right" | "bottom" | "left";
  className?: string;
};

export const TooltipWrapper = ({
  children,
  content,
  asChild,
  side,
  className,
}: Props) => {
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
