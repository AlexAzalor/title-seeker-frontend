import { auth } from "@/auth";
import { backendURL } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { Language } from "@/orval_api/model";
import { getUsers } from "@/orval_api/users/users";

export default async function AllUsersPage() {
  const session = await auth();
  if (session?.user.role !== "owner") {
    return null;
  }

  const { aPIGetAllUsers } = getUsers();
  const { data: users } = await aPIGetAllUsers(
    { user_uuid: session.user.uuid },
    backendURL,
  );

  return (
    <div>
      <h1 className="mb-3 text-2xl">All Users</h1>

      <div className="shadow-form-layout dark:shadow-dark-form-layout dark:border-dark-border border-light-border flex w-fit flex-wrap rounded-[24px] border p-3">
        {users.users.map((user) => (
          <div key={user.uuid} className="mb-2">
            <h2 className="text-xl">{user.full_name}</h2>
            <p>Email: {user.email}</p>
            <p>Role: {user.role}</p>
            <p>UUID: {user.uuid}</p>
            <p>Created At: {formatDate(user.created_at, Language.en)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
