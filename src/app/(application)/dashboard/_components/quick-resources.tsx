import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Bookmark,
  ExternalLink,
  Monitor,
  MonitorPlay as Overlay,
  Pointer as Counter,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

type resources = {
  name: string;
  link: string;
  description: string;
  icon: React.ElementType;
};

const resources = [
  {
    name: 'Extra Life Page',
    link: `https://www.extra-life.org/participants/${process.env.NEXT_PUBLIC_DONORDRIVE_ID}`,
    description: 'Donation Page',
    icon: ExternalLink,
  },
  {
    name: 'Twitch Page',
    link: 'https://www.twitch.tv/ekkolyth',
    description: 'Watch the Stream',
    icon: Monitor,
  },
  {
    name: 'Overlay',
    link: '/overlay',
    description: 'Stream Overlay',
    icon: Overlay,
  },
  {
    name: 'Donation Counter',
    link: '/counter',
    description: 'Full Screen Donation Counter',
    icon: Counter,
  },
];

export function QuickResourcesSection() {
  return (
    <Card className='border-border/50 bg-card/50 backdrop-blur-sm'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Bookmark className='h-5 w-5 text-primary' />
          Quick Resources
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3'>
          {resources.map((resource) => (
            <Button
              variant='outline'
              className='h-auto p-4 flex flex-col items-start gap-2 hover:bg-accent/10 bg-transparent'
              asChild
            >
              <Link
                key={resource.name}
                href={resource.link || '/dashboard'}
                target='_blank'
                rel='noopener noreferrer'
              >
                <div className='flex items-center gap-2 w-full'>
                  <resource.icon className='h-4 w-4 text-primary' />
                  <ExternalLink className='h-3 w-3 ml-auto text-muted-foreground' />
                </div>
                <div className='text-left'>
                  <p className='font-medium text-sm'>{resource.name}</p>
                  <p className='text-xs text-muted-foreground'>{resource.description}</p>
                </div>
              </Link>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
