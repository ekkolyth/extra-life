import Image from 'next/image'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <main className="flex flex-col">
      <section className="relative h-[400px] w-full flex items-center justify-center">
        <Image
          src="https://images.unsplash.com/photo-1529257414770-1960ae0a1ed6?auto=format&fit=crop&w=1200&q=80"
          alt="Extra Life hero"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
            Play Games to Change Kids&apos; Health to Change the Future
          </h1>
        </div>
      </section>

      <section className="container max-w-4xl py-20 space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">What Is Extra Life?</h2>
        <p className="text-lg text-muted-foreground">
          Extra Life is a fundraising program of Children&apos;s Miracle Network Hospitals. The Extra Life community
          fundraises year-round to Change Kids&apos; Health to Change the Future. Donations to member children&apos;s
          hospitals fund critical life-saving treatments and healthcare services, along with innovative research,
          vital pediatric medical equipment and charitable care.
        </p>
        <p className="text-lg text-muted-foreground">
          Since its inception in 2008, Extra Life has raised over $100 million USD to Change Kids&apos; Health to Change the Future.
        </p>
        <div className="flex flex-col gap-4 pt-4 sm:flex-row">
          <Button asChild>
            <a href="https://www.extra-life.org/" target="_blank" rel="noopener noreferrer">
              Donate Now
            </a>
          </Button>
          <Button variant="outline" asChild>
            <a href="https://www.extra-life.org/" target="_blank" rel="noopener noreferrer">
              Learn About Riley
            </a>
          </Button>
        </div>
      </section>
    </main>
  )
}

