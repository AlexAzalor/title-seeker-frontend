import { getLocale } from "next-intl/server";
import { POSTER_URL } from "@/lib/constants";
import { MovieTournament } from "@/components/movie-tournament/movie-tournament";

export default async function MovieTournamentPage() {
  const locale = await getLocale();
  return (
    <MovieTournament
      lang={locale === "en" ? "en" : "uk"}
      posterUrl={POSTER_URL ?? ""}
    />
  );
}
