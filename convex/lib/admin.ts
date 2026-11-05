import type { ActionCtx, MutationCtx, QueryCtx } from '../_generated/server'

export const ADMIN_USERNAME = 'ekko'
const ADMIN_PROVIDER = 'custom_ekkoos'

// Clerk's frontend reports `custom_ekkoos`, its backend `oauth_custom_ekkoos`
function isAdminAccount(account: {
    provider: string
    username?: string | null
}): boolean {
    return (
        account.provider.replace(/^oauth_/, '') === ADMIN_PROVIDER &&
        account.username === ADMIN_USERNAME
    )
}

// admins sign in through EkkoOS, which leaves Clerk's own username empty on some instances
export function isAdminUser(
    user:
        | {
              username: string | null
              externalAccounts: { provider: string; username?: string | null }[]
          }
        | null
        | undefined
): boolean {
    if (!user) return false
    return (
        user.username === ADMIN_USERNAME ||
        user.externalAccounts.some(isAdminAccount)
    )
}

export async function requireSignedIn(
    ctx: QueryCtx | MutationCtx | ActionCtx
): Promise<void> {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
        throw new Error('Unauthorized: sign-in required')
    }
}
