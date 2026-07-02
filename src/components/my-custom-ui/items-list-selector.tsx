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
  movie_count?: number;
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
  // console.log("items", items);

  const session = useSession();
  const t = useTranslations("MenuItems");

  const isAdmin = checkIfAdmin(session.data?.user.role);

  const sortedItems = [...items].sort(
    (a, b) => (b.movie_count ?? 0) - (a.movie_count ?? 0),
  );

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
          {sortedItems.map((item) => {
            const value = item.another_lang_name
              ? item.name + " " + item.another_lang_name
              : item.name;

            return (
              <CommandItem
                key={item.key}
                value={value}
                onSelect={() => onSelect(item)}
                className={cn(
                  "w-full cursor-pointer",
                  excludedKeys?.includes(item.key) &&
                    "pointer-events-none opacity-50",
                )}
              >
                <p>
                  {item.name}{" "}
                  <span className="text-lg text-red-600">
                    ({item.movie_count})
                  </span>
                </p>

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

                {onExclude && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      onExclude(item);
                    }}
                    className={cn(
                      "rounded-sm p-2 transition-colors",
                      excludedKeys?.includes(item.key)
                        ? "pointer-events-auto bg-red-500/10 text-red-500 hover:scale-110"
                        : "text-muted-foreground/40 hover:bg-red-500/10 hover:text-red-500",
                    )}
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </CommandItem>
            );
          })}
        </CommandGroup>
      </CommandList>
    </>
  );
};

const ItemsSelectorMemo = memo(ItemsSelector) as typeof ItemsSelector;

export { ItemsSelectorMemo as ItemsSelector };
