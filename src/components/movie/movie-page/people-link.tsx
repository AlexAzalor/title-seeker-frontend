import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { formatDate } from "@/lib/utils";
import type { MovieActorOut, MoviePersonOut } from "@/orval_api/model";

type Props = {
  person: MovieActorOut | MoviePersonOut;
  linkQueryParam: string;
  type: "actors" | "directors";
  avatarURL: string;
};

export const PersonLink = ({
  linkQueryParam,
  person,
  type,
  avatarURL,
}: Props) => {
  const t = useTranslations("Form.personFields");

  const age = person.age + ` ${t("age")}`;
  const bornData = `${t("born")}: ` + formatDate(person.born);
  const dead = person.died ? `${t("died")}: ${formatDate(person.died)}` : "";

  const tooltip = `${age}\n${bornData}\n${person.born_location}\n${dead}`;
  const alt = `${type === "actors" ? "Actor" : "Director"} Avatar`;

  const isCharacter = type === "actors" && "character_name" in person;

  return (
    <Link
      href={`/super-search/?${linkQueryParam}=${person.key}`}
      key={person.key}
      className="flex flex-col items-center justify-start gap-3"
    >
      <div title={tooltip} className="size-18 rounded-full">
        <Image
          src={`${avatarURL}/${type}/${person.avatar_url}`}
          alt={alt}
          className="size-18 rounded-full object-cover"
          height={72}
          width={72}
        />
      </div>
      <div className="w-[152px] text-center lg:w-auto">
        <div className="text-xl font-bold">{person.full_name}</div>
        {isCharacter && (
          <span className="text-sm">{person.character_name}</span>
        )}
      </div>
    </Link>
  );
};
