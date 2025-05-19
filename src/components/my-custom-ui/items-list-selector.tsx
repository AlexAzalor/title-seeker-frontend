import { useSession } from "next-auth/react";
import { memo } from "react";
import { useTranslations } from "next-intl";
import { Check, Info } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { TooltipWrapper } from "@/components/my-custom-ui/tooltip-wrapper";

type ItemFields = {
  key: string;
  name: string;
  description?: string;
  parent_genre_key?: string;
};

type Props<Datum extends ItemFields> = {
  items: Datum[];
  onSelect: (value: string, itemKey: string, genre: Datum) => void;
  onOpenModal?: () => void;
  checkIconStyle: string[];
  emptyText?: string;
};

const ItemsSelector = <Datum extends ItemFields>({
  items,
  onSelect,
  onOpenModal,
  checkIconStyle,
  emptyText,
}: Props<Datum>) => {
  const session = useSession();
  const t = useTranslations("MenuItems");

  const isAdmin = session.data?.user.role === "owner";

  return (
    <>
      <CommandInput placeholder={t("search")} className="h-9" />
      <CommandList>
        <CommandEmpty>
          {emptyText ? (
            <span className="font-bold">{emptyText}</span>
          ) : (
            <>
              {t("notFound")}{" "}
              {/* after add set value from this input to form's input */}
              {isAdmin && (
                <Button variant="link" onClick={onOpenModal}>
                  {t("addNew")}
                </Button>
              )}
            </>
          )}
        </CommandEmpty>

        <CommandGroup className="text-left">
          {/* need switch lang to search items */}
          {items.map((item) => (
            <CommandItem
              key={item.key}
              value={item.name}
              onSelect={(value) => onSelect(value, item.key, item)}
              className="cursor-pointer"
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
                  checkIconStyle.find((key) => key === item.key)
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

const ItemsSelectorMemo = memo(ItemsSelector) as typeof ItemsSelector;

export { ItemsSelectorMemo as ItemsSelector };
