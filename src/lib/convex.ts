import { ConvexHttpClient } from 'convex/browser'

const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL || 'http://localhost')

function query(name: string, args: any = {}) {
  return client.query(name as any, args)
}

function mutation(name: string, args: any = {}) {
  return client.mutation(name as any, args)
}

export const db = {
  goal: {
    findMany: (args?: any) => query('goals:list', args),
    create: ({ data }: { data: any }) => mutation('goals:create', data),
    update: ({ where, data }: { where: { id: string }; data: any }) =>
      mutation('goals:update', { id: where.id, ...data }),
    delete: ({ where }: { where: { id: string } }) =>
      mutation('goals:delete', { id: where.id })
  },
  rotator: {
    deleteMany: () => mutation('rotator:clear'),
    createMany: ({ data }: { data: any[] }) => mutation('rotator:addMany', data),
    findMany: () => query('rotator:list')
  },
  segment: {
    findMany: () => query('segment:list'),
    create: ({ data }: { data: any }) => mutation('segment:create', data),
    delete: ({ where }: { where: { id: string } }) =>
      mutation('segment:delete', { id: where.id })
  },
  randomizer: {
    findMany: (args?: any) => query('randomizer:list', args),
    create: ({ data }: { data: any }) => mutation('randomizer:create', data),
    update: ({ where, data }: { where: { id: string }; data: any }) =>
      mutation('randomizer:update', { id: where.id, ...data }),
    delete: ({ where }: { where: { id: string } }) =>
      mutation('randomizer:delete', { id: where.id })
  },
  randomizerItem: {
    update: ({ where, data }: { where: { id: string }; data: any }) =>
      mutation('randomizerItem:update', { id: where.id, ...data })
  },
  wheelRedemption: {
    findMany: ({ where }: { where: { randomizerId: string }; orderBy?: any }) =>
      query('wheelRedemption:list', { randomizerId: where.randomizerId }),
    deleteMany: ({ where }: { where: { randomizerId: string } }) =>
      mutation('wheelRedemption:clear', { randomizerId: where.randomizerId }),
    create: ({ data }: { data: any }) => mutation('wheelRedemption:create', data)
  }
}

export type { ConvexHttpClient }
