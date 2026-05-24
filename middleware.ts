import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Only the cloud API routes require auth — the app itself is fully usable as a guest
const isProtectedApi = createRouteMatcher([
  "/api/events(.*)",
  "/api/family(.*)",
  "/api/sync(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedApi(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Run on all routes except Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jte|cjs|mjs|svg|png|jpe?g|gif|webp|ico|woff2?|ttf|eot)$).*)",
    "/(api|trpc)(.*)",
  ],
};
