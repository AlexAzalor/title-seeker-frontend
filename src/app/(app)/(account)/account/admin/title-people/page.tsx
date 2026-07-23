import { getAdminOrRedirect } from "@/app/(app)/services/admin-api";
import { TitlePeopleSelector } from "@/components/profile/admin/title-people/title-people-selector";

export default async function TitlePeoplePage() {
  await getAdminOrRedirect();

  return (
    <div>
      <h1 className="mb-3 text-2xl">Title Poples</h1>
      <p>Update Actors, Directors, Characters</p>

      <div className="flex flex-col gap-3">
        <TitlePeopleSelector />
      </div>
    </div>
  );
}
