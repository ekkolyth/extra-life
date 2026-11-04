import Link from 'next/link'
import { DonateButton } from '@/components/marketing/donate-button'
import {
    LightboxPhoto,
    type Photo,
    PhotoLightbox,
} from '@/components/marketing/photo-lightbox'
import { TwitchEmbed } from '@/components/marketing/twitch-embed'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const photos = {
    tattoo: {
        src: '/images/el-stream-4.png',
        alt: 'Live tattoo on a past stream',
    },
    kid: { src: '/images/el-kid.jpg', alt: 'Extra Life kid' },
    hotDog: {
        src: '/images/el-stream-3.png',
        alt: 'Hot dog costume and wheel spins on a past stream',
    },
    legWax: {
        src: '/images/el-stream-1.png',
        alt: 'Leg waxing on a past stream',
    },
    cardsAgainstHumanity: {
        src: '/images/el-stream-5.png',
        alt: 'Cards Against Humanity on a past stream',
    },
    impact: { src: '/images/el-impact.png', alt: 'Extra Life impact' },
    bodybuilding: {
        src: '/images/el-stream-2.png',
        alt: 'Bodybuilding competition commentary on a past stream',
    },
} satisfies Record<string, Photo>

function WidePhoto(photo: Photo) {
    return (
        <LightboxPhoto
            {...photo}
            className='aspect-video sm:aspect-[21/9]'
            sizes='(min-width: 1536px) 1536px, 100vw'
        />
    )
}

