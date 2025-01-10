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
import { cn, formatKey } from "@/lib/utils";
import { ActorOut, DirectorOut, MovieFormData } from "@/orval_api/model";
import { ActorsListScheme } from "@/types/zod-scheme";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown } from "lucide-react";
import { use, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { AddNewDirector } from "../add-new-director";
import { AddNewActor } from "../add-new-actor";
import { MovieFormContext } from "./movie-form-wizard";

type Props = {
  actors: ActorOut[];
  directors: DirectorOut[];
};

export type MovieInfoFieldNames = Pick<
  MovieFormData,
  "actors_keys" | "directors_keys"
>;

export type PeopleSchemeType = z.infer<typeof ActorsListScheme>;

export const PeopleFieldsForm = ({ actors, directors }: Props) => {
  const { setMovieFormData, handleNext, handlePrev } = use(MovieFormContext);

  const savedData = localStorage.getItem("new-movie-data");
  const parsedData: MovieFormData = JSON.parse(savedData || "{}");

  const [openActor, setOpenActor] = useState(false);
  const [openDirector, setOpenDirector] = useState(false);
  const [openDirectorFormModal, setOpenDirectorFormModal] = useState(false);
  const [openActorFormModal, setOpenActorFormModal] = useState(false);

  const defaultActors = parsedData?.actors_keys?.map((a) => {
    return {
      actor_name: actors.find((actor) => actor.key === a.key)?.full_name || "",
      character_key: a.character_key,
      character_name_en: a.character_name_en,
      character_name_uk: a.character_name_uk,
      key: a.key,
    };
  });

  const defaultDirectors = parsedData?.directors_keys?.map((d) => {
    return {
      full_name:
        directors.find((director) => director.key === d)?.full_name || "",
      key: d,
    };
  });

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(ActorsListScheme),
    defaultValues: {
      actors: defaultActors || [
        {
          actor_name: "",
          character_key: "",
          character_name_en: "",
          character_name_uk: "",
          key: "",
        },
      ],
      directors: defaultDirectors || [{ full_name: "", key: "" }],
    },
  });

  const {
    fields: actorFields,
    append: appendActor,
    remove: removeActor,
  } = useFieldArray({
    control,
    name: "actors",
  });

  const watchFields = watch("actors");

  const {
    fields: directorFields,
    append: appendDirector,
    remove: removeDirector,
  } = useFieldArray({
    control,
    name: "directors",
  });

  const onSubmit = (data: PeopleSchemeType) => {
    const dataToSend: MovieInfoFieldNames = {
      actors_keys: data.actors,
      directors_keys: data.directors.map((director) => director.key),
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
          <h2>Actors</h2>
          {actorFields.map((field, index) => (
            <div key={field.id}>
              <input {...register(`actors.${index}.actor_name`)} disabled />
              <input
                {...register(`actors.${index}.character_name_en`)}
                placeholder="Character name EN"
              />
              <input
                {...register(`actors.${index}.character_name_uk`)}
                placeholder="Character name uk"
              />
              <input
                {...register(`actors.${index}.character_key`)}
                value={formatKey([watchFields[index].character_name_en])}
                disabled
              />
              <button type="button" onClick={() => removeActor(index)}>
                Remove Actor
              </button>
              {errors.actors?.[index]?.character_name_en && (
                <p>{errors.actors[index].character_name_en.message}</p>
              )}
            </div>
          ))}

          <Popover open={openActor} onOpenChange={setOpenActor}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                role="combobox"
                // aria-expanded={openSpec}
                className="h-max w-max justify-between"
              >
                {"Select actor..."}
                <ChevronsUpDown className="opacity-50" />
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Search actors..." className="h-9" />
                <CommandList>
                  <CommandEmpty>
                    No actor found.{" "}
                    {/* after add set value from this input to form's input */}
                    <Button
                      variant="link"
                      onClick={() => setOpenActorFormModal(true)}
                    >
                      Add?
                    </Button>
                  </CommandEmpty>

                  <TooltipProvider>
                    <CommandGroup className="text-left">
                      {/* need switch lang to search actors */}
                      {actors.map((actor) => (
                        <CommandItem
                          key={actor.key}
                          value={actor.full_name}
                          onSelect={(currentValue) => {
                            console.log("currentValue", currentValue);

                            if (
                              !actorFields.find(
                                (actorPrev) => actorPrev.key === actor.key,
                              )
                            ) {
                              appendActor({
                                actor_name: currentValue,
                                // character_key: formatKey([currentValue]),
                                character_key: "",
                                character_name_en: "",
                                character_name_uk: "",
                                key: actor.key,
                              });
                            } else {
                              removeActor(
                                actorFields.findIndex(
                                  (actorPrev) => actorPrev.key === actor.key,
                                ),
                              );
                            }
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
                              actorFields
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

          <h2>Directors</h2>
          {directorFields.map((field, index) => (
            <div key={field.id}>
              <input {...register(`directors.${index}.full_name`)} disabled />
              <input {...register(`directors.${index}.key`)} disabled />

              <button type="button" onClick={() => removeDirector(index)}>
                Remove Director
              </button>
              {errors.directors?.[index]?.full_name && (
                <p>{errors.directors[index].full_name.message}</p>
              )}
            </div>
          ))}

          <Popover open={openDirector} onOpenChange={setOpenDirector}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                role="combobox"
                className="h-max w-max justify-between"
              >
                {"Select director..."}
                <ChevronsUpDown className="opacity-50" />
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput
                  placeholder="Search directors..."
                  className="h-9"
                />
                <CommandList>
                  <CommandEmpty>
                    No director found.{" "}
                    {/* after add new item, set value from this input to form's input */}
                    <Button
                      variant="link"
                      onClick={() => setOpenDirectorFormModal(true)}
                    >
                      Add?
                    </Button>
                  </CommandEmpty>

                  <TooltipProvider>
                    <CommandGroup className="text-left">
                      {/* need switch lang to search actors */}
                      {directors.map((director) => (
                        <CommandItem
                          key={director.key}
                          value={director.full_name}
                          onSelect={(currentValue) => {
                            console.log("currentValue", currentValue);

                            if (
                              !directorFields.find(
                                (directorPrev) =>
                                  directorPrev.key === director.key,
                              )
                            ) {
                              appendDirector({
                                full_name: currentValue,
                                key: director.key,
                              });
                            } else {
                              removeDirector(
                                directorFields.findIndex(
                                  (directorPrev) =>
                                    directorPrev.key === director.key,
                                ),
                              );
                            }
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
                              directorFields
                                .map((actorPrev) => actorPrev.key)
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

      <Dialog open={openActorFormModal} onOpenChange={setOpenActorFormModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <AddNewActor appendActor={appendActor} />
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog
        open={openDirectorFormModal}
        onOpenChange={setOpenDirectorFormModal}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Director</DialogTitle>
            <AddNewDirector appendDirector={appendDirector} />
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};
