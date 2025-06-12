import { TitleFilterSelector } from "@/components/profile/admin/title-filters/title-filter-selector";
import { getAdminOrRedirect } from "@/app/services/admin-api";

export default async function TitleFiltersPage() {
  await getAdminOrRedirect();

  return (
    <div>
      <h1 className="mb-3 text-2xl">Title Filters</h1>
      <p>Update Genres, Subgenres, Specifications, Keywords, Action Times</p>

      <div className="flex flex-col gap-3">
        <TitleFilterSelector />
      </div>
    </div>
  );
}
