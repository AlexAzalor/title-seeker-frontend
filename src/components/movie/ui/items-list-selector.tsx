import { memo } from "react";
import { Check } from "lucide-react";

import type { GenreOutDescription } from "@/orval_api/model";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Props<Datum, T> = {
  title?: string;
  items: Datum[];
  onSelect: (value: string, itemKey: string, genre: any) => void;
  onOpenModal: () => void;
  checkIconStyle: T[] | string[];
};

type ItemFields = {
  key: string;
  name: string;
  description?: string | GenreOutDescription;
};

const ItemsListSelector = <Datum extends ItemFields, T extends ItemFields>({
  items,
  onSelect,
  onOpenModal,
  checkIconStyle,
}: Props<Datum, T>) => {
  return (
    <>
      <CommandInput placeholder="Search items..." className="h-9" />
      <CommandList>
        <CommandEmpty>
          No item found.{" "}
          {/* after add set value from this input to form's input */}
          <Button variant="link" onClick={onOpenModal}>
            Add?
          </Button>
        </CommandEmpty>
        <TooltipProvider delayDuration={1000}>
          <CommandGroup className="text-left">
            {/* need switch lang to search items */}
            {items.map((item) => (
              <CommandItem
                key={item.key}
                value={item.name}
                onSelect={(value) => onSelect(value, item.key, item)}
              >
                {!!item.description ? (
                  <Tooltip>
                    <TooltipTrigger className="w-full text-left">
                      {item.name}
                    </TooltipTrigger>
                    <TooltipContent className="w-[684px]">
                      <p>{item.description}</p>
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <p>{item.name}</p>
                )}

                <Check
                  className={cn(
                    "ml-auto",
                    checkIconStyle.find((e) =>
                      typeof e === "string"
                        ? e === item.key
                        : e.key === item.key,
                    )
                      ? "opacity-100"
                      : "opacity-0",
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </TooltipProvider>
      </CommandList>
    </>
  );
};

const ItemsListSelectorMemo = memo(ItemsListSelector);

export { ItemsListSelectorMemo as ItemsListSelector };
