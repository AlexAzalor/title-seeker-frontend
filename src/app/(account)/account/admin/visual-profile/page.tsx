import { auth } from "@/auth";
import { VisualProfileEditPage } from "@/components/profile/admin/visual-profile/visual-profile";
import { VisualProfileEditForm } from "@/components/profile/admin/visual-profile/visual-profile-edit-form";
import { backendURL } from "@/lib/constants";
import { getVisualProfile } from "@/orval_api/visual-profile/visual-profile";
import { redirect } from "next/navigation";

export default async function VisualProfilePage() {
  const session = await auth();
  if (session?.user.role !== "owner") {
    return redirect("/");
  }

  const { aPIGetVisualProfileForms } = getVisualProfile();
  const { data } = await aPIGetVisualProfileForms(
    { user_uuid: session.user.uuid },
    backendURL,
  );

  return (
    <div>
      <h1 className="mb-3 text-2xl">Visual Profile</h1>
      <p>Update fields of a categories and a criteria</p>

      <div
        key={data.impact.key}
        className="shadow-form-layout dark:shadow-dark-form-layout border-light-border dark:border-dark-border mb-4 rounded-[34px] border p-3"
      >
        <h2 className="mb-5 text-xl lg:mb-0">{data.impact.name_en}</h2>
        <VisualProfileEditForm type="criterion" criterion={data.impact} />
      </div>

      <div className="flex flex-col gap-3">
        <VisualProfileEditPage categories={data.categories} />
      </div>
    </div>
  );
}
