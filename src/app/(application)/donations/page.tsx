'use client'

import { useUser } from '@clerk/nextjs'
import { useConvexMutation, useConvexQuery } from '@convex-dev/react-query'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Eye, EyeOff, MoreVertical } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { api } from '@/convex/_generated/api'
import { useCampaign } from '@/hooks/use-campaign'
import { useAllDonations } from '@/hooks/use-donations'

dayjs.extend(relativeTime)

export default function DonationsPage() {
    const { user } = useUser()

    // triggers the sync pull like every other donor-data page
    useCampaign()

    const { data: allDonations } = useAllDonations()

    // Fetch viewed donations for current user
    const viewedDonationIDs = useConvexQuery(
        api.viewedDonations.getViewedDonations,
        user?.id ? { userId: user.id } : 'skip'
    )

    // Mutations
    const markAsViewed = useConvexMutation(api.viewedDonations.markAsViewed)
    const markAsUnviewed = useConvexMutation(api.viewedDonations.markAsUnviewed)

    // Local state for selected donations
    const [selectedDonationIDs, setSelectedDonationIDs] = useState<Set<string>>(
        new Set()
    )

    // Check if all visible donations are selected
    const allSelected = useMemo(() => {
        if (!allDonations || allDonations.length === 0) return false
        return allDonations.every((d) => selectedDonationIDs.has(d.donationID))
    }, [allDonations, selectedDonationIDs])

    // Handle select all / deselect all
    const handleSelectAll = () => {
        if (!allDonations) return

        if (allSelected) {
            setSelectedDonationIDs(new Set())
        } else {
            const allIDs = new Set(allDonations.map((d) => d.donationID))
            setSelectedDonationIDs(allIDs)
        }
    }

    // Handle individual checkbox toggle
    const handleToggleSelection = (donationID: string) => {
        const newSelected = new Set(selectedDonationIDs)
        if (newSelected.has(donationID)) {
            newSelected.delete(donationID)
        } else {
            newSelected.add(donationID)
        }
        setSelectedDonationIDs(newSelected)
    }

    // Handle bulk mark as viewed
    const handleBulkViewed = async () => {
        if (!user?.id || selectedDonationIDs.size === 0) return

        await markAsViewed({
            userId: user.id,
            donationIDs: Array.from(selectedDonationIDs),
        })

        // Clear selection after marking
        setSelectedDonationIDs(new Set())
    }

    // Handle bulk mark as unviewed
    const handleBulkUnviewed = async () => {
        if (!user?.id || selectedDonationIDs.size === 0) return

        await markAsUnviewed({
            userId: user.id,
            donationIDs: Array.from(selectedDonationIDs),
        })

        // Clear selection after marking
        setSelectedDonationIDs(new Set())
    }

    // Handle individual mark as viewed/unviewed
    const handleToggleViewed = async (
        donationID: string,
        isCurrentlyViewed: boolean
    ) => {
        if (!user?.id) return

        if (isCurrentlyViewed) {
            await markAsUnviewed({ userId: user.id, donationIDs: [donationID] })
        } else {
            await markAsViewed({ userId: user.id, donationIDs: [donationID] })
        }
    }

    // Loading state
    if (allDonations === undefined || viewedDonationIDs === undefined) {
        return (
            <div className='space-y-4'>
                <Card>
                    <CardHeader>
                        <CardTitle>Donations</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className='text-sm text-muted-foreground'>
                            Loading donations...
                        </p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    // No donations state
    if (!allDonations || allDonations.length === 0) {
        return (
            <div className='space-y-4'>
                <Card>
                    <CardHeader>
                        <CardTitle>Donations</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className='text-sm text-muted-foreground'>
                            No donations yet. Share your donation link to get
                            started!
                        </p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const viewedSet = new Set(viewedDonationIDs)

    // Debug logging
    console.log(
        '📋 Donations Page - allDonations:',
        allDonations?.length || 0,
        'donations'
    )
    if (allDonations) {
        allDonations.forEach((d, i) => {
            console.log(
                `  ${i + 1}. ID=${d.donationID}, Amount=$${d.amount}, Date=${d.createdAt}`
            )
        })
    }

    return (
        <div className='space-y-4'>
            <Card className='border-border/50 bg-card/30 backdrop-blur-sm'>
                <CardHeader>
                    <CardTitle>Donations</CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                    {/* Bulk Actions */}
                    <div className='flex items-center gap-4 pb-4 border-b'>
                        <Checkbox
                            aria-label='Select all donations'
                            checked={allSelected}
                            onCheckedChange={handleSelectAll}
                        />
                        <span className='text-sm text-muted-foreground'>
                            {allSelected ? 'Deselect All' : 'Select All'}
                        </span>

                        <div className='flex gap-2 ml-auto'>
                            <Button
                                disabled={selectedDonationIDs.size === 0}
                                onClick={handleBulkViewed}
                                size='sm'
                                variant='outline'
                            >
                                <Eye className='h-4 w-4 mr-2' />
                                Mark Viewed
                            </Button>
                            <Button
                                disabled={selectedDonationIDs.size === 0}
                                onClick={handleBulkUnviewed}
                                size='sm'
                                variant='outline'
                            >
                                <EyeOff className='h-4 w-4 mr-2' />
                                Mark Unviewed
                            </Button>
                        </div>
                    </div>

                    {/* Donations List */}
                    <div className='space-y-2'>
                        {allDonations.map((donation) => {
                            const isViewed = viewedSet.has(donation.donationID)
                            const isSelected = selectedDonationIDs.has(
                                donation.donationID
                            )

                            return (
                                <div
                                    className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
                                        isViewed
                                            ? 'opacity-50 bg-muted/30'
                                            : 'bg-card hover:bg-accent/5'
                                    }`}
                                    key={donation.donationID}
                                >
                                    {/* Checkbox */}
                                    <Checkbox
                                        aria-label={`Select donation from ${donation.displayName || 'Anonymous'}`}
                                        checked={isSelected}
                                        onCheckedChange={() =>
                                            handleToggleSelection(
                                                donation.donationID
                                            )
                                        }
                                    />

                                    {/* Avatar */}
                                    <Avatar className='h-10 w-10'>
                                        <AvatarImage
                                            alt={
                                                donation.displayName ||
                                                'Anonymous'
                                            }
                                            src={donation.avatarImageURL}
                                        />
                                        <AvatarFallback>
                                            {(donation.displayName || 'A')
                                                .charAt(0)
                                                .toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>

                                    {/* Donation Details */}
                                    <div className='flex-1 min-w-0'>
                                        <div className='flex items-baseline gap-2'>
                                            <p className='text-sm font-medium truncate'>
                                                {donation.displayName ||
                                                    'Anonymous'}
                                            </p>
                                            <p className='text-sm font-bold text-primary'>
                                                ${donation.amount.toFixed(2)}
                                            </p>
                                        </div>
                                        {donation.message && (
                                            <p className='text-sm text-muted-foreground line-clamp-2 mt-1'>
                                                {donation.message}
                                            </p>
                                        )}
                                        <p className='text-xs text-muted-foreground mt-1'>
                                            {dayjs(
                                                donation.createdAt
                                            ).fromNow()}
                                        </p>
                                    </div>

                                    {/* 3-dot Menu */}
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button size='icon' variant='ghost'>
                                                <MoreVertical className='h-4 w-4' />
                                                <span className='sr-only'>
                                                    Open menu
                                                </span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align='end'>
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    handleToggleViewed(
                                                        donation.donationID,
                                                        isViewed
                                                    )
                                                }
                                            >
                                                {isViewed ? (
                                                    <>
                                                        <EyeOff className='h-4 w-4 mr-2' />
                                                        Mark as Unviewed
                                                    </>
                                                ) : (
                                                    <>
                                                        <Eye className='h-4 w-4 mr-2' />
                                                        Mark as Viewed
                                                    </>
                                                )}
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
