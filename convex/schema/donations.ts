import { defineTable } from 'convex/server';
import { v } from 'convex/values';

export const donations = defineTable({
  participantId: v.string(),
  donationID: v.string(),
  displayName: v.optional(v.string()),
  amount: v.number(),
  message: v.optional(v.string()),
  avatarImageURL: v.optional(v.string()),
  createdDateUTC: v.string(),
})
  .index('by_participant', ['participantId'])
  .index('by_donation_id', ['donationID']);
