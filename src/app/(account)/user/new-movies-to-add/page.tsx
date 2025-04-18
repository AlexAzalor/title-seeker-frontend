import { auth } from "@/auth";
import Link from "next/link";
import { backendURL } from "@/lib/constants";
import { getMovies } from "@/orval_api/movies/movies";

export default async function NewMoviesToAddPage() {
  const session = await auth();

  if (!session?.user && session?.user.role !== "owner") {
    return null;
  }

  const { aPIMoviesToAdd } = getMovies();

  const { data } = await aPIMoviesToAdd(
    { user_uuid: session?.user.uuid },
    backendURL,
  );

  if (!data.quick_movies.length) {
    return (
      <div className="flex h-full items-center justify-center">
        <h1 className="text-2xl">No quick movies to add</h1>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-2">New Movies to add</h1>

      <div className="flex flex-wrap gap-5">
        {data.quick_movies.map((movie) => (
          <Link
            href={{
              pathname: "/add-movie",
              query: { quick_movie_key: movie.key },
            }}
            key={movie.key}
            className="shadow-form-layout dark:shadow-dark-form-layout size-fit rounded-[16px] border border-[#EFF0F7] p-4 dark:border-[#211979]"
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
