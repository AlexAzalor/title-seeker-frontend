import { memo } from "react";
import { Check, Info } from "lucide-react";

import type { ActorOutNameUk, GenreOutDescription } from "@/orval_api/model";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { TooltipWrapper } from "@/components/custom/tooltip-wrapper";

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
  name_uk?: ActorOutNameUk;
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

        <CommandGroup className="text-left">
          {/* need switch lang to search items */}
          {items.map((item) => (
            <CommandItem
              key={item.key}
              value={item.name + " " + item.name_uk}
              onSelect={(value) => onSelect(value, item.key, item)}
            >
              <p>{item.name}</p>

              {!!item.description && (
                <TooltipWrapper content={item.description}>
                  <Info className="ml-2" />
                </TooltipWrapper>
              )}

              <Check
                className={cn(
                  "ml-auto",
                  checkIconStyle.find((e) =>
                    typeof e === "string" ? e === item.key : e.key === item.key,
                  )
                    ? "opacity-100"
                    : "opacity-0",
                )}
              />
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </>
  );
};

const ItemsListSelectorMemo = memo(ItemsListSelector);

export { ItemsListSelectorMemo as ItemsListSelector };
