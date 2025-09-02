import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

export default function Home() {
  return (
    <main className='flex flex-col min-h-screen'>
      {/* Hero Section */}
      <section className='relative bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white'>
        <div className='absolute inset-0 bg-black/20' />
        <div className='relative container mx-auto px-4 py-20'>
          <div className='text-center space-y-6'>
            <div className='flex items-center justify-center space-x-2 mb-8'>
              <div className='w-8 h-8 border-2 border-white rounded-full flex items-center justify-center'>
                <div className='w-2 h-2 bg-white rounded-full'></div>
              </div>
              <span className='text-lg font-medium'>Children&apos;s Miracle Network Hospitals</span>
            </div>
            <h1 className='text-4xl md:text-6xl font-bold tracking-tight max-w-4xl mx-auto'>
              Play Games to Change Kids&apos; Health to Change the Future
            </h1>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className='container mx-auto px-4 py-16'>
        <div className='grid lg:grid-cols-2 gap-12 items-start'>
          {/* Left Column - Video/Image Section */}
          <div className='space-y-6'>
            <Card className='overflow-hidden'>
              <CardContent className='p-0'>
                <div className='relative aspect-video'>
                  <Image
                    src='/images/el-kid.jpg'
                    alt='Extra Life kid'
                    fill
                    className='object-cover'
                  />
                  <div className='absolute bottom-4 left-4 bg-black/80 text-white px-3 py-1 rounded text-sm font-bold'>
                    EXTRA-LIFE.ORG
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Content */}
          <div className='space-y-6'>
            <div>
              <h2 className='text-3xl font-bold text-foreground mb-4'>What Is Extra Life?</h2>
              <p className='text-lg text-muted-foreground leading-relaxed'>
                Extra Life is a fundraising program of Children&apos;s Miracle Network Hospitals®.
                The Extra Life community fundraises year-round to Change Kids&apos; Health to Change
                the Future. Donations go to member children&apos;s hospitals to fund critical
                life-saving treatments and healthcare services, along with innovative research,
                vital pediatric medical equipment, and child life services.
              </p>
              <p className='text-lg text-muted-foreground leading-relaxed mt-4'>
                Since its inception in 2008, Extra Life has raised over $100 million USD to Change
                Kids&apos; Health to Change the Future. Right now, children&apos;s hospitals need
                YOUR support.
              </p>
            </div>

            <div className='flex flex-col sm:flex-row gap-4'>
              <Button size='lg' className='flex-1'>
                DONATE NOW
              </Button>
              <Button size='lg' variant='outline' className='flex-1'>
                LEARN ABOUT RILEY
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How Your Donation Helps Section */}
      <section className='bg-muted/50 dark:bg-muted/20 py-16'>
        <div className='container mx-auto px-4'>
          <div className='grid lg:grid-cols-2 gap-12 items-center'>
            {/* Left - Donation Breakdown */}
            <div className='aspect-video relative rounded-lg overflow-hidden'>
              <Image
                src='/images/el-impact.png'
                alt='Extra Life impact'
                fill
                className='object-cover'
              />
            </div>

            {/* Right - Text Content with Image */}
            <div className='space-y-6'>
              <h3 className='text-2xl font-bold text-foreground'>Helping a Great Cause</h3>
              <p className='text-muted-foreground leading-relaxed'>
                Regardless of what else you take away from this, just know that at the end of the
                day we&apos;re here to raise money for those in need - and <em>that&apos;s</em> what
                matters.
              </p>
              <p className='text-muted-foreground leading-relaxed'>
                Don&apos;t have money to donate? That&apos;s okay! Share the stream or the donations
                page with friends and family, hang out in chat (trust me, we need people to talk
                to!), perform magic on your own to bless the stream, what ever you like! Just know
                we appreciate that you&apos;ve cared enough to scroll this far down the page.
              </p>
              <div className='flex flex-col sm:flex-row gap-4'>
                <Button size='lg' className='flex-1'>
                  DONATE NOW
                </Button>
                <Button size='lg' variant='outline' className='flex-1'>
                  JUMP TO THE STREAM!
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Event Schedule Section */}
      <section className='py-16'>
        <div className='container mx-auto px-4'>
          <div className='grid lg:grid-cols-2 gap-12 items-start'>
            {/* Left - Event Poster with Image */}
            <div className='space-y-6'>
              <div className='relative rounded-lg overflow-hidden'>
                <Image
                  src='/images/el-flyer.jpeg'
                  alt='Extra Life flyer'
                  width={400}
                  height={600}
                  className='w-full h-auto'
                />
              </div>
            </div>

            {/* Right - How We Fit In */}
            <div className='space-y-6'>
              <h3 className='text-2xl font-bold text-foreground'>How Do We Fit In?</h3>
              {/* Total Fundraising Card */}
              <Card className='bg-gradient-to-br from-blue-600 to-purple-600 text-white border-0'>
                <CardContent className='p-6 text-center'>
                  <div className='text-4xl font-bold mb-2'>$11,008.21</div>
                  <div className='text-lg opacity-90'>Total Raised Since 2017</div>
                </CardContent>
              </Card>
              <p className='text-muted-foreground leading-relaxed'>
                2023 Marks the SEVENTH Year that Kenway has put on this 24+ Hour effort to raise
                money for Riley&apos;s Children Hospital in Indianapolis, IN.
              </p>
              <p className='text-muted-foreground leading-relaxed'>
                The names and faces attached have changed over the years, but one thing hasn&apos;t
                - the mission. Each year, 4 - 10 humans come together to put their bodies and spirit
                on the line in hopes to encourage you &ldquo;beautiful creatures of the
                internet&rdquo; to give to kids in need. Thankfully, you&apos;ve always shown up to
                show us that you care - and that&apos;s truly amazing.
              </p>
              <p className='text-muted-foreground leading-relaxed'>
                In 2020, the stream turnout was bigger than ever despite worries about attendance.
                While 2023 hasn&apos;t panned out as hoped, we continue to keep the mission alive:
                raise money for kids who need it.
              </p>

              {/* Fundraising Totals */}
              <Card>
                <CardHeader>
                  <CardTitle className='text-lg'>Fundraising Totals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-3'>
                    {[
                      { year: '2024', amount: '$2,100.00' },
                      { year: '2023', amount: '$2,157.81' },
                      { year: '2022', amount: '$2,214.00' },
                      { year: '2021', amount: '$2,154.17' },
                      { year: '2020', amount: '$1,528.65' },
                      { year: '2019', amount: '$392.90' },
                      { year: '2018', amount: '$354.68' },
                      { year: '2017', amount: '$105.00' },
                    ].map((item) => (
                      <div key={item.year} className='flex justify-between items-center'>
                        <span className='font-medium text-blue-600 dark:text-blue-400'>
                          {item.year}
                        </span>
                        <span className='font-bold text-foreground'>{item.amount}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Button size='lg' className='w-full'>
                DONATE NOW
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
