import { Fragment } from "react";
import Link from "next/link";
import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export type MenuItem = {
  href: string;
  icon: React.ReactNode;
  label: string;
  key: string;
};

type Props = {
  /** Show separator after item keys */
  showAfterKeys: string[];
  items: MenuItem[];
};

export const ItemsGroup = ({ items, showAfterKeys }: Props) => {
  return (
    <DropdownMenuGroup>
      {items.map(({ href, icon, label, key }) => (
        <Fragment key={key}>
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href={href}>
              {icon}
              {label}
            </Link>
          </DropdownMenuItem>
          {showAfterKeys.includes(key) && <DropdownMenuSeparator />}
        </Fragment>
      ))}
    </DropdownMenuGroup>
  );
};
