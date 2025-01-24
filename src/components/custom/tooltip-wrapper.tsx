import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
type Props = {
  children: React.ReactNode;
  content: string | React.ReactNode;
};

export const TooltipWrapper = ({ children, content }: Props) => {
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger>{children}</TooltipTrigger>
        <TooltipContent className="w-[684px]">{content}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
