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
  isTeamCaptain: v.optional(v.boolean()),
  isTeamCoCaptain: v.optional(v.boolean()),
  links: linksValidator,
  numDonations: v.number(),
  numIncentives: v.number(),
  numMilestones: v.number(),
  participantID: v.number(),
  participantTypeCode: v.string(),
  role: v.optional(v.string()),
  streamIsEnabled: v.boolean(),
  streamIsLive: v.boolean(),
  streamingChannel: v.string(),
  streamingPlatform: v.string(),
  sumDonations: v.number(),
  sumPledges: v.number(),
  teamID: v.optional(v.number()),
  teamName: v.optional(v.string()),
});

export const donorValidator = v.object({
  displayName: v.optional(v.string()),
  donorID: v.optional(v.string()),
  avatarImageURL: v.string(),
  modifiedDateUTC: v.string(),
  sumDonations: v.number(),
  numDonations: v.number(),
  recipientImageURL: v.optional(v.string()),
});

export const donationLinksValidator = v.object({
  donate: v.optional(v.string()),
  recipient: v.string(),
});

export const donationValidator = v.object({
  amount: v.number(),
  avatarImageURL: v.optional(v.string()),
  createdDateUTC: v.optional(v.string()),
  donationID: v.optional(v.string()),
  eventID: v.optional(v.number()),
  isRegFee: v.optional(v.boolean()),
  links: v.optional(donationLinksValidator),
  participantID: v.optional(v.number()),
  recipientImageURL: v.optional(v.string()),
  recipientName: v.optional(v.string()),
  // Keep displayName as optional for backward compatibility
  displayName: v.optional(v.string()),
  donorID: v.optional(v.string()),
  donorIsRecipient: v.optional(v.boolean()),
  message: v.optional(v.union(v.string(), v.null())),
  teamID: v.optional(v.number()),
});
