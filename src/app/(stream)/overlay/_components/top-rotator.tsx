"use client";

import type { Goal } from "@/types/db";

import { LeftText } from "./left-text";
import { RightText } from "./right-text";
import Image from "next/image";
import DiceIcon from "../../../../../public/icons/dice";
import { ControllerIcon } from "../../../../../public/icons/controller";

interface TopRotatorProps {
  goals: Goal[];
  data: {
    displayName: string;
    fundraisingGoal: number;
    eventName: string;
    links: { donate: string; page: string; stream: string };
    streamIsEnabled: boolean;
    streamingChannel: string;
    streamingPlatform: string;
    avatarImageURL: string;
    participantID: number;
    teamName: string;
    isTeamCaptain: boolean;
    isTeamCoCaptain: boolean;
    role: string;
    hasActivityTracking: boolean;
    numIncentives: number;
    numMilestones: number;
    sumDonations: number;
    sumPledges: number;
    numDonations: number;
    streamIsLive: boolean;
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
}

const TopRotator = (props: TopRotatorProps) => {
  const { goals, data } = props;

  return (
    <div
      style={{ width: 1200, height: 78 }}
      className="bg-primary rounded-full relative shadow-super"
    >
      <div className="ml-8 mr-8 h-full flex items-center py-2 pl-6 pr-10">
        <ControllerIcon className="h-full mr-4" />
        <LeftText data={data} />
        <RightText goals={goals} data={data} />
      </div>
    </div>
  );
};

export default TopRotator;
