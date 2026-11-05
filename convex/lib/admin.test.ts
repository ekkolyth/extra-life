import { describe, expect, test } from 'bun:test'
import { isAdminUser } from './admin'

// shape of the dev-instance account: no Clerk username, signed in through EkkoOS
const ekkoosOnly = {
    username: null,
    externalAccounts: [
        { provider: 'oauth_custom_ekkoos', username: 'ekko' },
        { provider: 'oauth_discord', username: 'ekkolyth' },
    ],
}

describe('isAdminUser', () => {
    test('accepts the Clerk username', () => {
        expect(isAdminUser({ username: 'ekko', externalAccounts: [] })).toBe(
            true
        )
    })

    test('accepts the EkkoOS sign-in as the backend reports it', () => {
        expect(isAdminUser(ekkoosOnly)).toBe(true)
    })

    test('accepts the EkkoOS sign-in as the frontend reports it', () => {
        expect(
            isAdminUser({
                username: null,
                externalAccounts: [
                    { provider: 'custom_ekkoos', username: 'ekko' },
                ],
            })
        ).toBe(true)
    })

    test('rejects an ekko username from another provider', () => {
        expect(
            isAdminUser({
                username: null,
                externalAccounts: [{ provider: 'discord', username: 'ekko' }],
            })
        ).toBe(false)
    })

    test('rejects a different EkkoOS user', () => {
        expect(
            isAdminUser({
                username: null,
                externalAccounts: [
                    { provider: 'oauth_custom_ekkoos', username: 'someone' },
                ],
            })
        ).toBe(false)
    })

    test('rejects a signed-out user', () => {
        expect(isAdminUser(null)).toBe(false)
        expect(isAdminUser(undefined)).toBe(false)
    })
})
