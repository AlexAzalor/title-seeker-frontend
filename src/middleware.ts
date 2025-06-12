import { auth } from "@/auth";
import { UserRole } from "./orval_api/model";
import { NextResponse } from "next/server";

export const ADMINS_ROLES: UserRole[] = [UserRole.admin, UserRole.owner];
export const ALL_ROLES: UserRole[] = [...ADMINS_ROLES, UserRole.user];

export const checkIfAdmin = (role?: UserRole) => {
  if (!role) return false;
  return ADMINS_ROLES.includes(role);
};
export const checkIfOwner = (role?: UserRole) => role === UserRole.owner;

export default auth((req) => {
  const pathname = req.nextUrl.pathname;
  const newUrl = new URL("/", req.nextUrl.origin);

  // If the user is not authenticated, redirect to the home page
  const isPrivateRoute = pathname.startsWith("/account");
  if (!req.auth && isPrivateRoute) {
    return NextResponse.redirect(newUrl);
  }

  const isAdmin = checkIfAdmin(req.auth?.user.role);
  const isAdminRoute = pathname.startsWith("/account/admin");
  const isOwnerRoute = pathname.startsWith("/owner");

  if (!isAdmin && (isAdminRoute || isOwnerRoute)) {
    return NextResponse.redirect(newUrl);
  }

  // Redirects from unused paths to the valid ones
  // Need to fix?
  if (
    pathname === "/account" ||
    pathname === "/account/user" ||
    pathname === "/account/admin"
  ) {
    return NextResponse.redirect(newUrl + "account/user/profile");
  }

  if (pathname === "/owner") {
    return NextResponse.redirect(newUrl + "owner/add-movie");
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
