import { defineSchema } from 'convex/server'
import { apiMetadata } from './schema/apiMetadata'
import { donations } from './schema/donations'
import { donorDriveData } from './schema/donorDriveData'
import { donorDriveDebug } from './schema/donorDriveDebug'
import { goals } from './schema/goals'
import { randomizerItems, randomizers } from './schema/randomizer'
import { rotator } from './schema/rotator'
import { segments } from './schema/segments'
import { topDonor } from './schema/topDonor'
import { viewedDonations } from './schema/viewedDonations'
import { wheelRedemptions } from './schema/wheelRedemptions'

export default defineSchema({
    topDonor,
    goals,
    segments,
    rotator,
    randomizers,
    randomizerItems,
    wheelRedemptions,
    donorDriveDebug,
    apiMetadata,
    donorDriveData,
    donations,
    viewedDonations,
})
