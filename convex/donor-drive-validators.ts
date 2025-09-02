import { v } from 'convex/values';

export const linksValidator = v.object({
  donate: v.string(),
  page: v.string(),
  stream: v.string(),
});

export const statsValidator = v.object({
  avatarImageURL: v.string(),
  createdDateUTC: v.string(),
  displayName: v.string(),
  eventID: v.number(),
  eventName: v.string(),
  fundraisingGoal: v.number(),
  hasActivityTracking: v.boolean(),
  isCustomAvatarImage: v.boolean(),
  isTeamCaptain: v.boolean(),
  isTeamCoCaptain: v.boolean(),
  links: linksValidator,
  numDonations: v.number(),
  numIncentives: v.number(),
  numMilestones: v.number(),
  participantID: v.number(),
  participantTypeCode: v.string(),
  role: v.string(),
  streamIsEnabled: v.boolean(),
  streamIsLive: v.boolean(),
  streamingChannel: v.string(),
  streamingPlatform: v.string(),
  sumDonations: v.number(),
  sumPledges: v.number(),
  teamID: v.number(),
  teamName: v.string(),
});

export const donorValidator = v.object({
  displayName: v.string(),
  donorID: v.string(),
  avatarImageURL: v.string(),
  modifiedDateUTC: v.string(),
  sumDonations: v.number(),
  numDonations: v.number(),
});

export const donationLinksValidator = v.object({
  recipient: v.string(),
});

export const donationValidator = v.object({
  displayName: v.string(),
  donorID: v.optional(v.string()),
  links: v.optional(donationLinksValidator),
  eventID: v.optional(v.number()),
  createdDateUTC: v.optional(v.string()),
  recipientName: v.optional(v.string()),
  message: v.optional(v.union(v.string(), v.null())),
  participantID: v.optional(v.number()),
  amount: v.number(),
  donorIsRecipient: v.optional(v.boolean()),
  avatarImageURL: v.optional(v.string()),
  teamID: v.optional(v.number()),
  donationID: v.optional(v.string()),
});
