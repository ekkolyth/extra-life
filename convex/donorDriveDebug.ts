import { query, mutation } from './_generated/server';
import { v } from 'convex/values';
import {
  statsValidator,
  donorValidator,
  donationValidator,
} from './donor_drive_validators';

export const list = query({
  handler: async (ctx) => {
    // Get the last 100 entries, ordered by timestamp descending
    const entries = await ctx.db
      .query('donorDriveDebug')
      .withIndex('by_timestamp')
      .order('desc')
      .take(100);

    return entries.reverse(); // Return in chronological order
  },
});

export const add = mutation({
  args: {
    stats: v.union(statsValidator, v.null()),
    topDonation: v.union(donationValidator, v.null()),
    topDonor: v.union(donorValidator, v.null()),
    latestDonations: v.union(v.array(donationValidator), v.null()),
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

      // If we have more than 100 entries, delete the oldest ones
      if (totalCount.length > 100) {
        const entriesToDelete = totalCount
          .sort(
            (a, b) =>
              new Date(a.timestamp).getTime() -
              new Date(b.timestamp).getTime()
          )
          .slice(0, totalCount.length - 100);

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
