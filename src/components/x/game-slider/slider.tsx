"use client";

import React from "react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

const imagesSource = [
  "/static/screen-2.png",
  "/static/screen-3.png",
  "/static/screen-4.png",
  "/static/screen-5.png",
];

// This carousel for the Games page
export const Slider = () => {
  const plugin = React.useRef(Autoplay({ delay: 5000 }));

  return (
    <Carousel
      plugins={[plugin.current]}
      className="max-h-300 w-full max-w-500"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={() => plugin.current.play()}
      opts={{ loop: true, dragFree: true }}
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

///////////// CSS

// .content-wrapper {
//   position: relative;
//   z-index: 0;
// }

// .small-screenshot:hover {
//   background-color: transparent;
//   z-index: 50;
// }

// .small-screenshot .large-screenshot {
//   position: absolute;
//   /* left: -1000px; */
//   /* visibility: hidden; */
//   display: none;
//   text-decoration: none;
// }

// .small-screenshot:hover .large-screenshot {
//   /* visibility: visible; */
//   display: block;
//   top: 0;
//   left: 0;
// }

// .parent {
//   display: grid;
//   grid-template-columns: 3fr repeat(2, minmax(1fr, 1fr));
//   /* grid-template-columns: 3fr repeat(2, 1fr); */
//   grid-template-rows: repeat(4, minmax(1fr, 1fr));
//   grid-column-gap: 6px;
//   grid-row-gap: 6px;
// }
// /* "grid grid-cols-[repeat(auto-fit,minmax(min(650px,100%),1fr))] grid-rows-[minmax(auto,auto)] place-items-center gap-5" */
// .div1 {
//   grid-area: 1 / 1 / 5 / 2;
// }
// .div2 {
//   grid-area: 2 / 2 / 3 / 3;
// }
// .div3 {
//   grid-area: 2 / 3 / 3 / 4;
// }
// .div4 {
//   grid-area: 3 / 2 / 4 / 3;
// }
// .div5 {
//   grid-area: 3 / 3 / 4 / 4;
// }
