import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';
import {
  statsValidator,
  donorValidator,
  donationValidator,
} from './donor_drive_validators';

export default defineSchema({
  goals: defineTable({
    title: v.string(),
    amount: v.number(),
    endOfStream: v.boolean(),
  }).index('by_title', ['title']),
  segments: defineTable({
    title: v.string(),
    startsAt: v.string(),
    duration: v.number(),
  }).index('by_title', ['title']),
  rotator: defineTable({
    text: v.string(),
  }).index('by_text', ['text']),
  randomizers: defineTable({
    name: v.string(),
  }).index('by_name', ['name']),
  randomizerItems: defineTable({
    name: v.string(),
    limit: v.number(),
    redeemed: v.number(),
    randomizerId: v.string(),
  }),
  wheelRedemptions: defineTable({
    randomizerId: v.string(),
    createdAt: v.string(),
  }),
  donorDriveDebug: defineTable({
    timestamp: v.string(),
    stats: v.union(statsValidator, v.null()),
    topDonation: v.union(donationValidator, v.null()),
    topDonor: v.union(donorValidator, v.null()),
    latestDonations: v.union(v.array(donationValidator), v.null()),
    apiEndpoint: v.string(),
  }).index('by_timestamp', ['timestamp']),
  apiMetadata: defineTable({
    key: v.string(), // 'lastApiCall', 'etagCache', etc.
    value: v.string(), // JSON string for flexibility
    updatedAt: v.string(),
  }).index('by_key', ['key']),
});
