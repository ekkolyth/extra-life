import { defineSchema } from 'convex/server'
import { apiMetadata } from './schema/apiMetadata'
import { campaigns } from './schema/campaigns'
import { donations } from './schema/donations'
import { donorDriveDebug } from './schema/donorDriveDebug'
import { donors } from './schema/donors'
import { goals } from './schema/goals'
import { randomizerItems, randomizers } from './schema/randomizer'
import { randomizerSpins } from './schema/randomizerSpins'
import { rotator } from './schema/rotator'
import { segments } from './schema/segments'
import { syncState } from './schema/syncState'
import { viewedDonations } from './schema/viewedDonations'
import { wheelRedemptions } from './schema/wheelRedemptions'

export default defineSchema({
    goals,
    segments,
    rotator,
    randomizers,
    randomizerItems,
    randomizerSpins,
    wheelRedemptions,
    donorDriveDebug,
    apiMetadata,
    campaigns,
    donations,
    donors,
    syncState,
    viewedDonations,
})
