import type { ActionCtx, MutationCtx, QueryCtx } from '../_generated/server'

export const ADMIN_USERNAME = 'ekko'

export async function requireAdmin(
    ctx: QueryCtx | MutationCtx | ActionCtx
): Promise<void> {
    const identity = await ctx.auth.getUserIdentity()
    if (identity?.nickname !== ADMIN_USERNAME) {
        throw new Error('Unauthorized: admin access required')
    }
}

export async function requireSignedIn(
    ctx: QueryCtx | MutationCtx | ActionCtx
): Promise<void> {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
        throw new Error('Unauthorized: sign-in required')
    }
}
