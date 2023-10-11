import type { AuthOptions } from 'next-auth'

import { PrismaAdapter } from '@auth/prisma-adapter'
import TwitchProvider from 'next-auth/providers/twitch'
import { prisma } from './prisma'

const admins = [
  {
    email: 'bsknuckles@gmail.com',
    provider: 'twitch'
  },
  {
    email: 'mike@mikekenway.com',
    provider: 'twitch'
  }
]

export const authConfig: AuthOptions = {
  session: {
    strategy: 'jwt'
  },
  adapter: PrismaAdapter(prisma),
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
