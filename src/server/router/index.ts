// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { exampleRouter } from "./example";
import { scheduleRouter } from './schedule'
import { protectedExampleRouter } from './protected-example-router'

export const appRouter = createRouter()
  .transformer(superjson)
  .merge('schedule.', scheduleRouter)
  .merge('example.', exampleRouter)
  .merge('auth.', protectedExampleRouter)

// export type definition of API
export type AppRouter = typeof appRouter;
