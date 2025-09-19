import { api } from '@/convex/_generated/api';
import { useMutation, useQuery } from 'convex/react';

// Re-export types from the original file
export type { StatsResult, Donor, Donation } from './donor-drive';

// API Configuration
const BASE_URL = 'https://www.extra-life.org/api';
const API_VERSION = '1.3';
const FIFTEEN_SECONDS = 15 * 1000;

// Global state for ETag caching (timestamp now stored in Convex)
let etagCache = new Map<string, string>();

// Helper function to build versioned URLs
function withVersion(path: string): string {
  return `${BASE_URL}${path}${
    path.includes('?') ? '&' : '?'
  }version=${API_VERSION}`;
}

// Check if we should make a real-time API call (fallback for when Convex data isn't available)
export function shouldFetchRealTime(): boolean {
  // This is now a fallback - should use Convex data when available
  console.warn(
    'shouldFetchRealTime: Using fallback logic - consider using Convex data'
  );
  return true; // Always fetch if we don't have Convex timestamp info
}

// Enhanced fetch with ETag support
async function fetchWithETag<T>(
  key: string,
  url: string,
  updateApiTimestamp?: () => Promise<any>,
  debugMutation?: (args: any) => Promise<any>,
  apiEndpoint?: string
): Promise<T | 'Rate limited' | 'Not modified'> {
  const headers: HeadersInit = {};

  // Add If-None-Match header if we have an ETag
  const etag = etagCache.get(key);
  if (etag) {
    headers['If-None-Match'] = etag;
  }

  try {
    const response = await fetch(url, { headers });

    // Update timestamp on any API call
    if (updateApiTimestamp) {
      try {
        await updateApiTimestamp();
      } catch (error) {
        console.error('Failed to update API timestamp:', error);
      }
    }

    // Handle rate limiting
    if (response.status === 429) {
      console.log(`Rate limited. ${response.status}`);

      // Log to debug if we have the mutation
      if (debugMutation && apiEndpoint) {
        try {
          await debugMutation({
            stats: null,
            topDonation: null,
            topDonor: null,
            latestDonations: null,
            apiEndpoint: `${apiEndpoint} (Rate Limited)`,
          });
        } catch (debugError) {
          console.error('Failed to log rate limit to debug:', debugError);
        }
      }

      return 'Rate limited';
    }

    // Handle 304 Not Modified
    if (response.status === 304) {
      console.log(`ETag match - data not modified for ${key}`);
      return 'Not modified';
    }

    // Store new ETag if present
    const newETag = response.headers.get('etag');
    if (newETag) {
      etagCache.set(key, newETag);
    }

    // Parse and return data
    const data = (await response.json()) as T;

    return data;
  } catch (error) {
    console.error(`Error fetching ${key}:`, error);
    throw error;
  }
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

// Fetch static data (manual refresh only)
export async function fetchStaticData(
  participantId: string,
  debugMutation?: (args: any) => Promise<any>,
  updateApiTimestamp?: () => Promise<any>
): Promise<StaticData | 'Rate limited'> {
  console.log('🔄 Fetching static data for participant:', participantId);

  const url = withVersion(`/participants/${participantId}`);
  const apiEndpoint = `GET /participants/${participantId}`;

  try {
    const result = await fetchWithETag<any>(
      `static-${participantId}`,
      url,
      updateApiTimestamp,
      debugMutation,
      apiEndpoint
    );

    if (result === 'Rate limited' || result === 'Not modified') {
      return result as 'Rate limited';
    }

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
          stats: result, // Store full result for debug viewing
          topDonation: null,
          topDonor: null,
          latestDonations: null,
          apiEndpoint: `${apiEndpoint} (Static Data)`,
        });
      } catch (debugError) {
        console.error('Failed to log static data to debug:', debugError);
      }
    }

    console.log('✅ Static data fetched successfully');
    return staticData;
  } catch (error) {
    console.error('❌ Error fetching static data:', error);
    throw error;
  }
}

