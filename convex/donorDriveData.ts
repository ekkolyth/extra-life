import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

export const get = query({
  args: { participantId: v.string() },
  handler: async (ctx, { participantId }) => {
    const data = await ctx.db
      .query('donorDriveData')
      .withIndex('by_participant', (q) => q.eq('participantId', participantId))
      .first();

    const donations = await ctx.db
      .query('donations')
      .withIndex('by_participant', (q) => q.eq('participantId', participantId))
      .order('desc')
      .take(10);

    const topDonor = await ctx.db
      .query('topDonor')
      .withIndex('by_participant', (q) => q.eq('participantId', participantId))
      .first();

    return {
      ...data,
      latestDonations: donations,
      topDonor,
    };
  },
});

// Get ALL donations for a participant (for donations page)
export const getAllDonations = query({
  args: { participantId: v.string() },
  handler: async (ctx, { participantId }) => {
    const donations = await ctx.db
      .query('donations')
      .withIndex('by_participant', (q) => q.eq('participantId', participantId))
      .order('desc')
      .collect();

    return donations;
  },
});

export const upsert = mutation({
  args: {
    participantId: v.string(),
    displayName: v.string(),
    avatarImageURL: v.string(),
    fundraisingGoal: v.number(),
    eventName: v.string(),
    streamIsEnabled: v.boolean(),
    streamingChannel: v.string(),
    streamingPlatform: v.string(),
    sumDonations: v.number(),
    sumPledges: v.number(),
    numDonations: v.number(),
    streamIsLive: v.boolean(),
  },
  handler: async (ctx, args) => {
    const { participantId, ...data } = args;

    const existing = await ctx.db
      .query('donorDriveData')
      .withIndex('by_participant', (q) => q.eq('participantId', participantId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, data);
    } else {
      await ctx.db.insert('donorDriveData', args);
    }
  },
});

export const upsertDonations = mutation({
  args: {
    participantId: v.string(),
    donations: v.array(
      v.object({
        donationID: v.string(),
        displayName: v.string(),
        amount: v.number(),
        message: v.optional(v.string()),
        avatarImageURL: v.optional(v.string()),
        createdDateUTC: v.string(),
      })
    ),
  },
  handler: async (ctx, { participantId, donations }) => {
    for (const donation of donations) {
      const existing = await ctx.db
        .query('donations')
        .withIndex('by_donation_id', (q) => q.eq('donationID', donation.donationID))
        .first();

      if (!existing) {
        await ctx.db.insert('donations', {
          participantId,
          ...donation,
        });
      }
    }
  },
});

export const upsertTopDonor = mutation({
  args: {
    participantId: v.string(),
    donorID: v.string(),
    displayName: v.optional(v.string()),
    avatarImageURL: v.string(),
    sumDonations: v.number(),
    numDonations: v.number(),
    modifiedDateUTC: v.string(),
  },
  handler: async (ctx, args) => {
    const { participantId, ...data } = args;

    const existing = await ctx.db
      .query('topDonor')
      .withIndex('by_participant', (q) => q.eq('participantId', participantId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, data);
    } else {
      await ctx.db.insert('topDonor', {
        participantId,
        ...data,
      });
    }
  },
});
