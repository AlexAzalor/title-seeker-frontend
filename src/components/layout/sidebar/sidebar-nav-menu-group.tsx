import Link from "next/link";
import {
  SidebarGroupLabel,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

export type MenuItem = {
  href: string;
  key: string;
  icon: React.ReactNode;
  label: string;
  extraElement?: React.ReactNode;
};

type Props = {
  title: string;
  items: MenuItem[];
};

export const SidebarNavMenuGroup = ({ items, title }: Props) => {
  return (
    <SidebarMenuItem>
      <SidebarGroupLabel className="text-sm">
        <p className="font-medium">{title}</p>
      </SidebarGroupLabel>

      <SidebarMenuSub className="ml-0 border-l-0 px-1.5">
        {items.map(({ href, key, icon, label, extraElement }) => (
          <SidebarMenuSubItem key={key}>
            <SidebarMenuSubButton asChild>
              <Link href={href}>
                {icon}
                <span>{label}</span>
              </Link>
            </SidebarMenuSubButton>

            {extraElement}
          </SidebarMenuSubItem>
        ))}
      </SidebarMenuSub>
    </SidebarMenuItem>
  );
};
