import { defineTable } from 'convex/server';
import { v } from 'convex/values';

export const donorDriveData = defineTable({
  participantId: v.string(),
  // Static participant data
  displayName: v.string(),
  avatarImageURL: v.string(),
  fundraisingGoal: v.number(),
  eventName: v.string(),
  streamIsEnabled: v.boolean(),
  streamingChannel: v.string(),
  streamingPlatform: v.string(),
  // Real-time data
  sumDonations: v.number(),
  sumPledges: v.number(),
  numDonations: v.number(),
  streamIsLive: v.boolean(),
  lastUpdated: v.string(),
}).index('by_participant', ['participantId']);
