"use client";

import { useCallback, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { searchTitles } from "@/app/services/global-api";

import {
  BadgeJapaneseYenIcon,
  Film,
  Gamepad2,
  ScanSearch,
  Search as SearchIcon,
  Tv,
} from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

import { Language, MovieSearchOut, TitleType } from "@/orval_api/model";
import { cn, formatDate } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
// import { CONTENT_ICONS } from "./layout/app-sidebar";

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
  const isMobile = useMediaQuery("(max-width: 640px)");
  const t = useTranslations("Search");
  const navigation = useTranslations("HomePage");
  const navigationKeys: { title: string; key: TitleType }[] = Object.entries(
    navigation.raw("navigation"),
  ).map(([key, value]) => ({
    title: value as string,
    key: key as TitleType,
  }));

  const lang = useLocale() as Language;
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<TitleType>(TitleType.movies);
  const [warning, setWarning] = useState(false);
  const [titles, setTitles] = useState<MovieSearchOut[]>([]);

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
      // TODO: add error handling
      alert("Error: " + res.status);
    }
  }, 500);

  const handleSearch = async (query: string) => {
    if (warning) {
      return;
    }

    if (query.length <= MIN_CHARACTERS) {
      return;
    }

    debounce(query);
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

  const closeModel = () => {
    setOpen(false);
  };

  const handleChooseTitle = (title: MovieSearchOut) => {
    closeModel();
    setTitleToLocalStorage(title);
    setTitles([]);
  };

  return (
    <div className="flex flex-1 flex-col items-center sm:mx-3">
      <div className="mx-2 flex gap-1 lg:mx-0">
        <div
          onClick={() => setOpen(true)}
          className="relative flex w-30 cursor-pointer items-center lg:w-50"
        >
          <SearchIcon className="absolute mr-2 ml-2 h-4 w-4 shrink-0 opacity-50" />
          <Input
            placeholder={t("search")}
            className="cursor-pointer transition-colors placeholder:pl-5 hover:bg-neutral-200"
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

      <CommandDialog open={open} onOpenChange={setOpen}>
        <div className="flex gap-4 p-4">
          {navigationKeys.map((item) => (
            <button
              key={item.key}
              onClick={() => handleTabChange(item.key)}
              className={cn(
                "rounded-md border border-[#ebebeb] bg-white px-1 font-medium text-[#666666]",
                tab === item.key &&
                  item.key === TitleType.movies &&
                  "border-[#cce6ff] bg-[#ebf5ff] text-[#0072f5]",
                tab === item.key &&
                  item.key === TitleType.tvseries &&
                  "border-[#ffd0a3] bg-[#fff4e6] text-[#d86e0b]",
                tab === item.key &&
                  item.key === TitleType.anime &&
                  "border-[#f8cce0] bg-[#fdeff5] text-[#d82687]",
                tab === item.key &&
                  item.key === TitleType.games &&
                  "border-[#c2e6c2] bg-[#eafbea] text-[#17a34a]",
              )}
            >
              {item.title}
            </button>
          ))}
        </div>

        {warning && (
          <p className="mx-6 rounded-md border-[#ffcccc] bg-[#ffefef] text-center text-[#d92525]">
            Title type not supported!
          </p>
        )}

        <CommandInput
          placeholder={t("type")}
          onValueChange={handleSearch}
          autoFocus={!isMobile}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {titles.map((title) => (
            <CommandItem
              key={title.key}
              // For searching by two languages
              value={title.title_uk + " " + title.title_en}
            >
              <Link
                href={`/movies/${title.key}`}
                className="flex w-full items-center gap-2"
                onClick={() => handleChooseTitle(title)}
              >
                <Image
                  src={`${posterURL}/posters/${title.poster}`}
                  alt="Actor Avatar"
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
            </CommandItem>
          ))}
          {parsedData.length > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup heading={t("recent")}>
                {parsedData.reverse().map((title) => (
                  <CommandItem key={title.key}>
                    <Link
                      href={`/movies/${title.key}`}
                      className="flex w-full items-center gap-2"
                      onClick={() => {
                        setOpen(false);
                      }}
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
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}
          <CommandSeparator />
          <CommandGroup heading={t("suggestions")}>
            {navigationKeys.map((item) => (
              <CommandItem key={item.key}>
                <Link
                  href={item.key}
                  className="flex w-full items-center gap-2"
                  onClick={closeModel}
                >
                  {
                    CONTENT_ICONS[
                      item.key.replace("/", "") as keyof typeof CONTENT_ICONS
                    ]
                  }
                  <span>{item.title}</span>
                </Link>
              </CommandItem>
            ))}
          </CommandGroup>{" "}
        </CommandList>
      </CommandDialog>
    </div>
  );
};
