import { auth } from "@/auth";
import { backendURL } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { Language } from "@/orval_api/model";
import { getUsers } from "@/orval_api/users/users";
import { getLocale, getTranslations } from "next-intl/server";

export default async function AllUsersPage() {
  const session = await auth();
  if (session?.user.role !== "owner") {
    return null;
  }

  const t = await getTranslations("AllUsers");
  const locale = (await getLocale()) as Language;

  const { aPIGetAllUsers } = getUsers();
  const { data: users } = await aPIGetAllUsers(
    { user_uuid: session.user.uuid },
    backendURL,
  );

  return (
    <div>
      <h1 className="mb-3 text-2xl">{t("title")}</h1>

      <div className="shadow-form-layout dark:shadow-dark-form-layout dark:border-dark-border border-light-border flex w-fit flex-wrap rounded-[24px] border p-3">
        {users.users.map((user) => (
          <div key={user.uuid} className="mb-2">
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
