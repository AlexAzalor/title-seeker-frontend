import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { z } from "zod";
import { ActorSchemeType, DirectorSchemeType } from "@/types/zod-scheme";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { ActorOut, DirectorOut } from "@/orval_api/model";

type Props<Datum, T> = {
  items: Datum[];
  onSelect: (value: string, itemKey: string) => void;
  onOpenModal: () => void;
  checkIconStyle: T[];
};

export type ASchemeType = z.infer<typeof ActorSchemeType>;
export type DSchemeType = z.infer<typeof DirectorSchemeType>;

export const ItemsListSelector = <
  Datum extends ActorOut | DirectorOut,
  T extends ASchemeType | DSchemeType,
>({
  items,
  onSelect,
  onOpenModal,
  checkIconStyle,
}: Props<Datum, T>) => {
  const [openItemsList, setOpenItemsList] = useState(false);

  return (
    <Popover open={openItemsList} onOpenChange={setOpenItemsList}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          // aria-expanded={openSpec}
          className="h-max w-max justify-between"
        >
          {"Select item..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search items..." className="h-9" />
          <CommandList>
            <CommandEmpty>
              No item found.{" "}
              {/* after add set value from this input to form's input */}
              <Button variant="link" onClick={onOpenModal}>
                Add?
              </Button>
            </CommandEmpty>

            <TooltipProvider>
              <CommandGroup className="text-left">
                {/* need switch lang to search actors */}
                {items.map((item) => (
                  <CommandItem
                    key={item.key}
                    value={item.full_name}
                    onSelect={(value) => onSelect(value, item.key)}
                  >
                    <Tooltip>
                      <TooltipTrigger className="text-left">
                        {item.full_name}
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{"Some short info?"}</p>
                      </TooltipContent>
                    </Tooltip>

                    <Check
                      className={cn(
                        "ml-auto",
                        checkIconStyle.find((e) => e.key === item.key)
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </TooltipProvider>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
