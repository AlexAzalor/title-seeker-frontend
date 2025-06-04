import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { TitleFilterSelector } from "@/components/profile/admin/title-filters/title-filter-selector";

export default async function TitleFiltersPage() {
  const session = await auth();
  if (session?.user.role !== "owner") {
    return redirect("/");
  }

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
