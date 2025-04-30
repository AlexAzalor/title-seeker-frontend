// export { auth as middleware } from "@/auth";

import { auth } from "@/auth";

const ADMIN_ROUTES = [
  "/add-movie",
  "/quick-add-movie",
  "/user",
  "/user/dashboard",
];

export default auth((req) => {
  if (
    req.auth?.user.role !== "owner" &&
    ADMIN_ROUTES.includes(req.nextUrl.pathname)
  ) {
    const newUrl = new URL("/", req.nextUrl.origin);
    return Response.redirect(newUrl);
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
