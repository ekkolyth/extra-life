import { defineTable } from 'convex/server';
import { v } from 'convex/values';
import { statsValidator, donorValidator, donationValidator } from '../donor_drive_validators';

export const donorDriveDebug = defineTable({
  timestamp: v.string(),
  stats: v.union(statsValidator, v.null()),
  topDonation: v.union(donationValidator, v.null()),
  topDonor: v.union(donorValidator, v.null()),
  latestDonations: v.union(v.array(donationValidator), v.null()),
  apiEndpoint: v.string(),
}).index('by_timestamp', ['timestamp']);
