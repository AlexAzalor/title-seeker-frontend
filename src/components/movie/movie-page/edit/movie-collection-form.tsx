"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useFieldArray, useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, Lock, Trash2 } from "lucide-react";

import {
  editCollection,
  getStandaloneMovies,
} from "@/app/(app)/services/admin-api";
import { ItemsSelector } from "@/components/my-custom-ui/items-list-selector";
import { ResponsiveWrapper } from "@/components/my-custom-ui/responsive-wrapper";
import { Spinner } from "@/components/my-custom-ui/spinner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  RelatedMovie,
  type MovieMenuItem,
  type RelatedMovieOut,
  type MovieStandaloneOut,
} from "@/orval_api/model";

type Row = {
  key: string;
  name: string;
  poster: string;
  relation_type: RelatedMovie | null;
  isProtected: boolean;
};

type FormValues = { movies: Row[] };

type Props = {
  movieKey: string;
  posterUrl: string;
  baseMoviePosterKey: string;
  baseMovieTitle: string;
  relatedMovies?: RelatedMovieOut[] | null;
};

const RELATIONS = Object.values(RelatedMovie).filter(
  (r) => r !== RelatedMovie.base,
);

const label = (value: string) => value.replaceAll("_", " ");

const isRelationType = (value: string): value is RelatedMovie =>
  RELATIONS.some((relation) => relation === value);

