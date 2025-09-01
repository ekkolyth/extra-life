import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

export const list = query({
  handler: async (ctx) => {
    // Get the last 10 entries, ordered by timestamp descending
    const entries = await ctx.db
      .query('donorDriveDebug')
      .withIndex('by_timestamp')
      .order('desc')
      .take(10);

    return entries.reverse(); // Return in chronological order
  },
});

export const add = mutation({
  args: {
    stats: v.any(),
    topDonation: v.any(),
    topDonor: v.any(),
    latestDonations: v.any(),
    apiEndpoint: v.string(),
  },
  handler: async (ctx, args) => {
    console.log('🔍 Convex add mutation called with args:', args);

    const timestamp = new Date().toISOString();
    console.log('⏰ Timestamp:', timestamp);

    try {
      // Insert new entry
      const id = await ctx.db.insert('donorDriveDebug', {
        timestamp,
        ...args,
      });
      console.log('✅ Debug entry inserted with ID:', id);

      // Get total count
      const totalCount = await ctx.db.query('donorDriveDebug').collect();
      console.log('📊 Total entries:', totalCount.length);

      // If we have more than 10 entries, delete the oldest ones
      if (totalCount.length > 10) {
        const entriesToDelete = totalCount
          .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
          .slice(0, totalCount.length - 10);

        console.log('🗑️ Deleting old entries:', entriesToDelete.length);
        for (const entry of entriesToDelete) {
          await ctx.db.delete(entry._id);
        }
        console.log('✅ Old entries deleted');
      }
    } catch (error) {
      console.error('❌ Error in add mutation:', error);
      throw error;
    }
  },
});

export const clear = mutation({
  handler: async (ctx) => {
    const entries = await ctx.db.query('donorDriveDebug').collect();
    for (const entry of entries) {
      await ctx.db.delete(entry._id);
    }
  },
});
