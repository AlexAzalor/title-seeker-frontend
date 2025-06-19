import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { ReusableSimpleCarousel } from "@/components/my-custom-ui/reusable-simple-carousel";
import { type Actor, Language } from "@/orval_api/model";

type Props = {
  name: string;
  actors: Actor[];
  lang: Language;
  avatarURL: string;
};

export function ActorsCarousel({ name, actors, avatarURL }: Props) {
  return (
    <div className="w-full" aria-label="actors-carousel">
      <h2 className="mb-3 text-2xl lg:text-3xl">{name}</h2>
      <ReusableSimpleCarousel items={actors}>
        {(actor) => (
          <div className="p-1">
            <Card className="">
              <CardContent className="flex aspect-square items-center justify-center p-2">
                <Link
                  href={`/super-search/?actor=${actor.key}`}
                  key={actor.key}
                  className="flex flex-col items-center justify-start gap-3"
                >
                  <div className="size-18 rounded-full">
                    <Image
                      src={`${avatarURL}/actors/${actor.avatar_url}`}
                      alt={`Actor Avatar`}
                      className="size-18 rounded-full object-cover"
                      height={72}
                      width={72}
                    />
                  </div>
                  <div className="w-[152px] text-center xl:w-auto">
                    <div className="text-lg font-bold">
                      {actor.name} ({actor.movie_count})
                    </div>
                  </div>
                </Link>
              </CardContent>
            </Card>
          </div>
        )}
      </ReusableSimpleCarousel>
    </div>
  );
}
