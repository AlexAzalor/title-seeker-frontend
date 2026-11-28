"use client";

import { useState, type ReactElement } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  getMovieActors,
  getMovieDirectors,
} from "@/app/(app)/services/admin-api";
import CustomModal from "@/components/my-custom-ui/custom-modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { loadMovieEditFields, MovieFieldsForm } from "./movie-fields";
import {
  EditMovieDescription,
  loadMovieDescription,
} from "./movie-description";
import { EditMovieBoxOffice } from "./movie-box-office";
import { EditMovieActors } from "./movie-actors";
import { EditMovieDirectors } from "./movie-directors";
import { MovieCollectionForm } from "./movie-collection-form";
import { EVENT_ICONS } from "@/components/audit-log/audit-log-item";
import { RelatedMovie } from "@/orval_api/model";
import type {
  MovieGetActors,
  MovieGetDirectors,
  MovieOut,
} from "@/orval_api/model";

type FieldsData = NonNullable<Awaited<ReturnType<typeof loadMovieEditFields>>>;
type DescriptionData = NonNullable<
  Awaited<ReturnType<typeof loadMovieDescription>>
>;
export type MovieEditData = Pick<
  MovieOut,
  | "budget"
  | "domestic_gross"
  | "worldwide_gross"
  | "actors"
  | "directors"
  | "poster"
  | "related_movies"
>;
type ActiveForm =
  | { kind: "title" | "details"; data: FieldsData }
  | { kind: "description"; data: DescriptionData }
  | { kind: "boxOffice" }
  | { kind: "relatedMovies" }
  | { kind: "actors"; data: MovieGetActors }
  | { kind: "directors"; data: MovieGetDirectors };

export function MovieEditMenu({
  movieKey,
  movieData,
  movieTitle,
  posterUrl,
  children,
}: {
  movieKey: string;
  movieData: MovieEditData;
  movieTitle: string;
  posterUrl: string;
  children: ReactElement;
}) {
  const t = useTranslations("Form.movieEdit");
  const [loading, setLoading] = useState(false);
  const [activeForm, setActiveForm] = useState<ActiveForm | null>(null);

  const openForm = async (kind: ActiveForm["kind"]) => {
    if (kind === "boxOffice" || kind === "relatedMovies") {
      setActiveForm({ kind });
      return;
    }

    setLoading(true);
    try {
      if (kind === "description") {
        const data = await loadMovieDescription(movieKey);
        if (data) setActiveForm({ kind, data });
      } else if (kind === "actors") {
        const result = await getMovieActors();
        if (result.status === 200 && result.data) {
          setActiveForm({ kind, data: result.data });
        } else {
          toast.error(result.message || t("actorsLoadError"));
        }
      } else if (kind === "directors") {
        const result = await getMovieDirectors();
        if (result.status === 200 && result.data) {
          setActiveForm({ kind, data: result.data });
        } else {
          toast.error(result.message || t("directorsLoadError"));
        }
      } else {
        const data = await loadMovieEditFields(movieKey);
        if (data) setActiveForm({ kind, data });
      }
    } catch (error) {
      console.error(`Failed to load movie ${kind}:`, error);
      toast.error(
        kind === "actors"
          ? t("actorsLoadError")
          : kind === "directors"
            ? t("directorsLoadError")
            : t("loadError"),
      );
    } finally {
      setLoading(false);
    }
  };

  const TitleIcon = EVENT_ICONS["movie.title.updated"];
  const DetailsIcon = EVENT_ICONS["movie.details.updated"];
  const DescriptionIcon = EVENT_ICONS["movie.description.updated"];
  const BoxOfficeIcon = EVENT_ICONS["movie.box_office.updated"];
  const ActorsIcon = EVENT_ICONS["movie.actors.updated"];
  const DirectorsIcon = EVENT_ICONS["movie.directors.updated"];
  const RelatedMoviesIcon = EVENT_ICONS["movie.collection.updated"];
  const ownRelation = movieData.related_movies?.find((m) => m.key === movieKey);
  const canEditRelatedMovies =
    !ownRelation || ownRelation.relation_type === RelatedMovie.base;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild disabled={loading}>
          {children}
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="end" sideOffset={4}>
          <DropdownMenuItem
            className="cursor-pointer"
            onSelect={() => void openForm("title")}
          >
            <TitleIcon />
            {t("editTitle")}
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onSelect={() => void openForm("details")}
          >
            <DetailsIcon />
            {t("editDetails")}
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onSelect={() => void openForm("description")}
          >
            <DescriptionIcon />
            {t("editDescription")}
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onSelect={() => void openForm("boxOffice")}
          >
            <BoxOfficeIcon />
            {t("editBoxOffice")}
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onSelect={() => void openForm("actors")}
          >
            <ActorsIcon />
            {t("editActors")}
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onSelect={() => void openForm("directors")}
          >
            <DirectorsIcon />
            {t("editDirectors")}
          </DropdownMenuItem>
          {canEditRelatedMovies && (
            <DropdownMenuItem
              className="cursor-pointer"
              onSelect={() => void openForm("relatedMovies")}
            >
              <RelatedMoviesIcon />
              {t("editRelatedMovies")}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {activeForm && (
        <CustomModal isOpen onClose={() => setActiveForm(null)}>
          {activeForm.kind === "description" ? (
            <EditMovieDescription
              movieKey={movieKey}
              descriptionData={activeForm.data}
              onSuccess={() => setActiveForm(null)}
            />
          ) : activeForm.kind === "boxOffice" ? (
            <EditMovieBoxOffice
              movieKey={movieKey}
              boxOfficeData={{
                budget: movieData.budget,
                domesticGross: movieData.domestic_gross,
                worldwideGross: movieData.worldwide_gross,
              }}
              onSuccess={() => setActiveForm(null)}
            />
          ) : activeForm.kind === "relatedMovies" ? (
            <MovieCollectionForm
              movieKey={movieKey}
              posterUrl={posterUrl}
              baseMoviePosterKey={movieData.poster}
              baseMovieTitle={movieTitle}
              relatedMovies={movieData.related_movies}
              onSuccess={() => setActiveForm(null)}
            />
          ) : activeForm.kind === "actors" ? (
            <EditMovieActors
              movieKey={movieKey}
              allActors={activeForm.data.actors}
              allCharacters={activeForm.data.characters}
              currentActors={movieData.actors}
              onClose={() => setActiveForm(null)}
            />
          ) : activeForm.kind === "directors" ? (
            <EditMovieDirectors
              movieKey={movieKey}
              allDirectors={activeForm.data.directors}
              currentDirectors={movieData.directors}
              onClose={() => setActiveForm(null)}
            />
          ) : (
            <MovieFieldsForm
              movieKey={movieKey}
              kind={activeForm.kind}
              data={activeForm.data}
              onClose={() => setActiveForm(null)}
            />
          )}
        </CustomModal>
      )}
    </>
  );
}
