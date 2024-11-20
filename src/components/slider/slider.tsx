"use client";

import React from "react";

import { Card, CardContent } from "../ui/card";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "../ui/carousel";

const imagesSource = [
  "/static/screen-2.png",
  "/static/screen-3.png",
  "/static/screen-4.png",
  "/static/screen-5.png",
];

export const Slider = () => {
  const plugin = React.useRef(Autoplay({ delay: 5000 }));

  return (
    <Carousel
      // plugins={[plugin.current]}
      className="max-h-[300] w-full max-w-[500]"
      // onMouseEnter={plugin.current.stop}
      // onMouseLeave={plugin.current.play}
    >
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card>
                <CardContent className="flex flex-wrap items-center justify-center gap-1">
                  <div className="parent content-wrapper">
                    <Image
                      className="div1"
                      src="/static/screen-1.png"
                      alt="screen-1"
                      width={600}
                      height={350}
                    />

                    {imagesSource.map((image, index) => (
                      <div
                        className={`small-screenshot div${index + 2}`}
                        key={image}
                      >
                        <Image
                          src={image}
                          alt={image}
                          width={160}
                          height={68}
                        />

                        <Image
                          className="large-screenshot"
                          key={image}
                          src={image}
                          alt={image}
                          width={600}
                          height={350}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};
