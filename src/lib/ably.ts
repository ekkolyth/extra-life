import * as Ably from 'ably';

const globalForAbly = global as unknown as { ably: Ably.Types.RealtimePromise };

export const ably =
  globalForAbly.ably ||
  (process.env.NEXT_PUBLIC_ABLY_KEY
    ? new Ably.Realtime.Promise({
        key: process.env.NEXT_PUBLIC_ABLY_KEY,
        clientId: 'extralife-dash',
      })
    : null);

if (process.env.NODE_ENV !== 'production') globalForAbly.ably = ably;
