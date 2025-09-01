'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DonationsPage() {
  return (
    <div className='space-y-4'>
      <Card>
        <CardHeader>
          <CardTitle>Donations</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-2xl font-bold'>$0</p>
          <p className='text-sm text-muted-foreground'>Total raised so far</p>
        </CardContent>
      </Card>
    </div>
  );
}
