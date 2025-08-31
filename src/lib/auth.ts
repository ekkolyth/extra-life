import type { AuthOptions } from 'next-auth'

import TwitchProvider from 'next-auth/providers/twitch'

const admins = [
  {
    email: 'bsknuckles@gmail.com',
    provider: 'twitch'
  },
  {
    email: 'mike@mikekenway.com',
    provider: 'twitch'
  },
  {
    email: 'Lhornstein@yahoo.com',
    provider: 'twitch'
  },
  {
    email: 'hornbingle@gmail.com',
    provider: 'twitch'
  },
  {
    email: 'jade@kenway.me',
    provider: 'twitch'
  }
]

export const authConfig: AuthOptions = {
  session: {
    strategy: 'jwt'
  },
  providers: [
    TwitchProvider({
      clientId: String(process.env.TWITCH_CLIENT_ID),
      clientSecret: String(process.env.TWITCH_CLIENT_SECRET)
    })
  ],
  callbacks: {
    async signIn({ user, account }) {
      const validEmail = admins.find(admin => admin.email === user.email)
      const validProvider = admins.find(admin => admin.provider === account?.provider)

      if (validEmail && validProvider) return true
      return false
    }
  }
}
