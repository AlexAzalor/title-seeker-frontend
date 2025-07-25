import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { ReusableSimpleCarousel } from "@/components/my-custom-ui/reusable-simple-carousel";
import { Language, type TopPerson } from "@/orval_api/model";

type Props = {
  type: "actor" | "director";
  name: string;
  people: TopPerson[];
  lang: Language;
  avatarURL: string;
};

export function PeopleCarousel({ type, name, people, avatarURL }: Props) {
  return (
    <div className="w-full" aria-label="people-carousel">
      <h2 className="mb-3 text-2xl lg:text-3xl">{name}</h2>
      <ReusableSimpleCarousel items={people}>
        {(person) => (
          <div className="p-1">
            <Card>
              <CardContent className="flex aspect-square items-center justify-center p-2">
                <Link
                  href={`/super-search/?${type}=${person.key}`}
                  key={person.key}
                  className="flex flex-col items-center justify-start gap-3"
                >
                  <div className="size-18 rounded-full">
                    <Image
                      src={`${avatarURL}/${type}s/${person.avatar_url}`}
                      alt="Person Avatar"
                      className="size-18 rounded-full object-cover"
                      height={72}
                      width={72}
                    />
                  </div>
                  <div className="w-[152px] text-center xl:w-auto">
                    <div className="text-lg font-bold">
                      {person.name} ({person.movie_count})
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