// Fetch real-time data (15-second intervals with timestamp guard)
export async function fetchRealTimeData(
  participantId: string,
  debugMutation?: (args: any) => Promise<any>,
  updateApiTimestamp?: () => Promise<any>,
  lastApiCallInfo?: { timestamp: number; secondsAgo: number }
): Promise<RealTimeData | 'Rate limited' | 'Using cached data'> {
  console.log('🔄 Checking if real-time data fetch is needed...');

  // Check if we should actually make API calls using passed-in info or fallback to local check
  const shouldFetch = lastApiCallInfo
    ? lastApiCallInfo.secondsAgo > 15
    : shouldFetchRealTime();

  if (!shouldFetch) {
    console.log('⏰ Using cached data - API called recently');
    return 'Using cached data';
  }

  console.log(
    '🚀 Fetching fresh real-time data for participant:',
    participantId
  );

  try {
    // Fetch participant stats for real-time data
    const statsUrl = withVersion(`/participants/${participantId}`);
    const statsResult = await fetchWithETag<any>(
      `realtime-stats-${participantId}`,
      statsUrl,
      updateApiTimestamp,
      debugMutation,
      `GET /participants/${participantId}`
    );

    if (statsResult === 'Rate limited') {
      return 'Rate limited';
    }

    // Fetch latest donations
    const donationsUrl = withVersion(
      `/participants/${participantId}/donations?limit=10&orderBy=createdDateUTC%20DESC`
    );
    const donationsResult = await fetchWithETag<any[]>(
      `realtime-donations-${participantId}`,
      donationsUrl,
      updateApiTimestamp,
      debugMutation,
      `GET /participants/${participantId}/donations?limit=10`
    );

    // Fetch top donor
    const topDonorUrl = withVersion(
      `/participants/${participantId}/donors?limit=1&orderBy=sumDonations%20DESC&where=sumDonations%20%3E%200`
    );
    const topDonorResult = await fetchWithETag<any[]>(
      `realtime-topdonor-${participantId}`,
      topDonorUrl,
      updateApiTimestamp,
      debugMutation,
      `GET /participants/${participantId}/donors`
    );

    // Handle rate limiting or not modified responses
    if (
      statsResult === 'Not modified' &&
      donationsResult === 'Not modified' &&
      topDonorResult === 'Not modified'
    ) {
      console.log('📊 All real-time data unchanged (ETags matched)');
      return 'Using cached data';
    }

    // Build real-time data response
    const realTimeData: RealTimeData = {
      sumDonations:
        statsResult !== 'Not modified' ? statsResult.sumDonations : 0,
      sumPledges:
        statsResult !== 'Not modified' ? statsResult.sumPledges : 0,
      numDonations:
        statsResult !== 'Not modified' ? statsResult.numDonations : 0,
      streamIsLive:
        statsResult !== 'Not modified' ? statsResult.streamIsLive : false,
      latestDonations:
        Array.isArray(donationsResult) &&
        donationsResult !== 'Not modified'
          ? donationsResult
          : [],
      topDonor:
        Array.isArray(topDonorResult) &&
        topDonorResult !== 'Not modified' &&
        topDonorResult.length > 0
          ? topDonorResult[0]
          : null,
    };

    // Log successful calls to debug
    if (debugMutation) {
      try {
        if (
          Array.isArray(donationsResult) &&
          donationsResult !== 'Not modified'
        ) {
          await debugMutation({
            stats: null,
            topDonation: null,
            topDonor: null,
            latestDonations: donationsResult,
            apiEndpoint: `GET /participants/${participantId}/donations?limit=10 (Real-time)`,
          });
        }

        if (
          Array.isArray(topDonorResult) &&
          topDonorResult !== 'Not modified'
        ) {
          await debugMutation({
            stats: null,
            topDonation: null,
            topDonor: topDonorResult[0] || null,
            latestDonations: null,
            apiEndpoint: `GET /participants/${participantId}/donors (Real-time)`,
          });
        }
      } catch (debugError) {
        console.error(
          'Failed to log real-time data to debug:',
          debugError
        );
      }
    }

    console.log('✅ Real-time data fetched successfully');
    return realTimeData;
  } catch (error) {
    console.error('❌ Error fetching real-time data:', error);
    throw error;
  }
}

// Force refresh static data (for manual button)
export function forceRefreshStatic(): void {
  console.log('🔄 Forcing static data refresh on next query');
  // Clear ETags for static data to force refresh
  etagCache.forEach((value, key) => {
    if (key.includes('static-')) {
      etagCache.delete(key);
    }
  });
}

// Force API calls by clearing ETags (timestamp reset handled by Convex)
export function forceAPICall(): void {
  console.log('🔄 Forcing API calls by clearing ETags');
  // Clear all ETags to force fresh requests
  etagCache.clear();
}
