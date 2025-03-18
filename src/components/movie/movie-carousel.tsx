"use client";
import { useRef } from "react";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

export function MoviesCarousel() {
  // wrapper?
  const plugin = useRef(Autoplay({ delay: 5000 }));
  return (
    <div className="w-full">
      <Carousel
        className="lg:w-full"
        plugins={[plugin.current]}
        onMouseEnter={plugin.current.stop}
        onMouseLeave={() => plugin.current.play()}
        opts={{ loop: true }}
      >
        <CarouselContent className="max-w-[340px] lg:max-w-none">
          {Array.from({ length: 10 }).map((_, index) => (
            <CarouselItem key={index} className="">
              <div className="p-1">
                <Card className="">
                  <CardContent className="flex aspect-square h-52 items-center justify-center p-6">
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
