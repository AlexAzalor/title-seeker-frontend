"use client";

import {
  ActionTimeOut,
  ActorOut,
  DirectorOut,
  GenreOut,
  GenreOutSubgenres,
  KeywordOut,
  MovieFilterField,
  MovieIn,
  RatingCriterion,
  SpecificationOut,
  SubgenreOut,
} from "@/orval_api/model";
// import { Input } from "@/components/ui/input";
// import { Card, CardHeader } from "@/components/ui/card";
import { uk } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useRef, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  CalendarIcon,
  Check,
  ChevronsUpDown,
  CircleXIcon,
  CrossIcon,
  EyeClosedIcon,
  Filter,
  LucideCross,
  ShieldCloseIcon,
  SidebarCloseIcon,
} from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { cn, convertToISOString, convertToSlug } from "@/lib/utils";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { addNewMovie } from "@/app/actions";
import { toast } from "sonner";
import { Checkbox } from "../ui/checkbox";
import { CheckedState } from "@radix-ui/react-checkbox";

// form values save on localsotrage
// preven exit without saving

type Props = {
  newMovieId: number;
  actors: ActorOut[];
  directors: DirectorOut[];
  specifications: SpecificationOut[];
  genres: GenreOut[];
  keywords: KeywordOut[];
  actionTimes: ActionTimeOut[];
};

