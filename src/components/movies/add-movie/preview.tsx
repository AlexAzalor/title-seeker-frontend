import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { MovieFormData } from "@/orval_api/model";
import { toast } from "sonner";

type Props = {
  movieFormData: MovieFormData;
  file: File;
};

export const Preview = ({ movieFormData, file }: Props) => {
  const clearForm = () => {
    try {
      localStorage.removeItem("new-movie-data");
      toast.success("Form cleared");

      window.location.reload();
    } catch (error) {
      console.error(error);
      toast.error("Error clearing form");
    }
  };

  return (
    <div>
      <div>
        <h1>Preview</h1>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="border-2">
          <h1>Main</h1>
          <div>
            Key: <span className="text-xl font-bold">{movieFormData.key}</span>
          </div>
          <div>
            Title EN:{" "}
            <span className="text-xl font-bold">{movieFormData.title_en}</span>
          </div>
          <div>
            Title UK:{" "}
            <span className="text-xl font-bold">{movieFormData.title_uk}</span>
          </div>
          <div>
            Poster:{" "}
            <span className="text-xl font-bold">
              {file?.name || "No poster"}
            </span>
          </div>
        </div>

        <div className="border-2">
          <h1>Rating</h1>
          <div>
            Rating:{" "}
            <span className="text-xl font-bold">{movieFormData.rating}</span>
          </div>
          <div>
            Rating criterion type:{" "}
            <span className="text-xl font-bold">
              {movieFormData.rating_criterion_type}
            </span>
          </div>
          <div>
            Acting:{" "}
            <span className="text-xl font-bold">
              {movieFormData.rating_criteria.acting}
            </span>
          </div>

          <div>
            Plot/Storyline:{" "}
            <span className="text-xl font-bold">
              {movieFormData.rating_criteria.plot_storyline}
            </span>
          </div>
          <div>
            Music:{" "}
            <span className="text-xl font-bold">
              {movieFormData.rating_criteria.music}
            </span>
          </div>

          <div>
            Re-watchability:{" "}
            <span className="text-xl font-bold">
              {movieFormData.rating_criteria.re_watchability}
            </span>
          </div>
          <div>
            Emotional Impact:{" "}
            <span className="text-xl font-bold">
              {movieFormData.rating_criteria.emotional_impact}
            </span>
          </div>
          <div>
            Dialogue:{" "}
            <span className="text-xl font-bold">
              {movieFormData.rating_criteria.dialogue}
            </span>
          </div>
          <div>
            Production Design:{" "}
            <span className="text-xl font-bold">
              {movieFormData.rating_criteria.production_design}
            </span>
          </div>
          <div>
            Duration:{" "}
            <span className="text-xl font-bold">
              {movieFormData.rating_criteria.duration}
            </span>
          </div>
          <div>
            Visual Effects:{" "}
            <span className="text-xl font-bold">
              {movieFormData.rating_criteria.visual_effects || "N/A"}
            </span>
          </div>
          <div>
            Scare Factor:{" "}
            <span className="text-xl font-bold">
              {movieFormData.rating_criteria.scare_factor || "N/A"}
            </span>
          </div>
        </div>

        <div className="border-2">
          <h1>Info</h1>
          <div>
            Description EN:{" "}
            <span className="text-xl font-bold">
              {movieFormData.description_en}
            </span>
          </div>
          <div>
            Description UK:{" "}
            <span className="text-xl font-bold">
              {movieFormData.description_uk}
            </span>
          </div>
          <div>
            Release date:{" "}
            <span className="text-xl font-bold">
              {formatDate(movieFormData.release_date, "en")}
            </span>
          </div>
          <div>
            Duration:{" "}
            <span className="text-xl font-bold">{movieFormData.duration}</span>
          </div>
          <div>
            Budget:{" "}
            <span className="text-xl font-bold">{movieFormData.budget}</span>
          </div>
          <div>
            Domestic gross:{" "}
            <span className="text-xl font-bold">
              {movieFormData.domestic_gross}
            </span>
          </div>
          <div>
            Worldwide gross:{" "}
            <span className="text-xl font-bold">
              {movieFormData.worldwide_gross}
            </span>
          </div>
          <div>
            Location EN:{" "}
            <span className="text-xl font-bold">
              {movieFormData.location_en}
            </span>
          </div>
          <div>
            Location UK:{" "}
            <span className="text-xl font-bold">
              {movieFormData.location_uk}
            </span>
          </div>
        </div>

        <div className="border-2">
          <h1>Actors</h1>
          {movieFormData.actors_keys.map((actor) => (
            <div key={actor.key} className="border border-orange-300 p-2">
              <div>
                Character key:{" "}
                <span className="text-xl font-bold">{actor.character_key}</span>
              </div>
              <div>
                Character name EN:{" "}
                <span className="text-xl font-bold">
                  {actor.character_name_en}
                </span>
              </div>
              <div>
                Character name UK:{" "}
                <span className="text-xl font-bold">
                  {actor.character_name_uk}
                </span>
              </div>
              <div>
                Key: <span className="text-xl font-bold">{actor.key}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="border-2">
          <h1>Directors</h1>
          {movieFormData.directors_keys.map((director) => (
            <div key={director}>{director}</div>
          ))}
        </div>

        <div className="border-2">
          <h1>Genres</h1>
          {movieFormData.genres.map((genre) => (
            <div key={genre.key}>
              {genre.key}{" "}
              <span className="text-xl font-bold">
                {genre.percentage_match}
              </span>
            </div>
          ))}
        </div>

        <div className="border-2">
          <h1>Subgenres</h1>
          {movieFormData.subgenres.map((subgenre) => (
            <div key={subgenre.key}>
              {subgenre.key}{" "}
              <span className="text-xl font-bold">
                {subgenre.percentage_match}
              </span>
            </div>
          ))}
        </div>

        <div className="border-2">
          <h1>Specifications</h1>
          {movieFormData.specifications.map((specification) => (
            <div key={specification.key}>
              <div>
                {specification.key}{" "}
                <span className="text-xl font-bold">
                  {specification.percentage_match}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="border-2">
          <h1>Keywords</h1>
          {movieFormData.keywords.map((keyword) => (
            <div key={keyword.key}>
              <div>
                {keyword.key}{" "}
                <span className="text-xl font-bold">
                  {keyword.percentage_match}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="border-2">
          <h1>Action Times</h1>
          {movieFormData.action_times.map((actionTimes) => (
            <div key={actionTimes.key}>
              <div>
                {actionTimes.key}{" "}
                <span className="text-xl font-bold">
                  {actionTimes.percentage_match}
                </span>
              </div>
            </div>
          ))}
        </div>
        <Button variant="destructive" onClick={clearForm}>
          Clear form
        </Button>
      </div>
    </div>
  );
};
