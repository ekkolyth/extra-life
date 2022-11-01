import { createRouter } from './context'

export const wheelSpinRouter = createRouter()
  .mutation('spin', {
    async resolve({ ctx }) {
      const spin = await ctx.prisma.wheelSpin.create({
        data: {
          isSpun: true
        }
      })
      return await ctx.prisma.wheelSpin.count()
    }
  })
  .mutation('popOne', {
    async resolve({ ctx }) {
      const spin = await ctx.prisma.wheelSpin.findFirst()
      if (spin) {
        await ctx.prisma.wheelSpin.delete({
          where: {
            id: spin.id
          }
        })
      }
      return await ctx.prisma.wheelSpin.count()
    }
  })
  .query('getAll', {
    async resolve({ ctx }) {
      return await ctx.prisma.wheelSpin.count()
    }
  })
