'use client'

import { useUser } from '@clerk/nextjs'
import { convexQuery } from '@convex-dev/react-query'
import { useQuery } from '@tanstack/react-query'
import {
    ArrowLeftRight,
    BarChart3,
    Bug,
    Calendar,
    Pointer as Counter,
    DollarSign,
    ExternalLink,
    type LucideIcon,
    Monitor,
    MonitorPlay as Overlay,
    RotateCcw,
    Settings,
    Target,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    useSidebar,
} from '@/components/ui/sidebar'
import { api } from '@/convex/_generated/api'
import { isAdminUser } from '@/convex/lib/admin'
import { participantPageUrl } from '@/utils/extra-life'

type NavLinkItem = {
    name: string
    href: string
    icon: LucideIcon
    external?: boolean
}

const navigationItems = [
    {
        name: 'Dashboard',
        href: '/dashboard',
        icon: BarChart3,
    },
    {
        name: 'Schedule',
        href: '/schedule',
        icon: Calendar,
    },
    {
        name: 'Goals',
        href: '/goals',
        icon: Target,
    },
    {
        name: 'Randomizer',
        href: '/randomizer',
        icon: ArrowLeftRight,
    },
    {
        name: 'Rotator',
        href: '/rotator',
        icon: RotateCcw,
    },
]

const tools = [
    {
        name: 'Donations',
        href: '/donations',
        icon: DollarSign,
        external: false,
    },
    {
        name: 'Debug',
        href: '/debug',
        icon: Bug,
        external: false,
    },
    {
        name: 'Settings',
        href: '/config',
        icon: Settings,
        external: false,
    },
]

const adminOnlyTools = new Set(['Debug', 'Settings'])

const resources = [
    {
        name: 'Twitch Page',
        href: 'https://www.twitch.tv/ekkolyth',
        icon: Monitor,
        external: true,
    },
    {
        name: 'Overlay',
        href: '/overlay',
        icon: Overlay,
        external: true,
    },
    {
        name: 'Donation Counter',
        href: '/counter',
        icon: Counter,
        external: false,
    },
]

function NavItem({
    item,
    isActive = false,
    opensInNewTab = false,
}: {
    item: NavLinkItem
    isActive?: boolean
    opensInNewTab?: boolean
}) {
    const { isMobile, setOpenMobile } = useSidebar()

    return (
        <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive} tooltip={item.name}>
                <Link
                    href={item.href}
                    // the mobile sheet stays open after navigation unless closed here
                    onClick={() => isMobile && setOpenMobile(false)}
                    rel={opensInNewTab ? 'noopener noreferrer' : undefined}
                    target={opensInNewTab ? '_blank' : undefined}
                >
                    <item.icon />
                    <span>{item.name}</span>
                    {item.external && (
                        <ExternalLink className='ml-auto text-muted-foreground' />
                    )}
                </Link>
            </SidebarMenuButton>
        </SidebarMenuItem>
    )
}

function AppSidebar() {
    const pathname = usePathname()
    const { user } = useUser()
    const isAdmin = isAdminUser(user)
    const { data: campaign } = useQuery(convexQuery(api.campaigns.active, {}))
    const visibleResources = campaign
        ? [
              {
                  name: 'Extra Life Page',
                  href: participantPageUrl(campaign.participantId),
                  icon: ExternalLink,
                  external: true,
              },
              ...resources,
          ]
        : resources
    const visibleTools = tools.filter(
        (item) => !adminOnlyTools.has(item.name) || isAdmin
    )

    return (
        <Sidebar collapsible='icon'>
            <SidebarHeader className='h-16 flex-row items-center gap-3 px-4 transition-[padding] duration-200 ease-in-out group-data-[collapsible=icon]:px-2'>
                <div className='flex size-8 shrink-0 items-center justify-center rounded-lg bg-black border border-zinc-600'>
                    <svg
                        aria-hidden='true'
                        className='size-5 text-primary'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth={2}
                        viewBox='0 0 24 24'
                    >
                        <path d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z' />
                    </svg>
                </div>
                <span className='font-semibold text-foreground group-data-[collapsible=icon]:hidden'>
                    ExtraLife
                </span>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Game Day</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navigationItems.map((item) => (
                                <NavItem
                                    isActive={pathname === item.href}
                                    item={item}
                                    key={item.name}
                                />
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>Tools</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {visibleTools.map((item) => (
                                <NavItem item={item} key={item.name} />
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>Resources</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {visibleResources.map((item) => (
                                <NavItem
                                    item={item}
                                    key={item.name}
                                    opensInNewTab={item.external}
                                />
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    )
}

export { AppSidebar }
