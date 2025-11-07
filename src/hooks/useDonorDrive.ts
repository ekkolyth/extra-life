import { useConvexQuery, useConvexMutation } from '@convex-dev/react-query';
import { api } from '@/convex/_generated/api';
import { useEffect } from 'react';

export function useDonorDrive() {
  const participantId = process.env.NEXT_PUBLIC_DONORDRIVE_ID;
  const upsertData = useConvexMutation(api.donorDriveData.upsert);
  const upsertDonations = useConvexMutation(api.donorDriveData.upsertDonations);
  const upsertTopDonor = useConvexMutation(api.donorDriveData.upsertTopDonor);

  // Get data from Convex
  const convexData = useConvexQuery(
    api.donorDriveData.get,
    participantId ? { participantId } : 'skip'
  );

  // Every 15 seconds, fetch fresh data and update Convex
  useEffect(() => {
    if (!participantId) return;

    const fetchAndUpdate = async () => {
      try {
        console.log('🔄 Fetching fresh data from API...');

        // Fetch participant data
        console.log('🔍 About to fetch participant data...');
        const participantResponse = await fetch(`/api/donor-drive/participant?id=${participantId}`);
        console.log('🔍 Participant response status:', participantResponse.status);
        const participantData = participantResponse.ok ? await participantResponse.json() : null;
        console.log('🔍 Participant data:', participantData);

        // Fetch the most recent 10 donations - upsertDonations will only add new ones
        const donationsResponse = await fetch(
          `/api/donor-drive/donations?id=${participantId}&limit=10&orderBy=createdDateUTC%20DESC`
        );
        const donationsData = donationsResponse.ok ? await donationsResponse.json() : [];
        console.log('🔍 Donations data:', donationsData);

        const topDonorResponse = await fetch(
          `/api/donor-drive/donors?id=${participantId}&limit=1&orderBy=sumDonations%20DESC&where=sumDonations%20%3E%200`
        );
        const topDonorData = topDonorResponse.ok ? await topDonorResponse.json() : null;
        console.log('🔍 Top donor data:', topDonorData);

        if (participantData) {
          // Update main participant data
          await upsertData({
            participantId,
            displayName: participantData.displayName || 'Unknown',
            avatarImageURL: participantData.avatarImageURL || '',
            fundraisingGoal: participantData.fundraisingGoal || 0,
            eventName: participantData.eventName || '',
            streamIsEnabled: participantData.streamIsEnabled || false,
            streamingChannel: participantData.streamingChannel || '',
            streamingPlatform: participantData.streamingPlatform || '',
            sumDonations: participantData.sumDonations || 0,
            sumPledges: participantData.sumPledges || 0,
            numDonations: participantData.numDonations || 0,
            streamIsLive: participantData.streamIsLive || false,
          });

          // Update donations
          if (Array.isArray(donationsData) && donationsData.length > 0) {
            console.log(`💰 Processing ${donationsData.length} donations from API`);
            const mappedDonations = donationsData.map(
              (d: {
                donationID?: string;
                displayName?: string;
                amount?: number;
                message?: string | null;
                avatarImageURL?: string;
                createdDateUTC?: string;
              }) => {
                const donationID = d.donationID || `${d.amount}-${d.createdDateUTC}`;
                const displayName = d.displayName || undefined; // Use undefined, not 'Anonymous' for optional field
                console.log(`  - Donation: ID=${donationID}, Amount=$${d.amount}, Name=${displayName || 'Anonymous'}, Date=${d.createdDateUTC}`);
                return {
                  donationID,
                  displayName, // Can be undefined
                  amount: d.amount || 0,
                  message: d.message || undefined,
                  avatarImageURL: d.avatarImageURL || undefined,
                  createdDateUTC: d.createdDateUTC || new Date().toISOString(),
                };
              }
            );
            console.log(`📤 Calling upsertDonations with ${mappedDonations.length} donations`);
            try {
              const result = await upsertDonations({
                participantId,
                donations: mappedDonations,
              });
              console.log('✅ upsertDonations completed successfully:', result);
            } catch (error) {
              console.error('❌ Error in upsertDonations:', error);
              throw error; // Re-throw to see the full error
            }
          } else {
            console.log('⚠️ No donations data received from API');
          }

          // Update top donor
          if (topDonorData) {
            await upsertTopDonor({
              participantId,
              donorID: topDonorData.donorID || 'unknown',
              displayName: topDonorData.displayName,
              avatarImageURL: topDonorData.avatarImageURL || '',
              sumDonations: topDonorData.sumDonations || 0,
              numDonations: topDonorData.numDonations || 0,
              modifiedDateUTC: topDonorData.modifiedDateUTC || new Date().toISOString(),
            });
          }

          console.log('✅ Data updated in Convex');
        }
      } catch (error) {
        console.error('❌ Error fetching/updating data:', error);
      }
    };

    // Fetch immediately
    fetchAndUpdate();

    // Then every 15 seconds
    const interval = setInterval(fetchAndUpdate, 15000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [participantId]); // Only re-run if participantId changes

  // Return the data from Convex with optimistic loading
  return {
    data: convexData,
    isLoading: convexData === undefined && !convexData, // Only show loading if we have no data at all
    error: null,
  };
}
