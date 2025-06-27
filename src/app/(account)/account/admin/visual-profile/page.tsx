import { backendURL } from "@/lib/constants";
import { VisualProfileEditPage } from "@/components/profile/admin/visual-profile/visual-profile";
import { VisualProfileEditForm } from "@/components/profile/admin/visual-profile/visual-profile-edit-form";
import { getAdminOrRedirect } from "@/app/services/admin-api";
import { getVisualProfile } from "@/orval_api/visual-profile/visual-profile";

export default async function VisualProfilePage() {
  const admin = await getAdminOrRedirect();

  const { aPIGetVisualProfileForms } = getVisualProfile();
  const { data } = await aPIGetVisualProfileForms(
    { user_uuid: admin.uuid },
    backendURL,
  );

  return (
    <div>
      <h1 className="mb-3 text-2xl">Visual Profile</h1>
      <p>Update fields of a categories and a criteria</p>

      <div
        key={data.impact.key}
        className="shadow-form-layout dark:shadow-dark-form-layout border-light-border dark:border-dark-border mb-4 rounded-4xl border p-3"
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
