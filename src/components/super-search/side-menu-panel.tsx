import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  side: "top" | "right" | "bottom" | "left";
  type: string;
  handleOnly?: boolean;
  description: string;
};

function SideMenuPanel({
  children,
  side,
  type,
  handleOnly,
  description,
}: Props) {
  return (
    <Drawer direction={side} handleOnly={handleOnly}>
      <DrawerTrigger asChild className="lg:hidden">
        <Button variant="secondary">{type}</Button>
      </DrawerTrigger>
      <DrawerContent
        className={cn(
          "p-3",
          side === "left" && "rounded-r-3xl",
          side === "right" && "rounded-l-3xl",
        )}
      >
        <DrawerHeader>
          <DrawerTitle className="text-center font-bold">{type}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        {children}
      </DrawerContent>
    </Drawer>
  );
}

export default SideMenuPanel;
