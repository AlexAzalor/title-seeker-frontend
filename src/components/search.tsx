"use client";

import { useCallback, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useLocale } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { searchTitles } from "@/app/actions";

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
import { Input } from "./ui/input";
import { Button } from "./ui/button";

import { MovieSearchOut, TitleType } from "@/orval_api/model";
import { cn, formatDate } from "@/lib/utils";

const MIN_CHARACTERS = 3;

type Props = {
  posterURL: string;
};

export const Search = ({ posterURL }: Props) => {
  const lang = useLocale();
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

    setTitles(res.movies);
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
            placeholder="Search..."
            className="cursor-pointer transition-colors placeholder:pl-5 hover:bg-neutral-200"
            readOnly
          />
        </div>

        <Link href="/super-search">
          <Button>
            <ScanSearch />
            Super search
          </Button>
        </Link>
      </div>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <div className="flex gap-4 p-4">
          <button
            onClick={() => handleTabChange(TitleType.movies)}
            className={cn(
              "rounded-md border border-[#ebebeb] bg-white px-1 font-medium text-[#666666]",
              tab === TitleType.movies &&
                "border-[#cce6ff] bg-[#ebf5ff] text-[#0072f5]",
            )}
          >
            Movies
          </button>
          <button
            onClick={() => handleTabChange(TitleType.tvseries)}
            className={cn(
              "rounded-md border border-[#ebebeb] bg-white px-1 font-medium text-[#666666]",
              tab === TitleType.tvseries &&
                "border-[#ffd0a3] bg-[#fff4e6] text-[#d86e0b]",
            )}
          >
            TV Series
          </button>
          <button
            onClick={() => handleTabChange(TitleType.anime)}
            className={cn(
              "rounded-md border border-[#ebebeb] bg-white px-1 font-medium text-[#666666]",
              tab === TitleType.anime &&
                "border-[#f8cce0] bg-[#fdeff5] text-[#d82687]",
            )}
          >
            Anime
          </button>
          <button
            onClick={() => handleTabChange(TitleType.games)}
            className={cn(
              "rounded-md border border-[#ebebeb] bg-white px-1 font-medium text-[#666666]",
              tab === TitleType.games &&
                "border-[#c2e6c2] bg-[#eafbea] text-[#17a34a]",
            )}
          >
            Games
          </button>
        </div>

        {warning && (
          <p className="mx-6 rounded-md border-[#ffcccc] bg-[#ffefef] text-center text-[#d92525]">
            Title type not supported!
          </p>
        )}

        <CommandInput
          placeholder="Type to search..."
          onValueChange={handleSearch}
          autoFocus
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {titles.map((title) => (
            <CommandItem
              key={title.key}
              // For searching by two languages
              value={title.title_uk + " " + title.title_en}
              lang="uk"
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
              <CommandGroup heading="Recent searches">
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
          <CommandGroup heading="Suggestions">
            <CommandItem>
              <Link
                href="/movies"
                className="flex w-full items-center gap-2"
                onClick={closeModel}
              >
                <Film />
                <span>Movies</span>
              </Link>
            </CommandItem>
            <CommandItem>
              <Link
                href="/tvseries"
                className="flex w-full items-center gap-2"
                onClick={closeModel}
              >
                <Tv />
                <span>TV Series</span>
              </Link>
            </CommandItem>
            <CommandItem>
              <Link
                href="/anime"
                className="flex w-full items-center gap-2"
                onClick={closeModel}
              >
                <BadgeJapaneseYenIcon />
                <span>Anime</span>
              </Link>
            </CommandItem>
            <CommandItem>
              <Link
                href="/games"
                className="flex w-full items-center gap-2"
                onClick={closeModel}
              >
                <Gamepad2 />
                <span>Games</span>
              </Link>
            </CommandItem>
          </CommandGroup>{" "}
        </CommandList>
      </CommandDialog>
    </div>
  );
};
