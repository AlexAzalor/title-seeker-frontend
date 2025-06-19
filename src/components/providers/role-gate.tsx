import { auth } from "@/auth";
import { GoogleLogin } from "@/components/layout/google-login";
import { UserRole } from "@/orval_api/model";
import type { Session } from "next-auth";

type Props = {
  allowedRoles?: UserRole[];
  children: (session: Session) => React.ReactElement;
  showLogin?: boolean;
};

export const RoleGate = async ({
  allowedRoles,
  children,
  showLogin,
}: Props) => {
  const session = await auth();

  if (!session && showLogin) {
    return <GoogleLogin />;
  }

  if (!session || !allowedRoles?.includes(session.user.role)) {
    return null;
  }

  return <>{children(session)}</>;
};