export const MovieCollectionForm = ({
  movieKey,
  posterUrl,
  baseMoviePosterKey,
  baseMovieTitle,
  relatedMovies,
}: Props) => {
  const t = useTranslations("Form.stepper.relatedMovie");
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [standaloneMovies, setStandaloneMovies] = useState<
    MovieStandaloneOut[]
  >([]);

  // Keep the current movie in the list so it can be reordered but not edited.
  const baseRow: Row = {
    key: movieKey,
    name: baseMovieTitle,
    poster: baseMoviePosterKey,
    relation_type: relatedMovies?.length ? RelatedMovie.base : null,
    isProtected: true,
  };

  const initialRows: Row[] = relatedMovies?.length
    ? relatedMovies.map((m) =>
        m.key === movieKey
          ? baseRow
          : {
              key: m.key,
              name: m.title,
              poster: m.poster,
              relation_type: m.relation_type,
              isProtected:
                m.relation_type === RelatedMovie.base ||
                m.relation_type === null,
            },
      )
    : [baseRow];

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting },
  } = useForm<FormValues>({ defaultValues: { movies: initialRows } });

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "movies",
  });

  useEffect(() => {
    let cancelled = false;

    const fetchStandaloneMovies = async () => {
      try {
        const res = await getStandaloneMovies();
        if (cancelled) return;

        if (res.status === 200 && "data" in res) {
          setStandaloneMovies(res.data ?? []);
        } else if ("message" in res) {
          toast.error(String(res.message));
        }
      } catch (error) {
        if (!cancelled) {
          toast.error(String(error));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void fetchStandaloneMovies();
    return () => {
      cancelled = true;
    };
  }, []);

  const rows = watch("movies");

  const handleSelect = ({ key, name }: MovieMenuItem) => {
    const index = fields.findIndex((f) => f.key === key);

    if (index === -1) {
      append({
        key,
        name,
        poster:
          standaloneMovies.find((movie) => movie.key === key)?.poster ?? "",
        relation_type: RelatedMovie.sequel,
        isProtected: false,
      });
    } else if (!fields[index].isProtected) {
      remove(index);
    }
  };

  const onSubmit = async ({ movies }: FormValues) => {
    // The current movie stays in the list for ordering but is never submitted.
    const payload = movies.flatMap((m, index) =>
      m.key === movieKey || m.relation_type === null
        ? []
        : [
            {
              movie_key: m.key,
              relation_type: m.relation_type,
              collection_order: index + 1,
            },
          ],
    );

    try {
      const res = await editCollection({
        base_movie_key: movieKey,
        movies: payload,
      });

      if (res.status === 200) {
        toast.success(t("updated"));
        router.refresh();
      } else {
        toast.error(String(res.message));
      }
    } catch (error) {
      toast.error(String(error));
    }
  };

  if (loading) {
    return (
      <div
        className="flex w-[min(36rem,calc(100vw-6rem))] flex-col items-center gap-5"
        aria-label="Loading movie collection form"
        aria-busy
      >
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-11 w-full" />
        <Skeleton className="h-20 w-full rounded-xl" />
        <Skeleton className="h-10 w-24" />
      </div>
    );
  }

  const items = [
    ...standaloneMovies
      .filter((movie) => movie.key !== movieKey)
      .map((movie) => ({ key: movie.key, name: movie.title })),
    ...fields
      .filter(
        (field) =>
          !field.isProtected &&
          !standaloneMovies.some((movie) => movie.key === field.key),
      )
      .map((f) => ({ key: f.key, name: f.name })),
  ];
  const hadMembers = !!relatedMovies?.some((m) => m.key !== movieKey);
  const noMembers = fields.length <= 1;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-[min(36rem,calc(100vw-6rem))] flex-col items-center gap-5"
    >
      <h1 className="text-main-ui-purple">{t("name")}</h1>

      <ResponsiveWrapper title={t("selectMovies")}>
        <ItemsSelector
          items={items}
          onSelect={handleSelect}
          checkIconStyle={fields.map((f) => f.key)}
          excludedKeys={fields
            .filter((field) => field.isProtected)
            .map((field) => field.key)}
          emptyText="Not found"
        />
      </ResponsiveWrapper>

      <div className="flex w-full flex-col gap-3">
        <AnimatePresence initial={false}>
          {fields.map((field, index) => {
            const row = rows[index] ?? field;

            return (
              <motion.div
                key={field.id}
                layout
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="dark:border-dark-border dark:bg-main-dark border-light-border flex flex-wrap items-center gap-3 rounded-xl border p-2"
              >
                {field.poster ? (
                  <Image
                    src={`${posterUrl}/posters/${field.poster}`}
                    alt={field.name}
                    width={40}
                    height={60}
                    className="rounded-lg"
                    style={{ height: "60px", width: "40px" }}
                  />
                ) : (
                  <div className="h-15 w-10 rounded-lg dark:bg-neutral-700" />
                )}

                <div className="min-w-0 flex-1 text-left text-lg">
                  {index + 1}. {field.name}
                </div>

                {row.isProtected ? (
                  <div className="text-muted-foreground flex w-44 items-center gap-2 px-3 text-sm">
                    <Lock size={16} aria-hidden="true" />
                    {row.relation_type === RelatedMovie.base
                      ? t("base")
                      : "Standalone"}
                  </div>
                ) : (
                  <Select
                    value={row.relation_type ?? undefined}
                    onValueChange={(value) => {
                      if (isRelationType(value)) {
                        setValue(`movies.${index}.relation_type`, value, {
                          shouldDirty: true,
                        });
                      }
                    }}
                  >
                    <SelectTrigger
                      className="w-44"
                      aria-label={t("relationType")}
                    >
                      <SelectValue placeholder={t("relationType")} />
                    </SelectTrigger>
                    <SelectContent>
                      {RELATIONS.map((r) => (
                        <SelectItem key={r} value={r}>
                          {label(r)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={index === 0}
                    onClick={() => move(index, index - 1)}
                    aria-label="Move up"
                  >
                    <ArrowUp size={18} />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={index === fields.length - 1}
                    onClick={() => move(index, index + 1)}
                    aria-label="Move down"
                  >
                    <ArrowDown size={18} />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={row.isProtected}
                    onClick={() => remove(index)}
                    aria-label="Remove"
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {noMembers && hadMembers && (
        <p className="text-sm text-red-500">{t("dissolveWarning")}</p>
      )}

      {isSubmitting ? (
        <Spinner />
      ) : (
        <Button type="submit" disabled={noMembers && !hadMembers}>
          {t("save")}
        </Button>
      )}
    </form>
  );
};
