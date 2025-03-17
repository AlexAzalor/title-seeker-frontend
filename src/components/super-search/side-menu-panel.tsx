"use client";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

type Props = {
  children: React.ReactNode;
  side: "top" | "right" | "bottom" | "left";
  type: string;
  handleOnly?: boolean;
};

export const SideMenuPanel = ({ children, side, type, handleOnly }: Props) => {
  return (
    <Drawer direction={side} handleOnly={handleOnly}>
      <DrawerTrigger className="bg-Dark-cyan m-1 p-1 lg:hidden">
        {type}
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Are you absolutely sure?</DrawerTitle>
          <DrawerDescription>This action cannot be undone.</DrawerDescription>
        </DrawerHeader>
        {children}
      </DrawerContent>
    </Drawer>
  );
};
