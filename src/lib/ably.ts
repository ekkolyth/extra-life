import * as Ably from 'ably'

const globalForAbly = global as unknown as { ably: Ably.Types.RealtimePromise }

export const ably =
  globalForAbly.ably || new Ably.Realtime.Promise({ key: process.env.NEXT_PUBLIC_ABLY_KEY, clientId: 'extralife-dash' })

if (process.env.NODE_ENV !== 'production') globalForAbly.ably = ably
