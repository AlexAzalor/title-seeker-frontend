import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Dimensions mirror MoviesCarousel / PeopleCarousel so content swaps in without layout shift.
const TitleSkeleton = () => <Skeleton className="mb-3 h-8 w-64 max-w-full" />;

export function MoviesCarouselSkeleton() {
  return (
    <div className="w-full" aria-label="movies-carousel-skeleton" aria-busy>
      <TitleSkeleton />
      <div className="-ml-1 flex max-w-[340px] gap-0 overflow-hidden xl:max-w-none">
        {Array.from({ length: 3 }).map((_, n) => (
          <div key={n} className="shrink-0 pl-1">
            <div className="w-[330px] p-1 xl:w-[806px]">
              <Card className="dark:border-dark-border">
                <CardContent className="flex aspect-square h-52 w-full items-center justify-center gap-2 p-2">
                  <Skeleton className="h-full w-[110px] shrink-0" />
                  <div className="flex h-full min-w-0 flex-1 flex-col justify-center gap-3">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-5 w-1/2" />
                    <Skeleton className="hidden h-5 w-full xl:block" />
                    <div className="flex gap-1">
                      <Skeleton className="h-8 w-16" />
                      <Skeleton className="h-8 w-16" />
                    </div>
                    <div className="hidden gap-1 xl:flex">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="size-12 rounded-full" />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PeopleCarouselSkeleton() {
  return (
    <div className="w-full" aria-label="people-carousel-skeleton" aria-busy>
      <TitleSkeleton />
      <div className="-ml-1 flex max-w-85 gap-0 overflow-hidden xl:max-w-none">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="shrink-0 basis-auto pl-1 md:basis-1/2 xl:basis-1/10"
          >
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-2">
                  <div className="flex w-[152px] flex-col items-center gap-3 xl:w-auto">
                    <Skeleton className="size-18 rounded-full" />
                    <Skeleton className="h-6 w-28" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
