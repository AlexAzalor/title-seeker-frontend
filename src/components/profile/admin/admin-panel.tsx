import {
  ADMIN_ITEMS,
  getMenuItems,
} from "@/components/layout/sidebar/menu-item-collection";
import { Separator } from "@/components/ui/separator";
import { Session } from "next-auth";
import { useTranslations } from "next-intl";
import Link from "next/link";

type Props = {
  session: Session;
};

export const AdminPanel = ({ session }: Props) => {
  const t = useTranslations("MenuItems");

  const moviesCount = session.user.new_movies_to_add_count;

  const items = getMenuItems(t, ADMIN_ITEMS, moviesCount);
  return (
    <>
      <Separator className="my-4" />

      <div className="grid gap-2" aria-label="admin-sidebar-nav">
        {items.map((e) => (
          <Link
            key={e.key}
            href={e.href}
            className="dark:hover:bg-main-dark-hover hover:bg-white-dark relative cursor-pointer rounded-[6px] px-2 py-1 text-lg transition-colors"
          >
            {e.label}
            {e.extraElement}
          </Link>
        ))}
      </div>
    </>
  );
};
