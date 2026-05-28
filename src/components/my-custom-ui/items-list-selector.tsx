import { memo } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { checkIfAdmin } from "@/proxy";
import { Check, Info, X } from "lucide-react";

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
  another_lang_name?: string;
  description?: string;
  parent_genre_key?: string;
};

type Props<Datum extends ItemFields> = {
  items: Datum[];
  onSelect: (item: Datum) => void;
  onOpenModal?: () => void;
  checkIconStyle: string[];
  emptyText?: string;
  onExclude?: (item: Datum) => void;
  excludedKeys?: string[];
};

const ItemsSelector = <Datum extends ItemFields>({
  items,
  onSelect,
  onOpenModal,
  checkIconStyle,
  emptyText,
  onExclude,
  excludedKeys,
}: Props<Datum>) => {
  const session = useSession();
  const t = useTranslations("MenuItems");

  const isAdmin = checkIfAdmin(session.data?.user.role);

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
              {/* after add, set value from this input to form's input */}
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
          {items.map((item) => {
            const value = item.another_lang_name
              ? item.name + " " + item.another_lang_name
              : item.name;

            return (
              <div className="flex items-center" key={item.key}>
                <CommandItem
                  key={item.key}
                  value={value}
                  onSelect={() => onSelect(item)}
                  className="w-full cursor-pointer"
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
                {onExclude && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      onExclude(item);
                    }}
                    className={cn(
                      "rounded-sm p-2.5 transition-colors",
                      excludedKeys?.includes(item.key)
                        ? "text-red-500"
                        : "text-muted-foreground/40 hover:bg-red-500/10 hover:text-red-500",
                    )}
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            );
          })}
        </CommandGroup>
      </CommandList>
    </>
  );
};

const ItemsSelectorMemo = memo(ItemsSelector) as typeof ItemsSelector;

export { ItemsSelectorMemo as ItemsSelector };
