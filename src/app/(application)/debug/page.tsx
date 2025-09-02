'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useMutation } from 'convex/react';
import { TrashIcon, RefreshCwIcon, ChevronDownIcon, ChevronRightIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useState } from 'react';
import { JSONViewer } from '@/components/ui/json-viewer';
import { formatDistanceToNow } from 'date-fns';
import React from 'react';

export default function DebugPage() {
  const debugData = useQuery(api.donorDriveDebug.list);
  const clearDebug = useMutation(api.donorDriveDebug.clear);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const handleClear = async () => {
    try {
      await clearDebug();
    } catch (error) {
      console.error('Failed to clear debug data:', error);
    }
  };

  const getDataTypeColor = (dataType: string) => {
    switch (dataType) {
      case 'Stats':
        return 'bg-cyan-500 text-black';
      case 'Top Donation':
        return 'bg-cyan-500 text-black';
      case 'Top Donor':
        return 'bg-cyan-500 text-black';
      case 'Latest Donations':
        return 'bg-cyan-500 text-black';
      default:
        return 'bg-gray-500 text-black';
    }
  };

  if (!debugData) {
    return (
      <div className='min-h-screen bg-background text-foreground'>
        <div className='container mx-auto p-6'>
          <div className='flex items-center justify-between mb-8'>
            <h1 className='text-3xl font-bold text-foreground'>DonorDrive API Debug</h1>
          </div>
          <div className='text-center py-16'>
            <RefreshCwIcon className='h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground' />
            <p className='text-muted-foreground'>Loading debug data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-background text-foreground'>
      <div className='container mx-auto p-6'>
        <div className='flex items-center justify-between mb-8'>
          <h1 className='text-3xl font-bold text-foreground'>DonorDrive API Debug</h1>
          <Button
            variant='outline'
            onClick={handleClear}
            className='flex items-center gap-2 border-border text-muted-foreground hover:bg-muted hover:text-foreground'
          >
            <TrashIcon className='h-4 w-4' />
            Clear All
          </Button>
        </div>

        {debugData.length === 0 ? (
          <Card className='bg-card border-border'>
            <CardContent className='pt-8 pb-8'>
              <p className='text-center text-muted-foreground'>
                No debug data available. API calls will populate this page.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className='space-y-6'>
            {/* Summary Stats */}
            <Card className='bg-card border-border'>
              <CardHeader className='border-b border-border'>
                <CardTitle className='text-lg text-foreground'>Summary</CardTitle>
              </CardHeader>
              <CardContent className='pt-6'>
                <div className='grid grid-cols-4 gap-6 text-sm'>
                  <div>
                    <p className='text-muted-foreground mb-1'>Total Logs</p>
                    <p className='text-2xl font-bold text-foreground'>{debugData.length}</p>
                  </div>
                  <div>
                    <p className='text-muted-foreground mb-1'>Latest Call</p>
                    <p className='text-sm text-muted-foreground'>
                      {debugData[debugData.length - 1]
                        ? formatDistanceToNow(new Date(debugData[debugData.length - 1].timestamp), {
                            addSuffix: true,
                          })
                        : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className='text-muted-foreground mb-1'>API Endpoints</p>
                    <p className='text-sm text-muted-foreground'>
                      {new Set(debugData.map((d) => d.apiEndpoint)).size}
                    </p>
                  </div>
                  <div>
                    <p className='text-muted-foreground mb-1'>Data Types</p>
                    <p className='text-sm text-muted-foreground'>
                      {
                        debugData.filter(
                          (d) => d.stats || d.topDonation || d.topDonor || d.latestDonations
                        ).length
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Logs Table */}
            <Card className='bg-zinc-950/=90 border-border'>
              <CardHeader className='border-b border-border'>
                <CardTitle className='text-lg text-foreground'>API Call Logs</CardTitle>
              </CardHeader>
              <CardContent className='p-0'>
                <Table>
                  <TableHeader>
                    <TableRow className='border-border hover:bg-muted/50'>
                      <TableHead className='text-muted-foreground font-medium'>Timestamp</TableHead>
                      <TableHead className='text-muted-foreground font-medium'>
                        API Endpoint
                      </TableHead>
                      <TableHead className='text-muted-foreground font-medium'>Data Type</TableHead>
                      <TableHead className='w-20 text-muted-foreground font-medium'></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {debugData.map((entry, index) => {
                      const timestamp = new Date(entry.timestamp);
                      const dataType = entry.stats
                        ? 'Stats'
                        : entry.topDonation
                        ? 'Top Donation'
                        : entry.topDonor
                        ? 'Top Donor'
                        : entry.latestDonations
                        ? 'Latest Donations'
                        : 'Unknown';
                      const isExpanded = expandedRows.has(entry._id);

                      return (
                        <React.Fragment key={entry._id}>
                          {/* Main Row */}
                          <TableRow
                            className='border-border hover:bg-muted/50 cursor-pointer'
                            onClick={() => toggleRow(entry._id)}
                          >
                            <TableCell>
                              <div className='space-y-1'>
                                <p className='text-sm font-semibold text-foreground'>
                                  {timestamp.toLocaleDateString()}
                                </p>
                                <p className='text-xs text-muted-foreground'>
                                  {timestamp.toLocaleTimeString()} (
                                  {formatDistanceToNow(timestamp, { addSuffix: true })})
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <code className='text-sm text-muted-foreground font-mono'>
                                {entry.apiEndpoint}
                              </code>
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={`${getDataTypeColor(
                                  dataType
                                )} text-xs text-accent border-accent font-medium bg-zinc-950 px-2 py-1`}
                              >
                                {dataType}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className='flex justify-center'>
                                <Button
                                  variant='ghost'
                                  size='sm'
                                  className='size-6 p-0 text-muted-foreground hover:text-foreground hover:bg-muted'
                                >
                                  {isExpanded ? (
                                    <ChevronDownIcon className='h-4 w-4' />
                                  ) : (
                                    <ChevronRightIcon className='h-4 w-4' />
                                  )}
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>

                          {/* Expanded Data Row */}
                          {isExpanded && (
                            <TableRow key={`${entry._id}-expanded`} className='border-border'>
                              <TableCell colSpan={4} className='p-0'>
                                <div className='bg-muted/50 border-t border-border p-6'>
                                  <div className='space-y-6'>
                                    {/* Stats */}
                                    {entry.stats && (
                                      <div>
                                        <h4 className='font-semibold mb-3 text-primary flex items-center gap-2'>
                                          <div className='w-2 h-2 bg-primary rounded-full'></div>
                                          Stats
                                        </h4>
                                        <div className='bg-zinc-950 rounded-lg p-4 border border-border'>
                                          <JSONViewer data={entry.stats} />
                                        </div>
                                      </div>
                                    )}

                                    {/* Top Donation */}
                                    {entry.topDonation && (
                                      <div>
                                        <h4 className='font-semibold mb-3 text-primary flex items-center gap-2'>
                                          <div className='w-2 h-2 bg-primary rounded-full'></div>
                                          Top Donation
                                        </h4>
                                        <div className='bg-zinc-950 rounded-lg p-4 border border-border'>
                                          <JSONViewer data={entry.topDonation} />
                                        </div>
                                      </div>
                                    )}

                                    {/* Top Donor */}
                                    {entry.topDonor && (
                                      <div>
                                        <h4 className='font-semibold mb-3 text-primary flex items-center gap-2'>
                                          <div className='w-2 h-2 bg-primary rounded-full'></div>
                                          Top Donor
                                        </h4>
                                        <div className='bg-zinc-950 rounded-lg p-4 border border-border'>
                                          <JSONViewer data={entry.topDonor} />
                                        </div>
                                      </div>
                                    )}

                                    {/* Latest Donations */}
                                    {entry.latestDonations && (
                                      <div>
                                        <h4 className='font-semibold mb-3 text-primary flex items-center gap-2'>
                                          <div className='w-2 h-2 bg-primary rounded-full'></div>
                                          Latest Donations
                                        </h4>
                                        <div className='bg-zinc-950 rounded-lg p-4 border border-border'>
                                          <JSONViewer data={entry.latestDonations} />
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