export const AddNewMovie = ({
  newMovieId,
  actors,
  directors,
  specifications,
  genres,
  keywords,
  actionTimes,
}: Props) => {
  console.log("newMovieId: ", newMovieId);

  const [date, setDate] = useState<Date | undefined>(new Date());
  // console.log("DATE: ", date?.toISOString());

  // Actors
  const [openActor, setOpenActor] = useState(false);
  const [actorsList, setActorsList] = useState<ActorOut[]>([]);
  const actorsRef = useRef<{ [key: string]: string }[]>([]);

  // Directors
  const [openDirectors, setOpenDirectors] = useState(false);
  const [directorsList, setDirectorsList] = useState<DirectorOut[]>([]);
  const directorsRef = useRef<{ [key: string]: string }[]>([]);

  // Specification
  const [openSpec, setOpenSpec] = useState(false);
  const [specificationKey, setSpecificationKey] = useState<SpecificationOut[]>(
    [],
  );
  const specRef = useRef<MovieFilterField[]>([]);

  // Genres
  const [openGenres, setOpenGenres] = useState(false);

  const [genresList, setGenresList] = useState<GenreOut[]>([]);
  const genresRef = useRef<MovieFilterField[]>([]);

  // Subgenres
  const [subgenres, setSubgenres] = useState<SubgenreOut[]>([]);
  const [openSubgenres, setOpenSubgenres] = useState(false);

  const [subgenresList, setSubgenresList] = useState<SubgenreOut[]>([]);
  const subgenresRef = useRef<MovieFilterField[]>([]);

  // Keywords
  const [openKeywords, setOpenKeywords] = useState(false);
  const [keywordsList, setKeywordsList] = useState<KeywordOut[]>([]);
  const keywordsRef = useRef<MovieFilterField[]>([]);

  // Action Times
  const [openActionTimes, setOpenActionTimes] = useState(false);
  const [actionTimesList, setActionTimesList] = useState<ActionTimeOut[]>([]);
  const actionTimesRef = useRef<MovieFilterField[]>([]);

  const ratingCriteriaRef = useRef<RatingCriterion>(RatingCriterion.basic);

  const movieIdRef = useRef<number>(newMovieId);

  const movieKeyRef = useRef<string>("");
  const [movieKey, setMovieKey] = useState("");

  const titleUkRef = useRef<string>("");
  const titleEnRef = useRef<string>("");
  const descriptionUkRef = useRef<string>("");
  const descriptionEnRef = useRef<string>("");
  const releaseDateRef = useRef<string>("");
  const durationRef = useRef<number>(0);
  const budgetRef = useRef<number>(0);
  const domesticGrossRef = useRef<number>(0);
  const worldwideGrossRef = useRef<number>(0);
  const locationUkRef = useRef<string>("");
  const locationEnRef = useRef<string>("");

  const [allowEditMovieId, setAllowEditMovieId] = useState<CheckedState>(false);
  const [movieTitle, setMovieTitle] = useState<string>("");

  const addMovie = async () => {
    console.log("Actor", actorsRef.current);
    // console.log("Director", directorKey);
    // console.log("Specification", specificationKey);
    // console.log("SPEC REF", specRef.current);
    console.log("Genres", genresRef.current);
    // console.log("Subgenres", subgenresRef.current);
    // console.log("Keywords", keywordsRef.current);
    // console.log("Action Times", actionTimesRef.current);
    // console.log("Rating Criteria", ratingCriteriaRef.current);

    const newMovieData: MovieIn = {
      id: movieIdRef.current,
      key: movieKeyRef.current,
      title_uk: titleUkRef.current,
      title_en: titleEnRef.current,
      description_uk: descriptionUkRef.current,
      description_en: descriptionEnRef.current,
      release_date: date?.toISOString() || "",
      duration: durationRef.current,
      budget: budgetRef.current,
      domestic_gross: domesticGrossRef.current,
      worldwide_gross: worldwideGrossRef.current,
      location_uk: locationUkRef.current,
      location_en: locationEnRef.current,
      poster: "",
      actors_keys: actorsRef.current.map((actor) => actor.key),
      directors_keys: directorsRef.current.map((director) => director.key),
      genres: genresRef.current,
      subgenres: subgenresRef.current,
      specifications: specRef.current,
      keywords: keywordsRef.current,
      action_times: actionTimesRef.current,
      rating_criterion: ratingCriteriaRef.current,
    };

    console.log("DATA TO API: ", newMovieData);

    try {
      await addNewMovie(newMovieData);
      toast.success("Movie added");
    } catch (error) {
      toast.error("Error with adding movie");
      console.error("Error occured", error);
    }
  };

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex items-center gap-2">
        <div>
          <Label htmlFor="new-movie-id">New Movie ID</Label>
          <Input
            id="new-movie-id"
            className="w-16"
            disabled={!allowEditMovieId}
            type="text"
            placeholder="New Movie ID"
            defaultValue={newMovieId}
            onChange={(e) => (movieIdRef.current = +e.target.value)}
          />
        </div>

        <div className="flex items-center gap-1">
          <Label htmlFor="allow-edit-id">Allow Edit ID</Label>
          <Checkbox
            id="allow-edit-id"
            checked={allowEditMovieId}
            onCheckedChange={(e) => setAllowEditMovieId(e)}
          />
        </div>
      </div>

      <Label htmlFor="title-uk">Title UK</Label>
      <Input
        id="title-uk"
        type="text"
        placeholder="Title UK"
        onChange={(e) => (titleUkRef.current = e.target.value)}
      />

      <div className="flex gap-5">
        <div className="flex-1">
          <Label htmlFor="title-en">Title EN</Label>
          <Input
            id="title-en"
            type="text"
            placeholder="Title EN"
            onChange={(e) => {
              titleEnRef.current = e.target.value;
              setMovieKey(e.target.value);
              setMovieTitle(e.target.value);
            }}
          />
        </div>

        <div className="flex-1 basis-6">
          <Label htmlFor="movie-key">Movie key</Label>
          <Input
            value={convertToSlug(movieKey)}
            disabled
            onChange={(e) => {
              movieKeyRef.current = e.target.value;
            }}
            id="movie-key"
            type="text"
            placeholder="Movie key"
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="description-uk">Description UK</Label>
        <Textarea
          id="description-uk"
          placeholder="Description UK"
          onChange={(e) => (descriptionUkRef.current = e.target.value)}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="description-en">Description EN</Label>
        <Textarea
          id="description-en"
          placeholder="Description EN"
          onChange={(e) => (descriptionEnRef.current = e.target.value)}
        />
      </div>

      <div className="flex gap-3">
        <div className="flex flex-col">
          <Label htmlFor="release-date">Release Date</Label>
          <Popover>
            <PopoverTrigger id="release-date" asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !date && "text-muted-foreground",
                )}
              >
                <CalendarIcon />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                captionLayout="dropdown-buttons"
                fromYear={1990}
                toYear={2024}
                locale={uk}
                labels={{
                  labelMonthDropdown: () => "",
                  labelYearDropdown: () => "",
                }}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <Label htmlFor="duration">or manual</Label>
          <Input
            id="manual-date"
            type="text"
            placeholder="dd.mm.yyyy"
            onChange={(e) =>
              setDate(new Date(convertToISOString(e.target.value)))
            }
          />
        </div>
      </div>

      <Label htmlFor="duration">Duration</Label>
      <Input
        id="duration"
        type="text"
        placeholder="Duration"
        onChange={(e) => (durationRef.current = +e.target.value)}
      />

      <Label htmlFor="budget">Budget</Label>
      <Input
        id="budget"
        type="text"
        placeholder="Budget"
        onChange={(e) => (budgetRef.current = +e.target.value)}
      />

      <Label htmlFor="domestic-gross">Domestic gross</Label>
      <Input
        id="domestic-gross"
        type="text"
        placeholder="Domestic gross"
        onChange={(e) => (domesticGrossRef.current = +e.target.value)}
      />

      <Label htmlFor="worldwide-gross">Worldwide gross</Label>
      <Input
        id="worldwide-gross"
        type="text"
        placeholder="Worldwide gross"
        onChange={(e) => (worldwideGrossRef.current = +e.target.value)}
      />

      <Label htmlFor="location-uk">Location UK</Label>
      <Input
        id="location-uk"
        type="text"
        placeholder="Location UK"
        onChange={(e) => (locationUkRef.current = e.target.value)}
      />

      <Label htmlFor="location-en">Location EN</Label>
      <Input
        id="location-en"
        type="text"
        placeholder="Location EN"
        onChange={(e) => (locationEnRef.current = e.target.value)}
      />

      <Label htmlFor="poster">Poster</Label>
      <Input
        id="poster"
        type="text"
        placeholder="Poster"
        disabled
        value={newMovieId + "_" + movieTitle + ".png"}
        // onChange={(e) => (locationEnRef.current = newMovieId + "_" + e.target.value + ".png")}
      />

      {/* ============================ Actors ====================================================== */}

      <div className="border border-black p-2">
        <h1>Actors</h1>
        <div>
          {actorsList.length ? (
            <div className="flex flex-col gap-1">
              {actorsList.map((actor) => (
                <TooltipProvider key={actor.key}>
                  <Tooltip>
                    <div
                      key={actor.key}
                      className="mr-2 flex w-max items-center gap-1 rounded-xl bg-purple-300 p-2 dark:bg-purple-700"
                    >
                      <TooltipTrigger
                        onClick={(e) => {
                          console.log("????????????????????");

                          // e.stopPropagation();
                          // e.preventDefault();
                          // setActionTimesList((prev) =>
                          //   prev.filter(
                          //     (actionTimePrev) =>
                          //       actionTimePrev.key !== actionTime.key,
                          //   ),
                          // );
                        }}
                        asChild
                        className="text-left"
                      >
                        <span>{actor.full_name}</span>
                      </TooltipTrigger>
                      <CircleXIcon
                        className="cursor-pointer"
                        onClick={(e) => {
                          // e.stopPropagation();
                          // e.preventDefault();
                          setActorsList((prev) =>
                            prev.filter(
                              (actorPrev) => actorPrev.key !== actor.key,
                            ),
                          );

                          actorsRef.current = actorsRef.current.filter(
                            (actorPrev) => actorPrev.key !== actor.key,
                          );
                        }}
                      />
                    </div>

                    <TooltipContent>
                      <p>{"Some short info?"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          ) : (
            "Select actors..."
          )}
        </div>

        <Popover open={openActor} onOpenChange={setOpenActor}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              // aria-expanded={openSpec}
              className="h-max w-max justify-between"
            >
              {"Select actor..."}
              {/* {specificationKey.length
              ? specifications.find((specification) =>
                  specificationKey
                    .map((spec) => spec.key)
                    .includes(specification.key),
                )?.name
              : "Select specification..."} */}
              <ChevronsUpDown
                className="opacity-50"
                onClick={(e) => {
                  console.log("????????????????????");
                }}
              />
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search actors..." className="h-9" />
              <CommandList>
                <CommandEmpty>No actor found.</CommandEmpty>

                <TooltipProvider>
                  <CommandGroup className="text-left">
                    {actors.map((actor) => (
                      <CommandItem
                        key={actor.key}
                        value={actor.full_name}
                        onSelect={(currentValue) => {
                          setActorsList((prev) =>
                            currentValue ===
                            prev.find(
                              (actorPrev) => actorPrev.key === actor.key,
                            )?.full_name
                              ? prev.filter(
                                  (actorPrev) => actorPrev.key !== actor.key,
                                )
                              : [...prev, actor],
                          );
                          const a = actorsRef.current.find(
                            (actorPrev) => actorPrev.key === actor.key,
                          );
                          if (!a) {
                            actorsRef.current.push({
                              key: actor.key,
                            });
                          }

                          setOpenActor(false);
                        }}
                      >
                        <Tooltip>
                          <TooltipTrigger className="text-left">
                            {actor.full_name}
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{"Some short info?"}</p>
                          </TooltipContent>
                        </Tooltip>
                        {/* {specification.name} */}
                        <Check
                          className={cn(
                            "ml-auto",
                            actorsList
                              .map((actorPrev) => actorPrev.key)
                              .includes(actor.key)
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </TooltipProvider>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* <div className="border border-black p-2">
        <h1>Actors</h1>
        <Popover open={openActor} onOpenChange={setOpenActor}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openActor}
              className="w-[200px] justify-between"
            >
              {actorKey?.key
                ? actors.find((actor) => actor.key === actorKey.key)?.full_name
                : "Select actor..."}
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search actors..." className="h-9" />
              <CommandList>
                <CommandEmpty>No actor found.</CommandEmpty>
                <CommandGroup>
                  {actors.map((actor) => (
                    <CommandItem
                      // keywords={["Морган Фрімен"]}
                      key={actor.key}
                      value={actor.full_name}
                      onSelect={(currentValue) => {
                        setActorKey(
                          currentValue === actorKey?.full_name ? null : actor,
                        );
                        setOpenActor(false);
                      }}
                    >
                      {actor.full_name}
                      <Check
                        className={cn(
                          "ml-auto",
                          actor.key === actorKey?.key
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div> */}

      {/* ============================ Actors ====================================================== */}

      {/* ============================ Directors ====================================================== */}
      <div className="border border-black p-2">
        <h1>Directors</h1>
        <div>
          {directorsList.length ? (
            <div className="flex flex-col gap-1">
              {directorsList.map((director) => (
                <TooltipProvider key={director.key}>
                  <Tooltip>
                    <div
                      key={director.key}
                      className="mr-2 flex w-max items-center gap-1 rounded-xl bg-purple-300 p-2 dark:bg-purple-700"
                    >
                      <TooltipTrigger
                        onClick={(e) => {
                          console.log("????????????????????");

                          // e.stopPropagation();
                          // e.preventDefault();
                          // setActionTimesList((prev) =>
                          //   prev.filter(
                          //     (actionTimePrev) =>
                          //       actionTimePrev.key !== actionTime.key,
                          //   ),
                          // );
                        }}
                        asChild
                        className="text-left"
                      >
                        <span>{director.full_name}</span>
                      </TooltipTrigger>
                      <CircleXIcon
                        className="cursor-pointer"
                        onClick={(e) => {
                          // e.stopPropagation();
                          // e.preventDefault();
                          setDirectorsList((prev) =>
                            prev.filter(
                              (directorPrev) =>
                                directorPrev.key !== director.key,
                            ),
                          );

                          directorsRef.current = directorsRef.current.filter(
                            (directorPrev) => directorPrev.key !== director.key,
                          );
                        }}
                      />
                    </div>

                    <TooltipContent>
                      <p>{"Some short info?"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          ) : (
            "Select directors..."
          )}
        </div>

        <Popover open={openDirectors} onOpenChange={setOpenDirectors}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              // aria-expanded={openSpec}
              className="h-max w-max justify-between"
            >
              {"Select directors..."}
              {/* {specificationKey.length
              ? specifications.find((specification) =>
                  specificationKey
                    .map((spec) => spec.key)
                    .includes(specification.key),
                )?.name
              : "Select specification..."} */}
              <ChevronsUpDown
                className="opacity-50"
                onClick={(e) => {
                  console.log("????????????????????");
                }}
              />
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search directors..." className="h-9" />
              <CommandList>
                <CommandEmpty>No director found.</CommandEmpty>

                <TooltipProvider>
                  <CommandGroup className="text-left">
                    {directors.map((director) => (
                      <CommandItem
                        key={director.key}
                        value={director.full_name}
                        onSelect={(currentValue) => {
                          setDirectorsList((prev) =>
                            currentValue ===
                            prev.find(
                              (directorPrev) =>
                                directorPrev.key === director.key,
                            )?.full_name
                              ? prev.filter(
                                  (directorPrev) =>
                                    directorPrev.key !== director.key,
                                )
                              : [...prev, director],
                          );
                          const a = directorsRef.current.find(
                            (directorPrev) => directorPrev.key === director.key,
                          );
                          if (!a) {
                            directorsRef.current.push({
                              key: director.key,
                            });
                          }

                          setOpenDirectors(false);
                        }}
                      >
                        <Tooltip>
                          <TooltipTrigger className="text-left">
                            {director.full_name}
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{"Some short info?"}</p>
                          </TooltipContent>
                        </Tooltip>
                        {/* {specification.name} */}
                        <Check
                          className={cn(
                            "ml-auto",
                            directorsList
                              .map((directorPrev) => directorPrev.key)
                              .includes(director.key)
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </TooltipProvider>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      {/* <div className="border border-black p-2">
        <h1>Directors</h1>
        <Popover open={openDirector} onOpenChange={setOpenDirector}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openDirector}
              className="w-[200px] justify-between"
            >
              {directorKey?.key
                ? directors.find((director) => director.key === directorKey.key)
                    ?.full_name
                : "Select director..."}
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search directors..." className="h-9" />
              <CommandList>
                <CommandEmpty>No director found.</CommandEmpty>
                <CommandGroup>
                  {directors.map((director) => (
                    <CommandItem
                      // keywords={["Морган Фрімен"]}
                      key={director.key}
                      value={director.full_name}
                      onSelect={(currentValue) => {
                        setDirectorKey(
                          currentValue === directorKey?.full_name
                            ? null
                            : director,
                        );
                        setOpenDirector(false);
                      }}
                    >
                      {director.full_name}
                      <Check
                        className={cn(
                          "ml-auto",
                          director.key === directorKey?.key
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div> */}

      {/* ============================ Directors ====================================================== */}

      {/* ============================ Genres ====================================================== */}
      <div className="border border-black p-2">
        <h1>Genres</h1>
        <div>
          {genresList.length ? (
            <div className="flex flex-col gap-1">
              {genresList.map((genre) => (
                <TooltipProvider key={genre.key}>
                  <Tooltip>
                    <div
                      key={genre.key}
                      className="mr-2 flex w-max items-center gap-1 rounded-xl bg-purple-300 p-2 dark:bg-purple-700"
                    >
                      <TooltipTrigger
                        onClick={(e) => {
                          console.log("????????????????????");

                          // e.stopPropagation();
                          // e.preventDefault();
                          // setGenresList((prev) =>
                          //   prev.filter(
                          //     (genrePrev) => genrePrev.key !== genre.key,
                          //   ),
                          // );
                        }}
                        asChild
                        className="text-left"
                      >
                        <span>{genre.name}</span>
                      </TooltipTrigger>
                      <Input
                        onChange={(e) => {
                          console.log("scec ref", +e.target.value);

                          const a = genresRef.current.find(
                            (genrePrev) => genrePrev.key === genre.key,
                          );
                          if (!a) {
                            genresRef.current.push({
                              key: genre.key,
                              percentage_match: +e.target.value,
                            });
                          } else {
                            a.percentage_match = +e.target.value;
                          }

                          // specRef.current = specRef.current.map(
                          //   (specification) =>
                          //     specification.key === spec.key
                          //       ? {
                          //           ...specification,
                          //           percentage_match: +e.target.value,
                          //         }
                          //       : specification,
                          // );
                        }}
                        className="w-12"
                        type="text"
                        placeholder="Poster"
                      />
                      %
                      <CircleXIcon
                        className="cursor-pointer"
                        onClick={(e) => {
                          // e.stopPropagation();
                          // e.preventDefault();
                          setGenresList((prev) =>
                            prev.filter(
                              (genrePrev) => genrePrev.key !== genre.key,
                            ),
                          );
                          genresRef.current = genresRef.current.filter(
                            (genrePrev) => genrePrev.key !== genre.key,
                          );
                          setSubgenres((prev) =>
                            prev.filter(
                              (subgenrePrev) =>
                                subgenrePrev.parent_genre_key !== genre.key,
                            ),
                          );

                          setSubgenresList((prev) =>
                            prev.filter(
                              (subgenrePrev) =>
                                subgenrePrev.parent_genre_key !== genre.key,
                            ),
                          );

                          subgenresRef.current = subgenresRef.current.filter(
                            (subgenrePrev) =>
                              subgenrePrev.subgenre_parent_key !== genre.key,
                          );
                        }}
                      />
                    </div>

                    <TooltipContent>
                      <p>{genre.description || "No description"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          ) : (
            "Select genres..."
          )}
        </div>

        <Popover open={openGenres} onOpenChange={setOpenGenres}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              // aria-expanded={openSpec}
              className="h-max w-max justify-between"
            >
              {"Select genres..."}
              <ChevronsUpDown
                className="opacity-50"
                onClick={(e) => {
                  console.log("????????????????????");
                }}
              />
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search genres..." className="h-9" />
              <CommandList>
                <CommandEmpty>No genres found.</CommandEmpty>

                <TooltipProvider>
                  <CommandGroup className="text-left">
                    {genres.map((genre) => (
                      <CommandItem
                        key={genre.key}
                        value={genre.name}
                        onSelect={(currentValue) => {
                          setGenresList((prev) =>
                            currentValue ===
                            prev.find(
                              (genrePrev) => genrePrev.key === genre.key,
                            )?.name
                              ? prev.filter(
                                  (genrePrev) => genrePrev.key !== genre.key,
                                )
                              : [...prev, genre],
                          );
                          if (genre.subgenres && genre.subgenres.length) {
                            setSubgenres((prev) => [
                              ...prev,
                              ...(genre.subgenres || []),
                            ]);
                          }
                          setOpenGenres(false);
                        }}
                      >
                        <Tooltip>
                          <TooltipTrigger className="text-left">
                            {genre.name}
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{genre.description || "No description"}</p>
                          </TooltipContent>
                        </Tooltip>
                        {/* {specification.name} */}
                        <Check
                          className={cn(
                            "ml-auto",
                            genresList
                              .map((genreItem) => genreItem.key)
                              .includes(genre.key)
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </TooltipProvider>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* ============================ Genres ====================================================== */}

      {/* ============================ Subgenres ====================================================== */}

      <div className="border border-black p-2">
        <h1>Subgenre</h1>
        <div>
          {subgenresList.length ? (
            <div className="flex flex-col gap-1">
              {subgenresList.map((subgenre) => (
                <TooltipProvider key={subgenre.key}>
                  <Tooltip>
                    <div
                      key={subgenre.key}
                      className="mr-2 flex w-max items-center gap-1 rounded-xl bg-purple-300 p-2 dark:bg-purple-700"
                    >
                      <TooltipTrigger
                        onClick={(e) => {
                          console.log("????????????????????");

                          // e.stopPropagation();
                          // e.preventDefault();
                          // setSubgenresList((prev) =>
                          //   prev.filter(
                          //     (subgenrePrev) =>
                          //       subgenrePrev.key !== subgenre.key,
                          //   ),
                          // );
                        }}
                        asChild
                        className="text-left"
                      >
                        <span>{subgenre.name}</span>
                      </TooltipTrigger>
                      <Input
                        onChange={(e) => {
                          console.log("scec ref", +e.target.value);

                          const a = subgenresRef.current.find(
                            (genrePrev) => genrePrev.key === subgenre.key,
                          );
                          if (!a) {
                            subgenresRef.current.push({
                              key: subgenre.key,
                              percentage_match: +e.target.value,
                              subgenre_parent_key: subgenre.parent_genre_key,
                            });
                          } else {
                            a.percentage_match = +e.target.value;
                          }

                          // specRef.current = specRef.current.map(
                          //   (specification) =>
                          //     specification.key === spec.key
                          //       ? {
                          //           ...specification,
                          //           percentage_match: +e.target.value,
                          //         }
                          //       : specification,
                          // );
                        }}
                        className="w-12"
                        type="text"
                        placeholder="Poster"
                      />
                      %
                      <CircleXIcon
                        className="cursor-pointer"
                        onClick={(e) => {
                          // e.stopPropagation();
                          // e.preventDefault();
                          setSubgenresList((prev) =>
                            prev.filter(
                              (subgenrePrev) =>
                                subgenrePrev.key !== subgenre.key,
                            ),
                          );

                          subgenresRef.current = subgenresRef.current.filter(
                            (subgenrePrev) => subgenrePrev.key !== subgenre.key,
                          );
                        }}
                      />
                    </div>

                    <TooltipContent>
                      <p>{subgenre.description || "No description"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          ) : (
            "Select subgenres..."
          )}
        </div>

        <Popover open={openSubgenres} onOpenChange={setOpenSubgenres}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              // aria-expanded={openSpec}
              className="h-max w-max justify-between"
            >
              {"Select subgenres..."}
              <ChevronsUpDown
                className="opacity-50"
                onClick={(e) => {
                  console.log("????????????????????");
                }}
              />
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search subgenres..." className="h-9" />
              <CommandList>
                <CommandEmpty>No subgenres found.</CommandEmpty>

                <TooltipProvider>
                  <CommandGroup className="text-left">
                    {subgenres.map((subgenre) => (
                      <CommandItem
                        key={subgenre.key}
                        value={subgenre.name}
                        onSelect={(currentValue) => {
                          setSubgenresList((prev) =>
                            currentValue ===
                            prev.find(
                              (genrePrev) => genrePrev.key === subgenre.key,
                            )?.name
                              ? prev.filter(
                                  (genrePrev) => genrePrev.key !== subgenre.key,
                                )
                              : [...prev, subgenre],
                          );
                          setOpenGenres(false);
                        }}
                      >
                        <Tooltip>
                          <TooltipTrigger className="text-left">
                            {subgenre.name}
                          </TooltipTrigger>
                          <TooltipContent className="max-w-[500px]">
                            <p>{subgenre.description || "No description"}</p>
                          </TooltipContent>
                        </Tooltip>
                        {/* {specification.name} */}
                        <Check
                          className={cn(
                            "ml-auto",
                            subgenresList
                              .map((genreItem) => genreItem.key)
                              .includes(subgenre.key)
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </TooltipProvider>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* ============================ Subgenres ====================================================== */}

      {/* ============================ Specifications ====================================================== */}

      <div className="border border-black p-2">
        <h1>Specification</h1>
        <div>
          {specificationKey.length ? (
            <div className="flex flex-col gap-1">
              {specificationKey.map((spec) => (
                <TooltipProvider key={spec.key}>
                  <Tooltip>
                    <div
                      key={spec.key}
                      className="mr-2 flex w-max items-center gap-1 rounded-xl bg-purple-300 p-2 dark:bg-purple-700"
                    >
                      <TooltipTrigger
                        onClick={(e) => {
                          console.log("????????????????????");

                          // e.stopPropagation();
                          // e.preventDefault();
                          // setSpecificationKey((prev) =>
                          //   prev.filter(
                          //     (specification) => specification.key !== spec.key,
                          //   ),
                          // );
                        }}
                        asChild
                        className="text-left"
                      >
                        <span>{spec.name}</span>
                      </TooltipTrigger>
                      <Input
                        onChange={(e) => {
                          console.log("scec ref", +e.target.value);

                          const a = specRef.current.find(
                            (specification) => specification.key === spec.key,
                          );
                          if (!a) {
                            specRef.current.push({
                              key: spec.key,
                              percentage_match: +e.target.value,
                            });
                          } else {
                            a.percentage_match = +e.target.value;
                          }

                          // specRef.current = specRef.current.map(
                          //   (specification) =>
                          //     specification.key === spec.key
                          //       ? {
                          //           ...specification,
                          //           percentage_match: +e.target.value,
                          //         }
                          //       : specification,
                          // );
                        }}
                        className="w-12"
                        type="text"
                        placeholder="Poster"
                      />
                      %
                      <CircleXIcon
                        className="cursor-pointer"
                        onClick={(e) => {
                          // e.stopPropagation();
                          // e.preventDefault();
                          setSpecificationKey((prev) =>
                            prev.filter(
                              (specification) => specification.key !== spec.key,
                            ),
                          );

                          specRef.current = specRef.current.filter(
                            (specification) => specification.key !== spec.key,
                          );
                        }}
                      />
                    </div>

                    <TooltipContent>
                      <p>{spec.description || "No description"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          ) : (
            "Select specification..."
          )}
        </div>

        <Popover open={openSpec} onOpenChange={setOpenSpec}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              // aria-expanded={openSpec}
              className="h-max w-max justify-between"
            >
              {"Select specification..."}
              {/* {specificationKey.length
              ? specifications.find((specification) =>
                  specificationKey
                    .map((spec) => spec.key)
                    .includes(specification.key),
                )?.name
              : "Select specification..."} */}
              <ChevronsUpDown
                className="opacity-50"
                onClick={(e) => {
                  console.log("????????????????????");
                }}
              />
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput
                placeholder="Search specifications..."
                className="h-9"
              />
              <CommandList>
                <CommandEmpty>No specification found.</CommandEmpty>

                <TooltipProvider>
                  <CommandGroup className="text-left">
                    {specifications.map((specification) => (
                      <CommandItem
                        key={specification.key}
                        value={specification.name}
                        onSelect={(currentValue) => {
                          setSpecificationKey((prev) =>
                            currentValue ===
                            prev.find((spec) => spec.key === specification.key)
                              ?.name
                              ? prev.filter(
                                  (spec) => spec.key !== specification.key,
                                )
                              : [...prev, specification],
                          );
                          setOpenSpec(false);
                        }}
                      >
                        <Tooltip>
                          <TooltipTrigger className="text-left">
                            {specification.name}
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              {specification.description || "No description"}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                        {/* {specification.name} */}
                        <Check
                          className={cn(
                            "ml-auto",
                            specificationKey
                              .map((spec) => spec.key)
                              .includes(specification.key)
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </TooltipProvider>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* ============================ Specifications ====================================================== */}

      {/* ============================ Keywords ====================================================== */}
      <div className="border border-black p-2">
        <h1>Keywords</h1>
        <div>
          {keywordsList.length ? (
            <div className="flex flex-col gap-1">
              {keywordsList.map((keyword) => (
                <TooltipProvider key={keyword.key}>
                  <Tooltip>
                    <div
                      key={keyword.key}
                      className="mr-2 flex w-max items-center gap-1 rounded-xl bg-purple-300 p-2 dark:bg-purple-700"
                    >
                      <TooltipTrigger
                        onClick={(e) => {
                          console.log("????????????????????");

                          // e.stopPropagation();
                          // e.preventDefault();
                          // setKeywordsList((prev) =>
                          //   prev.filter(
                          //     (keywordPrev) => keywordPrev.key !== keyword.key,
                          //   ),
                          // );
                        }}
                        asChild
                        className="text-left"
                      >
                        <span>{keyword.name}</span>
                      </TooltipTrigger>
                      <Input
                        onChange={(e) => {
                          console.log("scec ref", +e.target.value);

                          const a = keywordsRef.current.find(
                            (keywordsPrev) => keywordsPrev.key === keyword.key,
                          );
                          if (!a) {
                            keywordsRef.current.push({
                              key: keyword.key,
                              percentage_match: +e.target.value,
                            });
                          } else {
                            a.percentage_match = +e.target.value;
                          }

                          // specRef.current = specRef.current.map(
                          //   (specification) =>
                          //     specification.key === spec.key
                          //       ? {
                          //           ...specification,
                          //           percentage_match: +e.target.value,
                          //         }
                          //       : specification,
                          // );
                        }}
                        className="w-12"
                        type="text"
                        placeholder="Poster"
                      />
                      %
                      <CircleXIcon
                        className="cursor-pointer"
                        onClick={(e) => {
                          // e.stopPropagation();
                          // e.preventDefault();
                          setKeywordsList((prev) =>
                            prev.filter(
                              (keywordsPrev) =>
                                keywordsPrev.key !== keyword.key,
                            ),
                          );

                          keywordsRef.current = keywordsRef.current.filter(
                            (keywordsPrev) => keywordsPrev.key !== keyword.key,
                          );
                        }}
                      />
                    </div>

                    <TooltipContent>
                      <p>{keyword.description || "No description"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          ) : (
            "Select keywords..."
          )}
        </div>

        <Popover open={openKeywords} onOpenChange={setOpenKeywords}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              // aria-expanded={openSpec}
              className="h-max w-max justify-between"
            >
              {"Select specification..."}
              {/* {specificationKey.length
              ? specifications.find((specification) =>
                  specificationKey
                    .map((spec) => spec.key)
                    .includes(specification.key),
                )?.name
              : "Select specification..."} */}
              <ChevronsUpDown
                className="opacity-50"
                onClick={(e) => {
                  console.log("????????????????????");
                }}
              />
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search keywords..." className="h-9" />
              <CommandList>
                <CommandEmpty>No keyword found.</CommandEmpty>

                <TooltipProvider>
                  <CommandGroup className="text-left">
                    {keywords.map((keyword) => (
                      <CommandItem
                        key={keyword.key}
                        value={keyword.name}
                        onSelect={(currentValue) => {
                          setKeywordsList((prev) =>
                            currentValue ===
                            prev.find(
                              (keywordsPrev) =>
                                keywordsPrev.key === keyword.key,
                            )?.name
                              ? prev.filter(
                                  (keywordsPrev) =>
                                    keywordsPrev.key !== keyword.key,
                                )
                              : [...prev, keyword],
                          );
                          setOpenKeywords(false);
                        }}
                      >
                        <Tooltip>
                          <TooltipTrigger className="text-left">
                            {keyword.name}
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{keyword.description || "No description"}</p>
                          </TooltipContent>
                        </Tooltip>
                        {/* {specification.name} */}
                        <Check
                          className={cn(
                            "ml-auto",
                            keywordsList
                              .map((keywordsPrev) => keywordsPrev.key)
                              .includes(keyword.key)
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </TooltipProvider>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      {/* ============================ Keywords ====================================================== */}

      {/* ============================ Action Times ====================================================== */}
      <div className="border border-black p-2">
        <h1>Action Times</h1>
        <div>
          {actionTimesList.length ? (
            <div className="flex flex-col gap-1">
              {actionTimesList.map((actionTime) => (
                <TooltipProvider key={actionTime.key}>
                  <Tooltip>
                    <div
                      key={actionTime.key}
                      className="mr-2 flex w-max items-center gap-1 rounded-xl bg-purple-300 p-2 dark:bg-purple-700"
                    >
                      <TooltipTrigger
                        onClick={(e) => {
                          console.log("????????????????????");

                          // e.stopPropagation();
                          // e.preventDefault();
                          // setActionTimesList((prev) =>
                          //   prev.filter(
                          //     (actionTimePrev) =>
                          //       actionTimePrev.key !== actionTime.key,
                          //   ),
                          // );
                        }}
                        asChild
                        className="text-left"
                      >
                        <span>{actionTime.name}</span>
                      </TooltipTrigger>
                      <Input
                        onChange={(e) => {
                          console.log("scec ref", +e.target.value);

                          const a = actionTimesRef.current.find(
                            (actionTImePrev) =>
                              actionTImePrev.key === actionTime.key,
                          );
                          if (!a) {
                            actionTimesRef.current.push({
                              key: actionTime.key,
                              percentage_match: +e.target.value,
                            });
                          } else {
                            a.percentage_match = +e.target.value;
                          }

                          // specRef.current = specRef.current.map(
                          //   (specification) =>
                          //     specification.key === spec.key
                          //       ? {
                          //           ...specification,
                          //           percentage_match: +e.target.value,
                          //         }
                          //       : specification,
                          // );
                        }}
                        className="w-12"
                        type="text"
                        placeholder="Poster"
                      />
                      %
                      <CircleXIcon
                        className="cursor-pointer"
                        onClick={(e) => {
                          // e.stopPropagation();
                          // e.preventDefault();
                          setActionTimesList((prev) =>
                            prev.filter(
                              (actionTimePrev) =>
                                actionTimePrev.key !== actionTime.key,
                            ),
                          );

                          actionTimesRef.current =
                            actionTimesRef.current.filter(
                              (actionTimesPrev) =>
                                actionTimesPrev.key !== actionTime.key,
                            );
                        }}
                      />
                    </div>

                    <TooltipContent>
                      <p>{actionTime.description || "No description"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          ) : (
            "Select action times..."
          )}
        </div>

        <Popover open={openActionTimes} onOpenChange={setOpenActionTimes}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              // aria-expanded={openSpec}
              className="h-max w-max justify-between"
            >
              {"Select specification..."}
              {/* {specificationKey.length
              ? specifications.find((specification) =>
                  specificationKey
                    .map((spec) => spec.key)
                    .includes(specification.key),
                )?.name
              : "Select specification..."} */}
              <ChevronsUpDown
                className="opacity-50"
                onClick={(e) => {
                  console.log("????????????????????");
                }}
              />
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput
                placeholder="Search action times..."
                className="h-9"
              />
              <CommandList>
                <CommandEmpty>No action time found.</CommandEmpty>

                <TooltipProvider>
                  <CommandGroup className="text-left">
                    {actionTimes.map((actionTime) => (
                      <CommandItem
                        key={actionTime.key}
                        value={actionTime.name}
                        onSelect={(currentValue) => {
                          setActionTimesList((prev) =>
                            currentValue ===
                            prev.find(
                              (actionTimePrev) =>
                                actionTimePrev.key === actionTime.key,
                            )?.name
                              ? prev.filter(
                                  (actionTimePrev) =>
                                    actionTimePrev.key !== actionTime.key,
                                )
                              : [...prev, actionTime],
                          );
                          setOpenActionTimes(false);
                        }}
                      >
                        <Tooltip>
                          <TooltipTrigger className="text-left">
                            {actionTime.name}
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{actionTime.description || "No description"}</p>
                          </TooltipContent>
                        </Tooltip>
                        {/* {specification.name} */}
                        <Check
                          className={cn(
                            "ml-auto",
                            actionTimesList
                              .map((actionTimePrev) => actionTimePrev.key)
                              .includes(actionTime.key)
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </TooltipProvider>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      {/* ============================ Action Times ====================================================== */}

      <div className="grid gap-2">
        <Label htmlFor="rating-criteria">Rating Criteria</Label>
        <Select
          onValueChange={(value: RatingCriterion) => {
            ratingCriteriaRef.current = value;
          }}
          defaultValue={RatingCriterion.basic}
        >
          <SelectTrigger id="rating-criteria">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={RatingCriterion.basic}>Basic</SelectItem>
            <SelectItem value={RatingCriterion.visual_effects}>
              Visual Effects
            </SelectItem>
            <SelectItem value={RatingCriterion.scare_factor}>
              Scary Factor
            </SelectItem>
            <SelectItem value={RatingCriterion.full}>Full</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button onClick={addMovie}>Submit</Button>

      {/*===================================  Report an issue ============================= */}

      {/* <Card className="w-[700px]">
        <CardHeader>
          <CardTitle>Report an issue</CardTitle>
          <CardDescription>
            What area are you having problems with?
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="area">Area</Label>
              <Select defaultValue="billing">
                <SelectTrigger id="area">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="team">Team</SelectItem>
                  <SelectItem value="billing">Billing</SelectItem>
                  <SelectItem value="account">Account</SelectItem>
                  <SelectItem value="deployments">Deployments</SelectItem>
                  <SelectItem value="support">Support</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="security-level">Security Level</Label>
              <Select defaultValue="2">
                <SelectTrigger id="security-level" className="">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Severity 1 (Highest)</SelectItem>
                  <SelectItem value="2">Severity 2</SelectItem>
                  <SelectItem value="3">Severity 3</SelectItem>
                  <SelectItem value="4">Severity 4 (Lowest)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="subject">Subject</Label>
            <Input id="subject" placeholder="I need help with..." />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Please include all information relevant to your issue."
            />
          </div>
        </CardContent>
        <CardFooter className="justify-between space-x-2">
          <Button variant="ghost">Cancel</Button>
          <Button onClick={addMovie}>Submit</Button>
        </CardFooter>
      </Card> */}

      {/*===================================  Report an issue ============================= */}

      {/* <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
          >
            {value
              ? frameworks.find((framework) => framework.value === value)?.label
              : "Select framework..."}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search framework..." className="h-9" />
            <CommandList>
              <CommandEmpty>No framework found.</CommandEmpty>
              <CommandGroup>
                {frameworks.map((framework) => (
                  <CommandItem
                    key={framework.value}
                    value={framework.value}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                  >
                    {framework.label}
                    <Check
                      className={cn(
                        "ml-auto",
                        value === framework.value ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover> */}
    </div>
  );
};
