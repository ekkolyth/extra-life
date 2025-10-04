import { defineSchema } from 'convex/server';

import { topDonor } from './schema/topDonor';
import { goals } from './schema/goals';
import { segments } from './schema/segments';
import { rotator } from './schema/rotator';
import { randomizers, randomizerItems } from './schema/randomizer';
import { wheelRedemptions } from './schema/wheelRedemptions';
import { donorDriveDebug } from './schema/donorDriveDebug';
import { apiMetadata } from './schema/apiMetadata';
import { donorDriveData } from './schema/donorDriveData';
import { donations } from './schema/donations';

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
});
