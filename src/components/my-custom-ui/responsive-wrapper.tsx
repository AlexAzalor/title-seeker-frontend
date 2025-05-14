import { Button } from "@/components/ui/button";
import { Command, CommandDialog } from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChevronsUpDown } from "lucide-react";
import { useState } from "react";

type Props = {
  title: string;
  children: React.ReactNode;
};

export const ResponsiveWrapper = ({ children, title }: Props) => {
  const [openItemsList, setOpenItemsList] = useState(false);
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <>
        <Button
          onClick={() => setOpenItemsList(true)}
          variant="outline"
          className="w-full"
        >
          {title}
        </Button>

        <CommandDialog open={openItemsList} onOpenChange={setOpenItemsList}>
          {children}
        </CommandDialog>
      </>
    );
  }

  return (
    <Popover open={openItemsList} onOpenChange={setOpenItemsList}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          // aria-expanded={openSpec}
          className="dark:hover:text-main-ui-purple dark:text-gray-purple h-max w-64 justify-between text-xl"
        >
          {title}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-64 p-0">
        <Command>{children}</Command>
      </PopoverContent>
    </Popover>
  );
};
