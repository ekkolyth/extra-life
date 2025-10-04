import { defineTable } from 'convex/server';
import { v } from 'convex/values';

export const topDonor = defineTable({
  participantId: v.string(),
  donorID: v.string(),
  displayName: v.optional(v.string()),
  avatarImageURL: v.string(),
  sumDonations: v.number(),
  numDonations: v.number(),
  modifiedDateUTC: v.string(),
}).index('by_participant', ['participantId']);
