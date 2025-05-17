"use client";

import { useCallback, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { searchTitles } from "@/app/services/global-api";

import {
  BadgeJapaneseYenIcon,
  Film,
  Gamepad2,
  ScanSearch,
  Search as SearchIcon,
  Tv,
} from "lucide-react";

import { Input } from "../ui/input";
import { Button } from "../ui/button";

import { Language, MovieSearchOut, TitleType } from "@/orval_api/model";
import { cn, formatDate } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { CustomModal } from "../my-custom-ui/custom-modal";
import { useModal } from "@/hooks/use-modal";
import { Separator } from "../ui/separator";

const MIN_CHARACTERS = 3;
export const CONTENT_ICONS = {
  movies: <Film />,
  tvseries: <Tv />,
  games: <Gamepad2 />,
  anime: <BadgeJapaneseYenIcon />,
};
type Props = {
  posterURL: string;
};

export const Search = ({ posterURL }: Props) => {
  const lang = useLocale() as Language;
  const { open, close, isOpen } = useModal();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const t = useTranslations("Search");
  const navigation = useTranslations("HomePage");

  const navigationKeys: { title: string; key: TitleType }[] = Object.entries(
    navigation.raw("navigation"),
  ).map(([key, value]) => ({
    title: value as string,
    key: key as TitleType,
  }));

  const [tab, setTab] = useState<TitleType>(TitleType.movies);
  const [warning, setWarning] = useState(false);
  const [titles, setTitles] = useState<MovieSearchOut[] | null>(null);

  const { data: parsedData, setData } = useLocalStorage<MovieSearchOut[]>(
    "recent_search",
    [] as MovieSearchOut[],
  );

  const { debounce } = useDebounce(async (query: string) => {
    if (query.trim() === "") {
      return;
    }

    const res = await searchTitles(query, tab);

    if (res.status === 200 && res.data?.movies) {
      setTitles(res.data.movies);
      return;
    } else {
      toast.error("Something went wrong");
    }
  }, 500);

  const handleSearch = async (query: string) => {
    if (warning) {
      return;
    }
    const searchQuery = query.trim().toLowerCase();

    if (searchQuery.length <= MIN_CHARACTERS) {
      return;
    }

    debounce(searchQuery);
  };

  const setTitleToLocalStorage = (title: MovieSearchOut) => {
    const data = parsedData;

    if (data.length === 3) {
      data.splice(0, 1);
    }

    data.push({
      key: title.key,
      title_en: title.title_en,
      title_uk: title.title_uk,
      poster: title.poster,
      release_date: title.release_date,
      main_genre: title.main_genre,
      duration: title.duration,
    });

    setData(data);
  };

  const handleTabChange = useCallback((tab: TitleType) => {
    setTab(tab);
    if (tab !== TitleType.movies) {
      setWarning(true);
      return;
    }

    setWarning(false);
  }, []);

  const handleChooseTitle = (title: MovieSearchOut) => {
    close();
    setTitleToLocalStorage(title);
    setTitles(null);
  };

  return (
    <div
      className="flex flex-1 flex-col items-center sm:mx-3"
      aria-label="search"
    >
      <div className="mx-2 flex gap-1 lg:mx-0">
        <div
          onClick={() => open()}
          className="relative flex w-30 cursor-pointer items-center lg:w-50"
        >
          <SearchIcon className="absolute mr-2 ml-2 h-4 w-4 shrink-0 opacity-50" />
          <Input
            placeholder={t("search")}
            className="dark:hover:bg-main-dark-hover cursor-pointer bg-white transition-colors placeholder:pl-5 hover:bg-neutral-200 dark:placeholder:text-neutral-400"
            readOnly
          />
        </div>

        <Link href="/super-search">
          <Button>
            <ScanSearch />
            {t("super")}
          </Button>
        </Link>
      </div>

      <CustomModal isOpen={isOpen} onClose={close}>
        <div className="mb-2 flex gap-4 px-2">
          {navigationKeys.map(({ key, title }) => {
            const isTab = tab === key;

            return (
              <button
                key={key}
                onClick={() => handleTabChange(key)}
                className={cn(
                  "search-nav rounded-md border px-1 font-medium",
                  isTab && key === TitleType.movies && "movie-color-set",
                  isTab && key === TitleType.tvseries && "tvseries-color-set",
                  isTab && key === TitleType.anime && "anime-color-set",
                  isTab && key === TitleType.games && "game-color-set",
                )}
              >
                {title}
              </button>
            );
          })}
        </div>

        {warning && (
          <p className="error-message mx-6 rounded-md text-center">
            Title type not supported!
          </p>
        )}

        <div
          className="mb-3 flex items-center border-b px-3 dark:border-b-neutral-700"
          cmdk-input-wrapper=""
        >
          <SearchIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <Input
            placeholder={t("type")}
            onChange={(e) => handleSearch(e.target.value)}
            autoFocus={!isMobile}
            className={
              "flex field-sizing-content h-11 w-full rounded-md border-none bg-transparent py-3 text-sm outline-hidden placeholder:text-neutral-500 disabled:cursor-not-allowed disabled:opacity-50 dark:placeholder:text-neutral-400"
            }
          />
        </div>

        {!!titles && titles.length === 0 && (
          <p className="error-message mx-6 rounded-md text-center">Not found</p>
        )}

        {!!titles && !!titles.length && (
          <div className="flex flex-col gap-1">
            {titles.map((title) => (
              <Link
                key={title.key}
                href={`/movies/${title.key}`}
                className="dark:hover:bg-main-dark-hover flex w-full items-center gap-2 rounded-sm p-2 transition-all duration-200 select-none hover:bg-neutral-100"
                onClick={() => handleChooseTitle(title)}
              >
                <Image
                  src={`${posterURL}/posters/${title.poster}`}
                  alt="Movie poster"
                  height={60}
                  width={40}
                />
                <div>
                  <p className="text-lg font-bold">
                    {title.title_en} ({title.title_uk})
                  </p>
                  <span>{formatDate(title.release_date, lang)}</span>
                  {" | "}
                  <span>{title.main_genre}</span>
                </div>
              </Link>
            ))}

            <Separator className="my-3" />
          </div>
        )}

        {parsedData.length > 0 && (
          <>
            <div className="flex flex-col gap-1">
              <p className="mb-1 text-[var(--color-neutral-500)]">
                {t("recent")}
              </p>
              {parsedData.reverse().map((title) => (
                <Link
                  key={title.key}
                  href={`/movies/${title.key}`}
                  className="dark:hover:bg-main-dark-hover flex w-full items-center gap-2 rounded-sm p-2 transition-all duration-200 select-none hover:bg-neutral-100"
                  onClick={close}
                >
                  <Image
                    src={`${posterURL}/posters/${title.poster}`}
                    alt="Title Poster"
                    height={60}
                    width={40}
                  />
                  <div>
                    <p className="text-lg font-bold">{`${title.title_en} (${title.title_uk})`}</p>
                    <span>{formatDate(title.release_date, lang)}</span>
                    {" | "}
                    <span>{title.main_genre}</span>
                  </div>
                </Link>
              ))}
            </div>

            <Separator className="my-3" />
          </>
        )}

        <div className="flex flex-col gap-2">
          <p className="mb-1 text-[var(--color-neutral-500)]">
            {t("suggestions")}
          </p>
          {navigationKeys.map((item) => (
            <Link
              key={item.key}
              href={item.key}
              className="dark:hover:bg-main-dark-hover flex w-full items-center gap-1 rounded-sm p-1 transition-all duration-200 select-none hover:bg-neutral-100"
              onClick={close}
            >
              {
                CONTENT_ICONS[
                  item.key.replace("/", "") as keyof typeof CONTENT_ICONS
                ]
              }
              <span>{item.title}</span>
            </Link>
          ))}
        </div>
      </CustomModal>
    </div>
  );
};
