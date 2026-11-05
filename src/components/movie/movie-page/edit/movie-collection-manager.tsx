"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { GripVerticalIcon, XIcon } from "lucide-react";
import {
  addMovieToCollection,
  getMovieCollection,
  removeMovieFromCollection,
  updateMovieInCollection,
} from "@/app/(app)/services/admin-api";
import { searchTitles } from "@/app/(app)/services/global-api";
import { Button } from "@/components/ui/button";
import {
  RelatedMovie,
  SearchType,
  type MovieCollectionOut,
  type SearchResult,
} from "@/orval_api/model";

type Props = {
  movieKey: string;
  posterUrl: string;
};

const EMPTY: MovieCollectionOut = { base_movie_key: null, movies: [] };
const SELECTABLE_RELATIONS = Object.values(RelatedMovie).filter(
  (r) => r !== RelatedMovie.base,
);

export const MovieCollectionManager = ({ movieKey, posterUrl }: Props) => {
  const router = useRouter();
  const [collection, setCollection] = useState<MovieCollectionOut>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [dragKey, setDragKey] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [picked, setPicked] = useState<SearchResult | null>(null);
  const [relation, setRelation] = useState<RelatedMovie>(RelatedMovie.sequel);

  // Server responses are the source of truth: replace local state with them
  const apply = (
    res: Awaited<ReturnType<typeof getMovieCollection>>,
    successMessage?: string,
  ) => {
    if (res.status === 200 && "data" in res) {
      setCollection(res.data);
      if (successMessage) {
        toast.success(successMessage);
        router.refresh();
      }
    } else if ("message" in res) {
      toast.error(String(res.message));
    }
  };

  useEffect(() => {
    getMovieCollection(movieKey).then((res) => {
      apply(res);
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movieKey]);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      const res = await searchTitles(query, SearchType.movies);
      if (res.status === 200 && "data" in res && res.data) {
        setResults(res.data.results.filter((r) => r.key !== movieKey));
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query, movieKey]);

  const isStandalone = !collection.base_movie_key;

  const handleAdd = async () => {
    if (!picked) return;
    // The current movie is the target; the picked standalone movie gets linked
    const res = await addMovieToCollection({
      movie_key: picked.key,
      target_movie_key: movieKey,
      relation_type: relation,
    });
    apply(res, "Related movie added");
    if (res.status === 200) {
      setPicked(null);
      setQuery("");
      setResults([]);
    }
  };

  const handleRemove = async (key: string) => {
    const res = await removeMovieFromCollection(key);
    apply(res, "Related movie removed");
  };

  const handleRelation = async (key: string, relation_type: RelatedMovie) => {
    const res = await updateMovieInCollection({ movie_key: key, relation_type });
    apply(res, "Relation updated");
  };

  const handleDrop = async (targetKey: string) => {
    const from = dragKey;
    setDragKey(null);
    if (!from || from === targetKey) return;

    const index = collection.movies.findIndex((m) => m.key === targetKey);
    const res = await updateMovieInCollection({
      movie_key: from,
      collection_order: index + 1,
    });
    apply(res, "Order updated");
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (isStandalone) {
    return (
      <div className="flex w-full flex-col gap-4">
        <h3 className="text-xl">Add related movie</h3>

        <input
          className="dark:bg-main-dark rounded-md border px-3 py-2"
          placeholder="Search movie..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPicked(null);
          }}
        />

        {!picked && results.length > 0 && (
          <ul className="flex max-h-60 flex-col overflow-y-auto">
            {results.map((r) => (
              <li key={r.key}>
                <button
                  type="button"
                  className="dark:hover:bg-main-dark-hover w-full rounded-md p-2 text-left hover:bg-neutral-100"
                  onClick={() => {
                    setPicked(r);
                    setQuery(r.name);
                  }}
                >
                  {r.name}
                </button>
              </li>
            ))}
          </ul>
        )}

        <select
          className="dark:bg-main-dark rounded-md border px-3 py-2"
          value={relation}
          onChange={(e) => setRelation(e.target.value as RelatedMovie)}
        >
          {SELECTABLE_RELATIONS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        <Button disabled={!picked} onClick={handleAdd}>
          Add
        </Button>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-2">
      <h3 className="text-xl">Related movies</h3>

      {collection.movies.map((movie) => {
        const isBase = movie.key === collection.base_movie_key;

        return (
          <div
            key={movie.key}
            draggable
            onDragStart={() => setDragKey(movie.key)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(movie.key)}
            className="flex items-center gap-3 rounded-xl border p-2"
          >
            <GripVerticalIcon className="cursor-grab" size={20} />
            <Image
              src={`${posterUrl}/posters/${movie.poster}`}
              alt={movie.title}
              className="rounded-lg"
              width={40}
              height={60}
              style={{ height: "60px", width: "40px" }}
            />
            <div className="flex-1">
              {movie.collection_order}. {movie.title}
            </div>

            <select
              className="dark:bg-main-dark rounded-md border px-2 py-1"
              disabled={isBase}
              value={movie.relation_type ?? ""}
              onChange={(e) =>
                handleRelation(movie.key, e.target.value as RelatedMovie)
              }
            >
              {isBase && (
                <option value={RelatedMovie.base}>{RelatedMovie.base}</option>
              )}
              {SELECTABLE_RELATIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>

            <Button
              variant="ghost"
              size="icon"
              aria-label="Remove"
              onClick={() => handleRemove(movie.key)}
            >
              <XIcon size={18} />
            </Button>
          </div>
        );
      })}
    </div>
  );
};
