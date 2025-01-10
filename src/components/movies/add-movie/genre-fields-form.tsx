import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { GenreOut, MovieFormData, SubgenreOut } from "@/orval_api/model";
import { GenreSchemeList } from "@/types/zod-scheme";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown } from "lucide-react";
import { use, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { MovieFormContext } from "./movie-form-wizard";
import { AddNewGenre } from "../add-new-genre";
import { AddNewSubgenre } from "../add-new-subgenre";

type Props = {
  genres: GenreOut[];
};

export type MovieInfoFieldNames = Pick<MovieFormData, "genres" | "subgenres">;

export type GenreSchemeType = z.infer<typeof GenreSchemeList>;

export const GenreFieldsForm = ({ genres }: Props) => {
  const { setMovieFormData, handleNext, handlePrev } = use(MovieFormContext);

  const savedData = localStorage.getItem("new-movie-data");
  const parsedData: MovieFormData = JSON.parse(savedData || "{}");

  const [openGenres, setOpenGenres] = useState(false);
  const [openSubgenres, setOpenSubgenres] = useState(false);
  const [openGenreFormModal, setOpenGenreFormModal] = useState(false);
  const [openSubgenreFormModal, setOpenSubgenreFormModal] = useState(false);

  const genresKeys = parsedData.genres?.map((g) => g.key);

  const [subgenres, setSubgenres] = useState<SubgenreOut[]>(
    genresKeys
      ? genres
          .map(
            (g) =>
              g.subgenres?.filter((e) =>
                genresKeys.includes(e.parent_genre_key),
              ) || [],
          )
          .flat()
      : [],
  );

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(GenreSchemeList),
    defaultValues: {
      genres: parsedData?.genres?.length
        ? parsedData.genres
        : [
            {
              name: "",
              key: "",
              percentage_match: 0,
            },
          ],
      subgenres: parsedData?.subgenres?.length
        ? parsedData.subgenres
        : [
            {
              name: "",
              key: "",
              percentage_match: 0,
            },
          ],
    },
  });

  const {
    fields: genreFields,
    append: appendGenre,
    remove: removeGenre,
  } = useFieldArray({
    control,
    name: "genres",
  });

  const {
    fields: subgenreFields,
    append: appendSubgenre,
    remove: removeSubgenre,
  } = useFieldArray({
    control,
    name: "subgenres",
  });

  const onSubmit = (data: GenreSchemeType) => {
    const dataToSend: MovieInfoFieldNames = {
      genres: data.genres,
      subgenres: data.subgenres,
    };

    setMovieFormData((prev) => ({
      ...prev,
      form_data: {
        ...prev.form_data,
        ...dataToSend,
      },
    }));

    localStorage.setItem(
      "new-movie-data",
      JSON.stringify({
        ...parsedData,
        ...dataToSend,
      }),
    );

    handleNext();
  };

  return (
    <>
      <div className="text-textOrange flex items-center gap-3 font-bold">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
          <h2>Genres</h2>
          {genreFields.map((field, index) => (
            <div key={field.id}>
              <input {...register(`genres.${index}.name`)} disabled />
              <input
                {...register(`genres.${index}.percentage_match`)}
                placeholder="Percentage match"
              />

              <button
                type="button"
                onClick={() => {
                  removeGenre(index);
                  setSubgenres((prev) =>
                    prev.filter(
                      (subgenrePrev) =>
                        subgenrePrev.parent_genre_key !== field.key,
                    ),
                  );
                  removeSubgenre(
                    subgenreFields.findIndex(
                      (subgenrePrev) =>
                        subgenrePrev.subgenre_parent_key === field.key,
                    ),
                  );
                }}
              >
                Remove Actor
              </button>
              {errors.genres?.[index]?.name && (
                <p>{errors.genres[index].name.message}</p>
              )}
            </div>
          ))}

          <Popover open={openGenres} onOpenChange={setOpenGenres}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                role="combobox"
                // aria-expanded={openSpec}
                className="h-max w-max justify-between"
              >
                {"Select genre..."}
                <ChevronsUpDown className="opacity-50" />
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Search genres..." className="h-9" />
                <CommandList>
                  <CommandEmpty>
                    No genre found.{" "}
                    {/* after add set value from this input to form's input */}
                    <Button
                      variant="link"
                      onClick={() => setOpenGenreFormModal(true)}
                    >
                      Add?
                    </Button>
                  </CommandEmpty>

                  <TooltipProvider>
                    <CommandGroup className="text-left">
                      {/* need switch lang to search actors */}
                      {genres.map((genre) => (
                        <CommandItem
                          key={genre.key}
                          value={genre.name}
                          onSelect={(currentValue) => {
                            console.log("currentValue", currentValue);

                            if (
                              !genreFields.find(
                                (genrePrev) => genrePrev.key === genre.key,
                              )
                            ) {
                              appendGenre({
                                name: currentValue,
                                percentage_match: 0,
                                key: genre.key,
                              });

                              if (genre.subgenres && genre.subgenres.length) {
                                setSubgenres((prev) => [
                                  ...prev,
                                  ...(genre.subgenres || []),
                                ]);
                              }
                            } else {
                              removeGenre(
                                genreFields.findIndex(
                                  (genrePrev) => genrePrev.key === genre.key,
                                ),
                              );

                              setSubgenres((prev) =>
                                prev.filter(
                                  (subgenrePrev) =>
                                    subgenrePrev.parent_genre_key !== genre.key,
                                ),
                              );
                            }
                          }}
                        >
                          <Tooltip>
                            <TooltipTrigger className="text-left">
                              {genre.name}
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{"Some short info?"}</p>
                            </TooltipContent>
                          </Tooltip>
                          {/* {specification.name} */}
                          <Check
                            className={cn(
                              "ml-auto",
                              genreFields
                                .map((genrePrev) => genrePrev.key)
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

          <h2>Subgenres</h2>
          {subgenreFields.map((field, index) => (
            <div key={field.id}>
              <input {...register(`subgenres.${index}.name`)} disabled />
              <input
                {...register(`subgenres.${index}.percentage_match`)}
                placeholder="Percentage match"
              />

              <button type="button" onClick={() => removeSubgenre(index)}>
                Remove Subgenre
              </button>
              {errors.subgenres?.[index]?.name && (
                <p>{errors.subgenres[index].name.message}</p>
              )}
            </div>
          ))}

          <Popover open={openSubgenres} onOpenChange={setOpenSubgenres}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                role="combobox"
                // aria-expanded={openSpec}
                className="h-max w-max justify-between"
              >
                {"Select subgenre..."}
                <ChevronsUpDown className="opacity-50" />
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput
                  placeholder="Search subgenres..."
                  className="h-9"
                />
                <CommandList>
                  <CommandEmpty>
                    No subgenre found.{" "}
                    {/* after add set value from this input to form's input */}
                    <Button
                      variant="link"
                      onClick={() => setOpenSubgenreFormModal(true)}
                    >
                      Add?
                    </Button>
                  </CommandEmpty>

                  <TooltipProvider>
                    <CommandGroup className="text-left">
                      {/* need switch lang to search actors */}
                      {subgenres.map((subgenre) => (
                        <CommandItem
                          key={subgenre.key}
                          value={subgenre.name}
                          onSelect={(currentValue) => {
                            console.log("currentValue", currentValue);

                            if (
                              !subgenreFields.find(
                                (subgenrePrev) =>
                                  subgenrePrev.key === subgenre.key,
                              )
                            ) {
                              appendSubgenre({
                                name: currentValue,
                                percentage_match: 0,
                                subgenre_parent_key: subgenre.parent_genre_key,
                                key: subgenre.key,
                              });
                            } else {
                              removeSubgenre(
                                subgenreFields.findIndex(
                                  (subgenrePrev) =>
                                    subgenrePrev.key === subgenre.key,
                                ),
                              );
                            }
                          }}
                        >
                          <Tooltip>
                            <TooltipTrigger className="text-left">
                              {subgenre.name}
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{"Some short info?"}</p>
                            </TooltipContent>
                          </Tooltip>
                          {/* {specification.name} */}
                          <Check
                            className={cn(
                              "ml-auto",
                              subgenreFields
                                .map((subgenrePrev) => subgenrePrev.key)
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
          <Button
            type="submit"
            className="mt-7 h-12 w-full cursor-pointer rounded-xl border-0 text-center text-lg transition-all duration-200 hover:rounded-md"
          >
            Submit
          </Button>

          <Button type="button" variant="link" onClick={handlePrev}>
            back
          </Button>
        </form>
      </div>

      <Dialog open={openGenreFormModal} onOpenChange={setOpenGenreFormModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Director</DialogTitle>
            <AddNewGenre appendGenre={appendGenre} />
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog
        open={openSubgenreFormModal}
        onOpenChange={setOpenSubgenreFormModal}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Director</DialogTitle>
            <AddNewSubgenre
              appendSubgenre={appendSubgenre}
              setSubgenres={setSubgenres}
              genresList={genreFields}
            />
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};
