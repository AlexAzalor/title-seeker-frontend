import { getLocale, getTranslations } from "next-intl/server";
import { backendURL } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { Language } from "@/orval_api/model";
import { getUsers } from "@/orval_api/users/users";
import { getAdminOrRedirect } from "@/app/(app)/services/admin-api";

export default async function AllUsersPage() {
  const admin = await getAdminOrRedirect();

  const t = await getTranslations("AllUsers");
  const locale = (await getLocale()) as Language;

  const { aPIGetAllUsers } = getUsers();
  const { data: users } = await aPIGetAllUsers(
    { user_uuid: admin.uuid },
    backendURL,
  );

  return (
    <div>
      <h1 className="mb-3 text-2xl">{t("title")}</h1>

      <div className="flex flex-col gap-2 sm:flex-wrap md:flex-row">
        {users.users.map((user) => (
          <div
            key={user.uuid}
            className="shadow-form-layout dark:shadow-dark-form-layout dark:border-dark-border border-light-border mb-2 w-fit rounded-2xl border p-3"
          >
            <h2 className="text-xl">{user.full_name}</h2>
            <p>Email: {user.email}</p>
            <p>Role: {user.role}</p>
            <p>UUID: {user.uuid}</p>
            <p>Created At: {formatDate(user.created_at, locale)}</p>
            <p>
              Ratings count:{" "}
              <span className="font-bold">{user.ratings_count}</span>
            </p>
            {user.last_movie_rate_date && (
              <p>
                Last rate date:{" "}
                <span className="font-bold">
                  {formatDate(user.last_movie_rate_date, locale)}
                </span>
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
