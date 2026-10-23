import { getAdminOrRedirect } from "@/app/(app)/services/admin-api";
import { GeneralAuditLog } from "@/components/audit-log/general-audit-log";

export default async function AuditLogPage() {
  await getAdminOrRedirect();

  return <GeneralAuditLog />;
}
