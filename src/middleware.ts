import { auth } from "@/lib/auth";
import { PRIVATE_ROUTES } from "./lib/routes";

export default auth((req) => {
  const path = req.nextUrl.pathname;
  const isPrivateRoute = PRIVATE_ROUTES.some((route) =>
    path.startsWith(`/${route}`)
  );

  // Allow access to private routes only if user is authenticated
  if (isPrivateRoute && !req.auth) {
    return Response.redirect(new URL("/", req.url));
  }

  // Allow access to public routes
  return null;
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
};
