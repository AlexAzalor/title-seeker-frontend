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
};

export const ReusableSimpleCarousel = <Datum extends { key: string }>({
  items,
  children,
}: Props<Datum>) => {
  return (
    <Carousel className="w-full" opts={{ dragFree: true }}>
      <CarouselContent className="-ml-1 max-w-[340px] xl:max-w-none">
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
