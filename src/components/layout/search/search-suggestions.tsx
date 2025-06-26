import Link from "next/link";
import {
  SUPPORTED_SEARCH_TYPES,
  type SapportedSearchType,
} from "@/components/layout/search/search";
import { CONTENT_ICONS } from "@/components/layout/sidebar/menu-item-collection";

type Props = {
  navigationKeys: { title: string; key: SapportedSearchType }[];
  t: (key: string) => string;
  close: () => void;
};
export const SearchSuggestions = ({ navigationKeys, t, close }: Props) => (
  <div className="flex flex-col gap-2">
    <p className="mb-1 text-[var(--color-neutral-500)]">{t("suggestions")}</p>
    {navigationKeys.map((item) => {
      if (!SUPPORTED_SEARCH_TYPES.has(item.key)) {
        return;
      }

      return (
        <Link
          key={item.key}
          href={item.key}
          className="dark:hover:bg-main-dark-hover flex w-full items-center gap-1 rounded-sm p-1 transition-all duration-200 select-none hover:bg-neutral-100"
          onClick={close}
        >
          {
            CONTENT_ICONS[
              item.key.replace("/", "") as keyof typeof CONTENT_ICONS
            ]
          }
          <span>{item.title}</span>
        </Link>
      );
    })}
  </div>
);
