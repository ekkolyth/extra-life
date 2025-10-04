import { defineTable } from 'convex/server';
import { v } from 'convex/values';

export const viewedDonations = defineTable({
  userId: v.string(),
  donationIDs: v.array(v.string()),
}).index('by_user', ['userId']);
