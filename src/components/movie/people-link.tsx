import Link from "next/link";
import Image from "next/image";
import { MovieActor, MovieDirector } from "@/orval_api/model";
import { IMAGE_URL } from "@/lib/constants";

type Props = {
  person: MovieActor | MovieDirector;
  linkQueryParam: string;
  type: "actors" | "directors";
};

export const PersonLink = ({ linkQueryParam, person, type }: Props) => {
  return (
    <Link
      href={`/super-search/?${linkQueryParam}=${person.key}`}
      key={person.key}
      className="flex flex-col items-center justify-start gap-3"
    >
      <div className="size-18 rounded-full">
        <Image
          src={`${IMAGE_URL}/api/avatars/${type}/${person.avatar_url}`}
          alt={`${type === "actors" ? "Actor" : "Director"} Avatar`}
          className="size-18 rounded-full object-cover"
          height={72}
          width={72}
        />
      </div>
      <div className="text-center">
        <div className="text-xl font-bold">
          {person.first_name + " " + person.last_name}
        </div>
        {type === "actors" && "character_name" in person && (
          <span className="text-sm">{person.character_name}</span>
        )}
      </div>
    </Link>
  );
};
