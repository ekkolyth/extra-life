import { api } from '@/convex/_generated/api';
import { useMutation, useQuery } from 'convex/react';

// Define types for Donor Drive API responses
export interface Donation {
  amount: number;
  avatarImageURL?: string;
  createdDateUTC?: string;
  donationID?: string;
  displayName?: string;
  donorID?: string;
  eventID?: number;
  isRegFee?: boolean;
  message?: string;
  modifiedDateUTC?: string;
  participantID?: number;
  recipientImageURL?: string;
  recipientName?: string;
  teamID?: number;
}

export interface Donor {
  displayName?: string;
  donorID?: string;
  avatarImageURL: string;
  modifiedDateUTC: string;
  sumDonations: number;
  numDonations: number;
  recipientImageURL?: string;
}

export interface StatsResult {
  displayName: string;
  avatarImageURL: string;
  participantID: number;
  participantTypeCode: string;
  createdDateUTC: string;
  isCustomAvatarImage: boolean;
  eventID: number;
  eventName: string;
  fundraisingGoal: number;
  links: {
    donate: string;
    page: string;
    stream: string;
  };
  streamIsEnabled: boolean;
  streamingChannel: string;
  streamingPlatform: string;
  teamID?: number;
  teamName?: string;
  isTeamCaptain?: boolean;
  isTeamCoCaptain?: boolean;
  role?: string;
  hasActivityTracking: boolean;
  numIncentives: number;
  numMilestones: number;
  sumDonations: number;
  sumPledges: number;
  numDonations: number;
  streamIsLive: boolean;
}

// Static Data Types
export type StaticData = {
  // Participant info
  displayName: string;
  avatarImageURL: string;
  participantID: number;
  participantTypeCode: string;
  createdDateUTC: string;
  isCustomAvatarImage: boolean;

  // Event info
  eventID: number;
  eventName: string;
  fundraisingGoal: number;

  // Links and settings
  links: {
    donate: string;
    page: string;
    stream: string;
  };

  // Stream settings
  streamIsEnabled: boolean;
  streamingChannel: string;
  streamingPlatform: string;

  // Team info
  teamID?: number;
  teamName?: string;
  isTeamCaptain?: boolean;
  isTeamCoCaptain?: boolean;
  role?: string;

  // Activity settings
  hasActivityTracking: boolean;

  // Static counts
  numIncentives: number;
  numMilestones: number;
};

// Real-time Data Types
export type RealTimeData = {
  // Current totals
  sumDonations: number;
  sumPledges: number;
  numDonations: number;

  // Stream status (can change frequently)
  streamIsLive: boolean;

  // Latest donations
  latestDonations: Array<{
    amount: number;
    avatarImageURL?: string;
    createdDateUTC?: string;
    donationID?: string;
    displayName?: string;
    donorID?: string;
    eventID?: number;
    isRegFee?: boolean;
    message?: string;
    modifiedDateUTC?: string;
    participantID?: number;
    recipientImageURL?: string;
    recipientName?: string;
    teamID?: number;
  }>;

  // Top donor
  topDonor: {
    displayName?: string;
    donorID?: string;
    avatarImageURL: string;
    modifiedDateUTC: string;
    sumDonations: number;
    numDonations: number;
    recipientImageURL?: string;
  } | null;
};

// Debug mutation hook
export function useDonorDriveDebug() {
  return useMutation(api.donorDriveDebug.add);
}

// Hook to get last API call info from Convex
export function useLastApiCallInfo() {
  return useQuery(api.apiMetadata.getLastApiCall);
}

// Hook to update last API call timestamp in Convex
export function useUpdateLastApiCall() {
  return useMutation(api.apiMetadata.updateLastApiCall);
}

