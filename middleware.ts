import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ["/other"],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
