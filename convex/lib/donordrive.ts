import { z } from 'zod'

const DONORDRIVE_PAGE_SIZE = 100

const parseDonorDriveDate = (value: string): number => {
    // donors send "+0000"; Date.parse needs "+00:00"
    const parsed = Date.parse(value.replace(/([+-]\d{2})(\d{2})$/, '$1:$2'))
    if (Number.isNaN(parsed))
        throw new Error(`Unparseable DonorDrive date: ${value}`)
    return parsed
}

const isParseableDonorDriveDate = (value: string): boolean => {
    try {
        parseDonorDriveDate(value)
        return true
    } catch {
        return false
    }
}

const linksSchema = z.object({
    donate: z.string(),
    page: z.string(),
    stream: z.string(),
})

const participantSchema = z.object({
    avatarImageURL: z.string(),
    createdDateUTC: z.string(),
    displayName: z.string(),
    eventID: z.number(),
    eventName: z.string(),
    fundraisingGoal: z.number(),
    hasActivityTracking: z.boolean(),
    isCustomAvatarImage: z.boolean(),
    isTeamCaptain: z.boolean().optional(),
    isTeamCoCaptain: z.boolean().optional(),
    links: linksSchema,
    numDonations: z.number(),
    numIncentives: z.number(),
    numMilestones: z.number(),
    participantID: z.number(),
    participantTypeCode: z.string(),
    role: z.string().optional(),
    streamIsEnabled: z.boolean(),
    streamIsLive: z.boolean(),
    streamingChannel: z.string(),
    streamingPlatform: z.string(),
    sumDonations: z.number(),
    sumPledges: z.number(),
    teamID: z.number().optional(),
    teamName: z.string().optional(),
})

const donorSchema = z.object({
    displayName: z.string().optional(),
    donorID: z.string().optional(),
    avatarImageURL: z.string(),
    modifiedDateUTC: z
        .string()
        .refine(isParseableDonorDriveDate, 'unparseable date'),
    sumDonations: z.number(),
    numDonations: z.number(),
    recipientImageURL: z.string().optional(),
})

const donationLinksSchema = z.object({
    donate: z.string().optional(),
    recipient: z.string(),
})

const donationSchema = z.object({
    amount: z.number(),
    avatarImageURL: z.string().optional(),
    createdDateUTC: z
        .string()
        .refine(isParseableDonorDriveDate, 'unparseable date')
        .optional(),
    donationID: z.string().optional(),
    eventID: z.number().optional(),
    isRegFee: z.boolean().optional(),
    links: donationLinksSchema.optional(),
    participantID: z.number().optional(),
    recipientImageURL: z.string().optional(),
    recipientName: z.string().optional(),
    displayName: z.string().optional(),
    donorID: z.string().optional(),
    donorIsRecipient: z.boolean().optional(),
    message: z.string().nullable().optional(),
    teamID: z.number().optional(),
})

type DonorDriveParticipant = z.infer<typeof participantSchema>
type DonorDriveDonation = z.infer<typeof donationSchema>
type DonorDriveDonor = z.infer<typeof donorSchema>

type CampaignFields = {
    eventId: number
    eventName: string
    displayName: string
    avatarImageURL: string
    fundraisingGoal: number
    streamIsEnabled: boolean
    streamingChannel: string
    streamingPlatform: string
    sumDonations: number
    sumPledges: number
    numDonations: number
    streamIsLive: boolean
}

type DonationRowInput = {
    year: number
    donationID: string
    participantId: string
    donorID?: string
    displayName?: string
    amount: number
    message?: string
    avatarImageURL?: string
    isRegFee: boolean
    createdAt: number
    source: 'api'
}

type DonorRowInput = {
    year: number
    donorID: string
    displayName?: string
    avatarImageURL?: string
    sumDonations: number
    numDonations: number
    modifiedAt: number
}

const parseRecords = <T>(
    schema: z.ZodType<T>,
    body: unknown
): { records: T[]; errors: string[]; pageLength: number } => {
    const records: T[] = []
    const errors: string[] = []
    if (!Array.isArray(body))
        return { records, errors: ['expected an array'], pageLength: 0 }
    for (const [index, item] of body.entries()) {
        const result = schema.safeParse(item)
        if (result.success) records.push(result.data)
        else errors.push(`record ${index}: ${result.error.message}`)
    }
    return { records, errors, pageLength: body.length }
}

const splitPage = <T extends { donationID: string }>(
    rows: T[],
    knownIds: ReadonlySet<string>
): { fresh: T[]; hitKnown: boolean } => {
    const fresh: T[] = []
    let hitKnown = false
    for (const row of rows) {
        if (knownIds.has(row.donationID)) hitKnown = true
        else fresh.push(row)
    }
    return { fresh, hitKnown }
}

const toCampaignFields = (p: DonorDriveParticipant): CampaignFields => ({
    eventId: p.eventID,
    eventName: p.eventName,
    displayName: p.displayName,
    avatarImageURL: p.avatarImageURL,
    fundraisingGoal: p.fundraisingGoal,
    streamIsEnabled: p.streamIsEnabled,
    streamingChannel: p.streamingChannel,
    streamingPlatform: p.streamingPlatform,
    sumDonations: p.sumDonations,
    sumPledges: p.sumPledges,
    numDonations: p.numDonations,
    streamIsLive: p.streamIsLive,
})

const toDonationRow = (
    d: DonorDriveDonation,
    scope: { year: number; participantId: string }
): DonationRowInput | null => {
    if (!d.donationID || !d.createdDateUTC) return null
    let createdAt: number
    try {
        createdAt = parseDonorDriveDate(d.createdDateUTC)
    } catch {
        return null
    }
    const row: DonationRowInput = {
        year: scope.year,
        donationID: d.donationID,
        participantId: scope.participantId,
        amount: d.amount,
        isRegFee: d.isRegFee ?? false,
        createdAt,
        source: 'api',
    }
    if (d.donorID) row.donorID = d.donorID
    if (d.displayName) row.displayName = d.displayName
    if (d.message) row.message = d.message
    if (d.avatarImageURL) row.avatarImageURL = d.avatarImageURL
    return row
}

const toDonorRow = (d: DonorDriveDonor, year: number): DonorRowInput | null => {
    if (!d.donorID) return null
    let modifiedAt: number
    try {
        modifiedAt = parseDonorDriveDate(d.modifiedDateUTC)
    } catch {
        return null
    }
    const row: DonorRowInput = {
        year,
        donorID: d.donorID,
        sumDonations: d.sumDonations,
        numDonations: d.numDonations,
        modifiedAt,
    }
    if (d.displayName) row.displayName = d.displayName
    if (d.avatarImageURL) row.avatarImageURL = d.avatarImageURL
    return row
}

const hasMorePages = (pageLength: number, hitKnown: boolean): boolean =>
    pageLength === DONORDRIVE_PAGE_SIZE && !hitKnown

export type {
    CampaignFields,
    DonationRowInput,
    DonorDriveDonation,
    DonorDriveDonor,
    DonorDriveParticipant,
    DonorRowInput,
}
export {
    DONORDRIVE_PAGE_SIZE,
    donationSchema,
    donorSchema,
    hasMorePages,
    parseDonorDriveDate,
    parseRecords,
    participantSchema,
    splitPage,
    toCampaignFields,
    toDonationRow,
    toDonorRow,
}
