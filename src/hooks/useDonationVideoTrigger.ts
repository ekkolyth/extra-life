import { useEffect, useState, useRef } from 'react';

interface Donation {
  amount: number;
  createdDateUTC: string;
  donationID?: string;
  displayName?: string;
  message?: string;
}

interface UseDonationVideoTriggerProps {
  latestDonations: Donation[];
  threshold: number;
  timeWindowSeconds: number;
}

export function useDonationVideoTrigger({
  latestDonations,
  threshold,
  timeWindowSeconds,
}: UseDonationVideoTriggerProps) {
  const [currentDonation, setCurrentDonation] = useState<Donation | null>(null);
  const [shouldPlayVideo, setShouldPlayVideo] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoQueue, setVideoQueue] = useState<Donation[]>([]);
  const previousDonationsRef = useRef<Set<string>>(new Set());
  const lastTriggerTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!latestDonations || latestDonations.length === 0) {
      return;
    }

    const now = Date.now();
    const timeWindowMs = timeWindowSeconds * 1000;

    // Get current donation IDs
    const currentDonationIds = new Set(
      latestDonations
        .filter(d => d.donationID)
        .map(d => d.donationID!)
    );

    // Find new donations that weren't in the previous set
    const newDonations = latestDonations.filter(donation => {
      const donationId = donation.donationID || `${donation.amount}-${donation.createdDateUTC}`;
      return !previousDonationsRef.current.has(donationId);
    });

    // Check for qualifying donations within the time window
    const qualifyingDonations = newDonations.filter(donation => {
      const donationTime = new Date(donation.createdDateUTC).getTime();
      const timeSinceDonation = now - donationTime;
      
      return (
        donation.amount >= threshold &&
        timeSinceDonation <= timeWindowMs &&
        timeSinceDonation >= 0 // Donation is not in the future
      );
    });

    // Add qualifying donations to the queue
    if (qualifyingDonations.length > 0) {
      console.log(`🎉 ${qualifyingDonations.length} big donation(s) detected:`, 
        qualifyingDonations.map(d => `$${d.amount} from ${d.displayName || 'Anonymous'}`)
      );
      
      setVideoQueue(prevQueue => [...prevQueue, ...qualifyingDonations]);
      lastTriggerTimeRef.current = now;
    }

    // Update the previous donations set
    previousDonationsRef.current = currentDonationIds;
  }, [latestDonations, threshold, timeWindowSeconds]);

  // Process video queue
  useEffect(() => {
    if (videoQueue.length > 0 && !isPlaying) {
      const nextDonation = videoQueue[0];
      setCurrentDonation(nextDonation);
      setShouldPlayVideo(true);
      setIsPlaying(true);
      
      // Remove the first item from queue
      setVideoQueue(prevQueue => prevQueue.slice(1));
    }
  }, [videoQueue, isPlaying]);

  const handleVideoEnd = () => {
    setShouldPlayVideo(false);
    setIsPlaying(false);
    setCurrentDonation(null);
  };

  return {
    shouldPlayVideo,
    currentDonation,
    handleVideoEnd,
  };
}