import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { newsletterSubscriptionInput, subscribeToNewsletter } from "./newsletter";
import { commerceRouter } from "./routers/commerce";

export const appRouter = router({
  system: systemRouter,
  commerce: commerceRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  newsletter: router({
    subscribe: publicProcedure.input(newsletterSubscriptionInput).mutation(async ({ input }) => {
      const subscriber = await subscribeToNewsletter(input);
      return { success: true, email: subscriber.email } as const;
    }),
  }),
});

export type AppRouter = typeof appRouter;
