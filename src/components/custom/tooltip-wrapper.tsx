import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
type Props = {
  children: React.ReactNode;
  content: string | React.ReactNode;
  asChild?: boolean;
  side?: "top" | "right" | "bottom" | "left";
};

export const TooltipWrapper = ({ children, content, asChild, side }: Props) => {
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild={asChild}>{children}</TooltipTrigger>
        <TooltipContent side={side} className="w-[684px]">
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
