import { getAdminOrRedirect } from "@/app/(app)/services/admin-api";
import { GeneralAuditLog } from "@/components/audit-log/general-audit-log";
import { POSTER_URL } from "@/lib/constants";

export default async function AuditLogPage() {
  await getAdminOrRedirect();

  return <GeneralAuditLog posterURL={POSTER_URL ?? ""} />;
}
