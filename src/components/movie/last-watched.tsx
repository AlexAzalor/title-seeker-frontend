"use client";

import { useLocalStorage } from "@/hooks/useLocalStorage";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "../ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "../ui/carousel";
import { useMediaQuery } from "@/hooks/useMediaQuery";
type Props = {
  posterURL: string;
};
export const LastWatched = ({ posterURL }: Props) => {
  const isMobile = useMediaQuery("(max-width: 640px)");

  const { data: parsedData } = useLocalStorage<
    { key: string; poster: string }[]
  >("last_watched", [] as { key: string; poster: string }[]);

  return (
    parsedData.length > 0 && (
      <>
        <h2 className="text-2xl font-bold">Last Watched</h2>

        {isMobile ? (
          <Carousel className="w-full" opts={{ dragFree: true }}>
            <CarouselContent className="-ml-1 max-w-[340px] lg:max-w-none">
              {parsedData.reverse().map((title) => (
                <CarouselItem
                  key={title.key}
                  className="basis-auto pl-1 md:basis-1/2 lg:basis-1/10"
                >
                  <div className="p-1">
                    <Card className="">
                      <CardContent className="flex aspect-square items-center justify-center p-2">
                        <Link
                          href={`/movies/${title.key}`}
                          key={title.key}
                          className="flex flex-col items-center justify-start gap-3"
                        >
                          <Image
                            src={`${posterURL}/posters/${title.poster}`}
                            alt="Title Poster"
                            height={100}
                            width={80}
                          />
                        </Link>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden lg:flex" />
            <CarouselNext className="hidden lg:flex" />
          </Carousel>
        ) : (
          <div className="flex flex-col gap-5 lg:flex-row">
            {parsedData.reverse().map((title) => (
              <Link
                key={title.key}
                href={`/movies/${title.key}`}
                className="flex w-full items-center gap-2"
              >
                <Image
                  src={`${posterURL}/posters/${title.poster}`}
                  alt="Title Poster"
                  className="h-auto w-auto"
                  height={100}
                  width={80}
                />
              </Link>
            ))}
          </div>
        )}
      </>
    )
  );
};
