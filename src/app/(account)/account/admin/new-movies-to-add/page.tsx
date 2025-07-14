import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { checkIfOwner } from "@/middleware";
import { cn } from "@/lib/utils";
import { backendURL } from "@/lib/constants";
import { getMovies } from "@/orval_api/movies/movies";
import { getAdminOrRedirect } from "@/app/services/admin-api";

export default async function NewMoviesToAddPage() {
  const admin = await getAdminOrRedirect();

  const t = await getTranslations("QuickMovie");
  const { aPIGetMoviesToAddList } = getMovies();

  const { data } = await aPIGetMoviesToAddList(
    { user_uuid: admin.uuid },
    backendURL,
  );

  if (!data.quick_movies.length) {
    return (
      <div className="flex h-full items-center justify-center">
        <h1 className="text-2xl">{t("empty")}</h1>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-2">{t("title")}</h1>
      <p className="mb-4">{t("subTitle")}</p>

      <div className="flex flex-col gap-5 sm:flex-wrap">
        {data.quick_movies.map((movie) => (
          <Link
            href={{
              pathname: "/owner/add-movie",
              query: { quick_movie_key: movie.key },
            }}
            key={movie.key}
            className={cn(
              "shadow-form-layout dark:shadow-dark-form-layout dark:border-dark-border border-light-border size-fit rounded-2xl border p-4",
              !checkIfOwner(admin.role) && "pointer-events-none",
            )}
          >
            <div className="text-xl">{movie.title_en}</div>
            <div>
              Rating: <span className="text-lg font-bold">{movie.rating}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
