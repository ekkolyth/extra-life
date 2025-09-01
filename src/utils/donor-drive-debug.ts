import { api } from '@/convex/_generated/api';
import { useMutation } from 'convex/react';
import { fetchStats, fetchTopDonor, fetchTopDonation, fetchLatestDonations } from './donor-drive';

// Hook to get the debug mutation
export function useDonorDriveDebug() {
  return useMutation(api.donorDriveDebug.add);
}

// Wrapper functions that store debug data
export async function fetchStatsWithDebug(id: string, debugMutation: any) {
  try {
    console.log('🔍 fetchStatsWithDebug called with id:', id);
    const result = await fetchStats(id);
    console.log('📊 Stats result:', result);

    // Store debug data if we have a mutation function
    if (debugMutation && result !== 'Rate limited') {
      console.log('💾 Storing debug data for stats...');
      try {
        await debugMutation({
          stats: result,
          topDonation: null,
          topDonor: null,
          latestDonations: null,
          apiEndpoint: `GET /participants/${id}`,
        });
        console.log('✅ Debug data stored successfully for stats');
      } catch (debugError) {
        console.error('❌ Failed to store debug data:', debugError);
      }
    } else {
      console.log('⚠️ Skipping debug storage - no mutation or rate limited');
    }

    return result;
  } catch (error) {
    console.error('❌ Error fetching stats:', error);
    throw error;
  }
}

export async function fetchTopDonorWithDebug(id: string, debugMutation: any) {
  try {
    console.log('🔍 fetchTopDonorWithDebug called with id:', id);
    const result = await fetchTopDonor(id);
    console.log('👑 Top donor result:', result);

    // Store debug data if we have a mutation function
    if (debugMutation && result !== 'Rate limited') {
      console.log('💾 Storing debug data for top donor...');
      try {
        await debugMutation({
          stats: null,
          topDonation: null,
          topDonor: result,
          latestDonations: null,
          apiEndpoint: `GET /participants/${id}/donors`,
        });
        console.log('✅ Debug data stored successfully for top donor');
      } catch (debugError) {
        console.error('❌ Failed to store debug data:', debugError);
      }
    } else {
      console.log('⚠️ Skipping debug storage - no mutation or rate limited');
    }

    return result;
  } catch (error) {
    console.error('❌ Error fetching top donor:', error);
    throw error;
  }
}

export async function fetchTopDonationWithDebug(id: string, debugMutation: any) {
  try {
    console.log('🔍 fetchTopDonationWithDebug called with id:', id);
    const result = await fetchTopDonation(id);
    console.log('💰 Top donation result:', result);

    // Store debug data if we have a mutation function
    if (debugMutation && result !== 'Rate limited') {
      console.log('💾 Storing debug data for top donation...');
      try {
        await debugMutation({
          stats: null,
          topDonation: result,
          topDonor: null,
          latestDonations: null,
          apiEndpoint: `GET /participants/${id}/donations`,
        });
        console.log('✅ Debug data stored successfully for top donation');
      } catch (debugError) {
        console.error('❌ Failed to store debug data:', debugError);
      }
    } else {
      console.log('⚠️ Skipping debug storage - no mutation or rate limited');
    }

    return result;
  } catch (error) {
    console.error('❌ Error fetching top donation:', error);
    throw error;
  }
}

export async function fetchLatestDonationsWithDebug(id: string, limit: number, debugMutation: any) {
  try {
    console.log('🔍 fetchLatestDonationsWithDebug called with id:', id, 'limit:', limit);
    const result = await fetchLatestDonations(id, limit);
    console.log('🎁 Latest donations result:', result);

    // Store debug data if we have a mutation function
    if (debugMutation && result !== 'Rate limited') {
      console.log('💾 Storing debug data for latest donations...');
      try {
        await debugMutation({
          stats: null,
          topDonation: null,
          topDonor: null,
          latestDonations: result,
          apiEndpoint: `GET /participants/${id}/donations?limit=${limit}`,
        });
        console.log('✅ Debug data stored successfully for latest donations');
      } catch (debugError) {
        console.error('❌ Failed to store debug data:', debugError);
      }
    } else {
      console.log('⚠️ Skipping debug storage - no mutation or rate limited');
    }

    return result;
  } catch (error) {
    console.error('❌ Error fetching latest donations:', error);
    throw error;
  }
}