// Fetch participant data from our API route
export async function fetchParticipantData(
  participantId: string,
  updateApiTimestamp?: () => Promise<unknown>,
  debugMutation?: (args: {
    stats: {
      avatarImageURL: string;
      createdDateUTC: string;
      displayName: string;
      eventID: number;
      eventName: string;
      fundraisingGoal: number;
      hasActivityTracking: boolean;
      isCustomAvatarImage: boolean;
      isTeamCaptain?: boolean;
      isTeamCoCaptain?: boolean;
      links: {
        donate: string;
        page: string;
        stream: string;
      };
      numDonations: number;
      numIncentives: number;
      numMilestones: number;
      participantID: number;
      participantTypeCode: string;
      role?: string;
      streamIsEnabled: boolean;
      streamIsLive: boolean;
      streamingChannel: string;
      streamingPlatform: string;
      sumDonations: number;
      sumPledges: number;
      teamID?: number;
      teamName?: string;
    } | null;
    topDonation: {
      amount: number;
      avatarImageURL?: string;
      createdDateUTC?: string;
      donationID?: string;
      eventID?: number;
      isRegFee?: boolean;
      links?: {
        donate?: string;
        recipient: string;
      };
      participantID?: number;
      recipientImageURL?: string;
      recipientName?: string;
      displayName?: string;
      donorID?: string;
      donorIsRecipient?: boolean;
      message?: string | null;
      teamID?: number;
    } | null;
    topDonor: {
      displayName?: string;
      donorID?: string;
      avatarImageURL: string;
      modifiedDateUTC: string;
      sumDonations: number;
      numDonations: number;
      recipientImageURL?: string;
    } | null;
    latestDonations: Array<{
      amount: number;
      avatarImageURL?: string;
      createdDateUTC?: string;
      donationID?: string;
      eventID?: number;
      isRegFee?: boolean;
      links?: {
        donate?: string;
        recipient: string;
      };
      participantID?: number;
      recipientImageURL?: string;
      recipientName?: string;
      displayName?: string;
      donorID?: string;
      donorIsRecipient?: boolean;
      message?: string | null;
      teamID?: number;
    }> | null;
    apiEndpoint: string;
  }) => Promise<unknown>
): Promise<StaticData | 'Rate limited' | 'Using cached data'> {
  console.log('🔄 Fetching participant data for:', participantId);

  try {
    // Update timestamp on any API call
    if (updateApiTimestamp) {
      try {
        await updateApiTimestamp();
      } catch (error) {
        console.error('Failed to update API timestamp:', error);
      }
    }

    console.log(
      '🔍 About to fetch participant data from:',
      `/api/donor-drive/participant?id=${participantId}`
    );

    // Simple fetch - no complex caching
    const response = await fetch(`/api/donor-drive/participant?id=${participantId}`);

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const result = await response.json();

    // Debug: Log the actual API response structure
    console.log('🔍 Full API response structure:', JSON.stringify(result, null, 2));
    console.log('🔍 Key fields we need:', {
      sumDonations: result.sumDonations,
      numDonations: result.numDonations,
      fundraisingGoal: result.fundraisingGoal,
      displayName: result.displayName,
    });

    // Extract static data from the full response
    const staticData: StaticData = {
      displayName: result.displayName,
      avatarImageURL: result.avatarImageURL,
      participantID: result.participantID,
      participantTypeCode: result.participantTypeCode,
      createdDateUTC: result.createdDateUTC,
      isCustomAvatarImage: result.isCustomAvatarImage,
      eventID: result.eventID,
      eventName: result.eventName,
      fundraisingGoal: result.fundraisingGoal,
      links: result.links,
      streamIsEnabled: result.streamIsEnabled,
      streamingChannel: result.streamingChannel,
      streamingPlatform: result.streamingPlatform,
      teamID: result.teamID,
      teamName: result.teamName,
      isTeamCaptain: result.isTeamCaptain,
      isTeamCoCaptain: result.isTeamCoCaptain,
      role: result.role,
      hasActivityTracking: result.hasActivityTracking,
      numIncentives: result.numIncentives,
      numMilestones: result.numMilestones,
    };

    // Log to debug
    if (debugMutation) {
      try {
        await debugMutation({
          stats: result,
          topDonation: null,
          topDonor: null,
          latestDonations: null,
          apiEndpoint: `GET /api/donor-drive/participant?id=${participantId}`,
        });
      } catch (debugError) {
        console.error('Failed to log participant data to debug:', debugError);
      }
    }

    console.log('✅ Participant data fetched successfully');
    console.log('🔍 Returning staticData:', JSON.stringify(staticData, null, 2));
    return staticData;
  } catch (error) {
    console.error('❌ Error fetching participant data:', error);
    console.error('❌ Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw error;
  }
}

// Fetch real-time data (donations and top donor)
export async function fetchRealTimeData(
  participantId: string,
  debugMutation?: (args: {
    stats: {
      avatarImageURL: string;
      createdDateUTC: string;
      displayName: string;
      eventID: number;
      eventName: string;
      fundraisingGoal: number;
      hasActivityTracking: boolean;
      isCustomAvatarImage: boolean;
      isTeamCaptain?: boolean;
      isTeamCoCaptain?: boolean;
      links: {
        donate: string;
        page: string;
        stream: string;
      };
      numDonations: number;
      numIncentives: number;
      numMilestones: number;
      participantID: number;
      participantTypeCode: string;
      role?: string;
      streamIsEnabled: boolean;
      streamIsLive: boolean;
      streamingChannel: string;
      streamingPlatform: string;
      sumDonations: number;
      sumPledges: number;
      teamID?: number;
      teamName?: string;
    } | null;
    topDonation: {
      amount: number;
      avatarImageURL?: string;
      createdDateUTC?: string;
      donationID?: string;
      eventID?: number;
      isRegFee?: boolean;
      links?: {
        donate?: string;
        recipient: string;
      };
      participantID?: number;
      recipientImageURL?: string;
      recipientName?: string;
      displayName?: string;
      donorID?: string;
      donorIsRecipient?: boolean;
      message?: string | null;
      teamID?: number;
    } | null;
    topDonor: {
      displayName?: string;
      donorID?: string;
      avatarImageURL: string;
      modifiedDateUTC: string;
      sumDonations: number;
      numDonations: number;
      recipientImageURL?: string;
    } | null;
    latestDonations: Array<{
      amount: number;
      avatarImageURL?: string;
      createdDateUTC?: string;
      donationID?: string;
      eventID?: number;
      isRegFee?: boolean;
      links?: {
        donate?: string;
        recipient: string;
      };
      participantID?: number;
      recipientImageURL?: string;
      recipientName?: string;
      displayName?: string;
      donorID?: string;
      donorIsRecipient?: boolean;
      message?: string | null;
      teamID?: number;
    }> | null;
    apiEndpoint: string;
  }) => Promise<unknown>,
  updateApiTimestamp?: () => Promise<unknown>,
  lastApiCallInfo?: { timestamp: number; secondsAgo: number }
): Promise<RealTimeData | 'Rate limited' | 'Using cached data'> {
  console.log('🔄 Fetching real-time data for participant:', participantId);

  // Check if we should actually make API calls
  const shouldFetch = lastApiCallInfo ? lastApiCallInfo.secondsAgo > 15 : true;

  if (!shouldFetch) {
    console.log('⏰ Using cached data - API called recently');
    return 'Using cached data';
  }

  try {
    // Update timestamp on any API call
    if (updateApiTimestamp) {
      try {
        await updateApiTimestamp();
      } catch (error) {
        console.error('Failed to update API timestamp:', error);
      }
    }

    // Fetch latest donations
    console.log(
      '🔍 About to fetch donations from:',
      `/api/donor-drive/donations?id=${participantId}&limit=10&orderBy=createdDateUTC%20DESC`
    );
    const donationsResponse = await fetch(
      `/api/donor-drive/donations?id=${participantId}&limit=10&orderBy=createdDateUTC%20DESC`
    );

    // Fetch top donor
    console.log(
      '🔍 About to fetch donors from:',
      `/api/donor-drive/donors?id=${participantId}&limit=1&orderBy=sumDonations%20DESC&where=sumDonations%20%3E%200`
    );
    const topDonorResponse = await fetch(
      `/api/donor-drive/donors?id=${participantId}&limit=1&orderBy=sumDonations%20DESC&where=sumDonations%20%3E%200`
    );

    console.log('🔍 Donations API response status:', donationsResponse.status);
    console.log('🔍 Top donor API response status:', topDonorResponse.status);

    // Handle rate limiting
    if (donationsResponse.status === 429 || topDonorResponse.status === 429) {
      console.log('Rate limited by our API');
      return 'Rate limited';
    }

    // Handle 304 responses (not modified)
    if (donationsResponse.status === 304 || topDonorResponse.status === 304) {
      console.log('Data not modified - using cached data');
      return 'Using cached data';
    }

    // Parse responses
    const latestDonations = donationsResponse.ok ? await donationsResponse.json() : [];
    const topDonor = topDonorResponse.ok ? await topDonorResponse.json() : null;

    // Fetch current participant data to get totals
    const participantResponse = await fetch(`/api/donor-drive/participant?id=${participantId}`);
    const participantData = participantResponse.ok ? await participantResponse.json() : null;

    // Debug: Log the participant data structure
    console.log(
      '🔍 Participant data for real-time totals:',
      JSON.stringify(participantData, null, 2)
    );
    console.log('🔍 Extracted real-time values:', {
      sumDonations: participantData?.sumDonations,
      numDonations: participantData?.numDonations,
      streamIsLive: participantData?.streamIsLive,
    });

    // Build real-time data response
    const realTimeData: RealTimeData = {
      sumDonations: participantData?.sumDonations || 0,
      sumPledges: participantData?.sumPledges || 0,
      numDonations: participantData?.numDonations || 0,
      streamIsLive: participantData?.streamIsLive || false,
      latestDonations: Array.isArray(latestDonations) ? latestDonations : [],
      topDonor: topDonor,
    };

    // Log successful calls to debug
    if (debugMutation) {
      try {
        if (Array.isArray(latestDonations) && latestDonations.length > 0) {
          await debugMutation({
            stats: null,
            topDonation: null,
            topDonor: null,
            latestDonations: latestDonations,
            apiEndpoint: `GET /api/donor-drive/donations?id=${participantId}&limit=10`,
          });
        }

        if (topDonor) {
          await debugMutation({
            stats: null,
            topDonation: null,
            topDonor: topDonor,
            latestDonations: null,
            apiEndpoint: `GET /api/donor-drive/donors?id=${participantId}&limit=1`,
          });
        }
      } catch (debugError) {
        console.error('Failed to log real-time data to debug:', debugError);
      }
    }

    console.log('✅ Real-time data fetched successfully');
    console.log('🔍 Returning realTimeData:', JSON.stringify(realTimeData, null, 2));
    return realTimeData;
  } catch (error) {
    console.error('❌ Error fetching real-time data:', error);
    console.error('❌ Real-time error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw error;
  }
}

// Fetch wheel spin donations
export async function fetchWheelSpinDonations(
  participantId: string
): Promise<Donation[] | 'Rate limited' | 'Using cached data'> {
  try {
    const response = await fetch(
      `/api/donor-drive/donations?id=${participantId}&filter=wheel-spins`
    );

    if (response.status === 429) {
      return 'Rate limited';
    }

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching wheel spin donations:', error);
    throw error;
  }
}

// Fetch big wheel spin donations
export async function fetchBigWheelSpinDonations(
  participantId: string
): Promise<Donation[] | 'Rate limited' | 'Using cached data'> {
  try {
    const response = await fetch(
      `/api/donor-drive/donations?id=${participantId}&filter=big-wheel-spins`
    );

    if (response.status === 429) {
      return 'Rate limited';
    }

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching big wheel spin donations:', error);
    throw error;
  }
}

// Legacy function compatibility - fetch stats (participant data)
export async function fetchStats(
  participantId: string
): Promise<StatsResult | 'Rate limited' | 'Using cached data'> {
  try {
    const response = await fetch(`/api/donor-drive/participant?id=${participantId}`);

    if (response.status === 429) {
      return 'Rate limited';
    }

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching stats:', error);
    throw error;
  }
}

// Legacy function compatibility - fetch top donor
export async function fetchTopDonor(
  participantId: string
): Promise<Donor | 'Rate limited' | 'Using cached data'> {
  try {
    const response = await fetch(
      `/api/donor-drive/donors?id=${participantId}&limit=1&orderBy=sumDonations%20DESC&where=sumDonations%20%3E%200`
    );

    if (response.status === 429) {
      return 'Rate limited';
    }

    if (response.status === 304) {
      console.log('Data not modified - using cached data');
      return 'Using cached data';
    }

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    return data; // API already returns single donor
  } catch (error) {
    console.error('Error fetching top donor:', error);
    throw error;
  }
}

// Legacy function compatibility - fetch latest donations
export async function fetchLatestDonations(
  participantId: string,
  limit: number
): Promise<Donation[] | 'Rate limited' | 'Using cached data'> {
  try {
    const response = await fetch(
      `/api/donor-drive/donations?id=${participantId}&limit=${limit}&orderBy=createdDateUTC%20DESC`
    );

    if (response.status === 429) {
      return 'Rate limited';
    }

    if (response.status === 304) {
      console.log('Data not modified - using cached data');
      return 'Using cached data';
    }

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching latest donations:', error);
    throw error;
  }
}

// Legacy function compatibility - fetch top donation
export async function fetchTopDonation(
  participantId: string
): Promise<Donation | 'Rate limited' | 'Using cached data' | null> {
  try {
    const response = await fetch(
      `/api/donor-drive/donations?id=${participantId}&limit=1&orderBy=amount%20DESC`
    );

    if (response.status === 429) {
      return 'Rate limited';
    }

    if (response.status === 304) {
      console.log('Data not modified - using cached data');
      return 'Using cached data';
    }

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    return Array.isArray(data) && data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error('Error fetching top donation:', error);
    throw error;
  }
}

// Utility functions
export const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export const percentage = (donations: number, goal: number) => Math.floor((donations / goal) * 100);
