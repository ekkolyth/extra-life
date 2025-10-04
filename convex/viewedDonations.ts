import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

// Get viewed donations for the current user
export const getViewedDonations = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const record = await ctx.db
      .query('viewedDonations')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .first();

    return record?.donationIDs || [];
  },
});

// Mark donations as viewed
export const markAsViewed = mutation({
  args: {
    userId: v.string(),
    donationIDs: v.array(v.string()),
  },
  handler: async (ctx, { userId, donationIDs }) => {
    const existing = await ctx.db
      .query('viewedDonations')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .first();

    if (existing) {
      // Add new donation IDs to existing array (avoid duplicates)
      const currentIDs = new Set(existing.donationIDs);
      donationIDs.forEach((id) => currentIDs.add(id));

      await ctx.db.patch(existing._id, {
        donationIDs: Array.from(currentIDs),
      });
    } else {
      // Create new record
      await ctx.db.insert('viewedDonations', {
        userId,
        donationIDs,
      });
    }
  },
});

// Mark donations as unviewed
export const markAsUnviewed = mutation({
  args: {
    userId: v.string(),
    donationIDs: v.array(v.string()),
  },
  handler: async (ctx, { userId, donationIDs }) => {
    const existing = await ctx.db
      .query('viewedDonations')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .first();

    if (existing) {
      // Remove donation IDs from array
      const idsToRemove = new Set(donationIDs);
      const updatedIDs = existing.donationIDs.filter((id) => !idsToRemove.has(id));

      await ctx.db.patch(existing._id, {
        donationIDs: updatedIDs,
      });
    }
  },
});