export default function Home() {
    const rileyURL =
        'https://rileykids.org/transforming-childrens-health/rileychildrenshealth'

    return (
        <main className='flex flex-col min-h-screen'>
            <PhotoLightbox photos={Object.values(photos)}>
                {/* Hero Section */}
                <section className='relative bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white'>
                    <div className='absolute inset-0 bg-black/20' />
                    <div className='relative container mx-auto px-4 pt-20 pb-28'>
                        <div className='text-center space-y-6'>
                            <div className='flex items-center justify-center space-x-2 mb-8'>
                                <div className='w-8 h-8 border-2 border-white rounded-full flex items-center justify-center'>
                                    <div className='w-2 h-2 bg-white rounded-full'></div>
                                </div>
                                <span className='text-lg font-medium'>
                                    Children&apos;s Miracle Network Hospitals
                                </span>
                            </div>
                            <h1 className='text-4xl md:text-6xl font-bold tracking-tight max-w-4xl mx-auto'>
                                Play Games to Change Kids&apos; Health to Change
                                the Future
                            </h1>
                            <div className='flex flex-col sm:flex-row gap-4 max-w-md mx-auto pt-2'>
                                <DonateButton className='flex-1' />
                                <Button
                                    asChild
                                    className='flex-1'
                                    size='lg'
                                    variant='outline'
                                >
                                    <a href='#live-stream'>Watch the stream</a>
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                <div className='container mx-auto px-4 -mt-12 relative'>
                    <WidePhoto {...photos.tattoo} />
                </div>

                {/* What Is Extra Life Section */}
                <section className='container mx-auto px-4 py-16 grid lg:grid-cols-2 gap-12 items-center'>
                    <div className='space-y-6'>
                        <h2 className='text-3xl font-bold text-foreground'>
                            What Is Extra Life?
                        </h2>
                        <p className='text-lg text-muted-foreground leading-relaxed'>
                            Extra Life is a fundraising program of
                            Children&apos;s Miracle Network Hospitals®. The
                            Extra Life community fundraises year-round to Change
                            Kids&apos; Health to Change the Future. Donations go
                            to member children&apos;s hospitals to fund critical
                            life-saving treatments and healthcare services,
                            along with innovative research, vital pediatric
                            medical equipment, and child life services.
                        </p>
                        <p className='text-lg text-muted-foreground leading-relaxed'>
                            Since its inception in 2008, Extra Life has raised
                            over $100 million USD to Change Kids&apos; Health to
                            Change the Future. Right now, children&apos;s
                            hospitals need YOUR support.
                        </p>
                        <div className='flex flex-col sm:flex-row gap-4'>
                            <DonateButton className='flex-1' />
                            <Button
                                asChild
                                className='flex-1'
                                size='lg'
                                variant='outline'
                            >
                                <Link href={rileyURL}>Learn about Riley</Link>
                            </Button>
                        </div>
                    </div>
                    <LightboxPhoto
                        {...photos.kid}
                        className='aspect-video'
                        sizes='(min-width: 1024px) 50vw, 100vw'
                    />
                </section>

                {/* Live Stream Section */}
                <section
                    className='bg-muted/50 dark:bg-muted/20 py-16'
                    id='live-stream'
                >
                    <div className='container mx-auto px-4 space-y-6'>
                        <h2 className='text-3xl font-bold text-foreground'>
                            Live Stream
                        </h2>
                        <TwitchEmbed />
                    </div>
                </section>

                {/* How We Fit In Section */}
                <section className='container mx-auto px-4 py-16 grid lg:grid-cols-2 gap-12 items-start'>
                    <div className='space-y-6'>
                        <h2 className='text-3xl font-bold text-foreground'>
                            How Do We Fit In?
                        </h2>
                        <p className='text-lg text-muted-foreground leading-relaxed'>
                            2026 Marks the TENTH Year that Kenway has put on
                            this 24+ Hour effort to raise money for Riley&apos;s
                            Children Hospital in Indianapolis, IN.
                        </p>
                        <p className='text-lg text-muted-foreground leading-relaxed'>
                            The names and faces attached have changed over the
                            years, but one thing hasn&apos;t - the mission. Each
                            year, 4 - 10 humans come together to put their
                            bodies and spirit on the line in hopes to encourage
                            you &ldquo;beautiful creatures of the
                            internet&rdquo; to give to kids in need. Thankfully,
                            you&apos;ve always shown up to show us that you care
                            - and that&apos;s truly amazing.
                        </p>
                        <DonateButton className='w-full' />
                    </div>

                    <div className='space-y-6'>
                        {/* Total Fundraising Card */}
                        <Card className='bg-gradient-to-br from-blue-600 to-purple-600 text-white border-0'>
                            <CardContent className='p-6 text-center'>
                                <div className='text-4xl font-bold mb-2'>
                                    $12,834.26
                                </div>
                                <div className='text-lg opacity-90'>
                                    Total Raised Since 2017
                                </div>
                            </CardContent>
                        </Card>

                        {/* Fundraising Totals */}
                        <Card>
                            <CardHeader>
                                <CardTitle className='text-lg'>
                                    Fundraising Totals
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className='space-y-3'>
                                    {[
                                        { year: '2025', amount: '$1,827.05' },
                                        { year: '2024', amount: '$2,100.00' },
                                        { year: '2023', amount: '$2,157.81' },
                                        { year: '2022', amount: '$2,214.00' },
                                        { year: '2021', amount: '$2,154.17' },
                                        { year: '2020', amount: '$1,528.65' },
                                        { year: '2019', amount: '$392.90' },
                                        { year: '2018', amount: '$354.68' },
                                        { year: '2017', amount: '$105.00' },
                                    ].map((item) => (
                                        <div
                                            className='flex justify-between items-center'
                                            key={item.year}
                                        >
                                            <span className='font-medium text-blue-600 dark:text-blue-400'>
                                                {item.year}
                                            </span>
                                            <span className='font-bold text-foreground'>
                                                {item.amount}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                <div className='container mx-auto px-4 pb-4'>
                    <WidePhoto {...photos.hotDog} />
                </div>

                <div className='container mx-auto px-4 grid sm:grid-cols-2 gap-4'>
                    <LightboxPhoto
                        {...photos.legWax}
                        className='aspect-[4/3]'
                        sizes='(min-width: 640px) 50vw, 100vw'
                    />
                    <LightboxPhoto
                        {...photos.cardsAgainstHumanity}
                        className='aspect-[4/3]'
                        sizes='(min-width: 640px) 50vw, 100vw'
                    />
                </div>

                {/* How Your Donation Helps Section */}
                <section className='container mx-auto px-4 py-16 grid lg:grid-cols-2 gap-12 items-center'>
                    <div className='space-y-6'>
                        <h2 className='text-3xl font-bold text-foreground'>
                            Helping a Great Cause
                        </h2>
                        <p className='text-lg text-muted-foreground leading-relaxed'>
                            Regardless of what else you take away from this,
                            just know that at the end of the day we&apos;re here
                            to raise money for those in need - and{' '}
                            <em>that&apos;s</em> what matters.
                        </p>
                        <p className='text-lg text-muted-foreground leading-relaxed'>
                            Don&apos;t have money to donate? That&apos;s okay!
                            Share the stream or the donations page with friends
                            and family, hang out in chat (trust me, we need
                            people to talk to!), perform magic on your own to
                            bless the stream, whatever you like! Just know we
                            appreciate that you&apos;ve cared enough to scroll
                            this far down the page.
                        </p>
                        <div className='flex flex-col sm:flex-row gap-4'>
                            <DonateButton className='flex-1' />
                            <Button
                                asChild
                                className='flex-1'
                                size='lg'
                                variant='outline'
                            >
                                <a href='#live-stream'>Watch the stream</a>
                            </Button>
                        </div>
                    </div>
                    <LightboxPhoto
                        {...photos.impact}
                        className='aspect-[40/21]'
                        sizes='(min-width: 1024px) 50vw, 100vw'
                    />
                </section>

                <div className='container mx-auto px-4 pb-16'>
                    <WidePhoto {...photos.bodybuilding} />
                </div>
            </PhotoLightbox>
        </main>
    )
}
