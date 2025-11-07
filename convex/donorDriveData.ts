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
      .collect();
    
    // Sort by createdDateUTC descending (most recent first)
    const sortedDonations = donations.sort((a, b) => 
      new Date(b.createdDateUTC).getTime() - new Date(a.createdDateUTC).getTime()
    );
    
    // Take the 10 most recent
    const latestDonations = sortedDonations.slice(0, 10);

    const topDonor = await ctx.db
      .query('topDonor')
      .withIndex('by_participant', (q) => q.eq('participantId', participantId))
      .first();

    return {
      ...data,
      latestDonations,
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
      .collect();

    console.log(`📊 getAllDonations: Found ${donations.length} donations in database for participant ${participantId}`);
    donations.forEach((d, i) => {
      console.log(`  ${i + 1}. ID=${d.donationID}, Amount=$${d.amount}, Date=${d.createdDateUTC}`);
    });

    // Sort by createdDateUTC descending (most recent first)
    const sorted = donations.sort((a, b) => 
      new Date(b.createdDateUTC).getTime() - new Date(a.createdDateUTC).getTime()
    );
    
    console.log(`📊 Returning ${sorted.length} sorted donations`);
    return sorted;
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
    const lastUpdated = new Date().toISOString();

    const existing = await ctx.db
      .query('donorDriveData')
      .withIndex('by_participant', (q) => q.eq('participantId', participantId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { ...data, lastUpdated });
    } else {
      await ctx.db.insert('donorDriveData', { ...args, lastUpdated });
    }
  },
});

export const upsertDonations = mutation({
  args: {
    participantId: v.string(),
    donations: v.array(
      v.object({
        donationID: v.string(),
        displayName: v.optional(v.string()),
        amount: v.number(),
        message: v.optional(v.string()),
        avatarImageURL: v.optional(v.string()),
        createdDateUTC: v.string(),
      })
    ),
  },
  handler: async (ctx, { participantId, donations }) => {
    console.log(`📥 upsertDonations called with ${donations.length} donations`);
    let inserted = 0;
    let skipped = 0;
    
    for (const donation of donations) {
      const existing = await ctx.db
        .query('donations')
        .withIndex('by_donation_id', (q) => q.eq('donationID', donation.donationID))
        .first();

      if (!existing) {
        await ctx.db.insert('donations', {
          participantId,
          donationID: donation.donationID,
          displayName: donation.displayName,
          amount: donation.amount,
          message: donation.message,
          avatarImageURL: donation.avatarImageURL,
          createdDateUTC: donation.createdDateUTC,
        });
        inserted++;
        console.log(`✅ Inserted new donation: ${donation.donationID} - $${donation.amount} from ${donation.displayName || 'Anonymous'}`);
      } else {
        skipped++;
        console.log(`⏭️ Skipped existing donation: ${donation.donationID}`);
      }
    }
    
    console.log(`📊 Summary: ${inserted} inserted, ${skipped} skipped`);
    return { inserted, skipped, total: donations.length };
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
