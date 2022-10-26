import { createRouter } from './context'
import { z } from 'zod'

export const scheduleRouter = createRouter()
  .mutation('new', {
    input: z.object({
      now: z.string(),
      next: z.string()
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.schedule.create({
        data: {
          now: input.now,
          next: input.next
        }
      })
    }
  })
  .mutation('update', {
    input: z.object({
      id: z.string(),
      now: z.string(),
      next: z.string()
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.schedule.update({
        where: {
          id: input.id
        },
        data: {
          now: input.now,
          next: input.next
        }
      })
    }
  })
  .query('get', {
    async resolve({ ctx }) {
      return await ctx.prisma.schedule.findFirst()
    }
  })
