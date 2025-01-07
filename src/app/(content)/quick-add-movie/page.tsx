import { QuicklyAddNewMovie } from "@/components/movies/quick-add-new-movie";

export default async function QuickAddMoviePage() {
  return (
    <div>
      <h1 className="text-2xl">Quickly add new Movie</h1>

      <QuicklyAddNewMovie />
    </div>
  );
}
