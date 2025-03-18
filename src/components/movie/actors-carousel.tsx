import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export function ActorsCarousel() {
  return (
    <div className="w-full">
      <Carousel className="w-full" opts={{ dragFree: true }}>
        <CarouselContent className="-ml-1 max-w-[340px] lg:max-w-none">
          {Array.from({ length: 100 }).map((_, index) => (
            <CarouselItem
              key={index}
              className="basis-auto pl-1 md:basis-1/2 lg:basis-1/10"
            >
              <div className="p-1">
                <Card className="">
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <span className="text-4xl font-semibold">{index + 1}</span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden lg:flex" />
        <CarouselNext className="hidden lg:flex" />
      </Carousel>
    </div>
  );
}
