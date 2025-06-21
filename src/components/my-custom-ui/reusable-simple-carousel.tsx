import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type Props<Datum> = {
  items: Datum[];
  children: (items: Datum) => React.ReactElement;
  /** For items container */
  className?: string;
};

export const ReusableSimpleCarousel = <Datum extends { key: string }>({
  items,
  children,
  className = "",
}: Props<Datum>) => {
  return (
    <Carousel className="w-full" opts={{ dragFree: true }}>
      <CarouselContent
        className={cn("-ml-1 max-w-[340px] xl:max-w-none", className)}
      >
        {items.map((item) => (
          <CarouselItem
            key={item.key}
            className="basis-auto pl-1 md:basis-1/2 xl:basis-1/10"
          >
            {children(item)}
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden xl:flex" />
      <CarouselNext className="hidden xl:flex" />
    </Carousel>
  );
};
