// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { scheduleRouter } from './schedule'
import { wheelSpinRouter } from './wheelSpins'
import { protectedExampleRouter } from './protected-example-router'

export const appRouter = createRouter()
  .transformer(superjson)
  .merge('schedule.', scheduleRouter)
  .merge('wheelSpins.', wheelSpinRouter)
  .merge('auth.', protectedExampleRouter)

// export type definition of API
export type AppRouter = typeof appRouter;
