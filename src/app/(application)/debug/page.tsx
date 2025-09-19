'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useMutation } from 'convex/react';
import {
  TrashIcon,
  RefreshCwIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  DatabaseIcon,
} from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import {
  forceRefreshStatic,
  fetchStaticData,
  fetchRealTimeData,
  forceAPICall,
  useDonorDriveDebug,
  useLastApiCallInfo,
  useUpdateLastApiCall,
} from '@/utils/donor-drive-optimized';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  const debugMutation = useDonorDriveDebug();
  const lastApiCallInfo = useLastApiCallInfo();
  const updateLastApiCall = useUpdateLastApiCall();
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isForcingAPI, setIsForcingAPI] = useState(false);
  const [apiPayloadData, setApiPayloadData] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Pagination calculations
  const totalItems = debugData?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = debugData?.slice(startIndex, endIndex) || [];

  // Reset to page 1 when items per page changes
  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(parseInt(value));
    setCurrentPage(1);
  };

  // Reset to page 1 when data changes (e.g., after clearing)
  React.useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

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

  const handleRefreshStatic = async () => {
    setIsRefreshing(true);
    try {
      // Force refresh static data
      forceRefreshStatic();

      // Invalidate and refetch static data query
      const donorDriveId = process.env.NEXT_PUBLIC_DONORDRIVE_ID;
      await queryClient.invalidateQueries({
        queryKey: ['staticData', donorDriveId],
      });

      console.log('✅ Static data refresh triggered');
    } catch (error) {
      console.error('Failed to refresh static data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleForceAPICall = async () => {
    setIsForcingAPI(true);
    setApiPayloadData(null);

    try {
      const donorDriveId = process.env.NEXT_PUBLIC_DONORDRIVE_ID;
      if (!donorDriveId) {
        console.error('No donor drive ID found');
        return;
      }

      // Force fresh API calls by clearing ETags and bypassing timestamp check
      forceAPICall();
      console.log('🚀 Forcing fresh API calls...');

      // Force static data call
      const staticResult = await fetchStaticData(
        donorDriveId,
        debugMutation,
        updateLastApiCall
      );

      // Force real-time data call
      const realTimeResult = await fetchRealTimeData(
        donorDriveId,
        debugMutation,
        updateLastApiCall,
        lastApiCallInfo
      );

      // Combine results for display
      const combinedPayload = {
        timestamp: new Date().toISOString(),
        participantId: donorDriveId,
        staticData: staticResult,
        realTimeData: realTimeResult,
        note: 'This payload shows all data returned from Extra Life API calls',
      };

      setApiPayloadData(combinedPayload);
      console.log('✅ Forced API calls completed', combinedPayload);
    } catch (error) {
      console.error('❌ Failed to force API calls:', error);
      setApiPayloadData({
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      });
    } finally {
      setIsForcingAPI(false);
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
            <h1 className='text-3xl font-bold text-foreground'>
              DonorDrive API Debug
            </h1>
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
          <div>
            <h1 className='text-3xl font-bold text-foreground'>
              DonorDrive API Debug
            </h1>
            <div className='mt-2 text-sm text-muted-foreground'>
              {lastApiCallInfo?.timestamp
                ? `Last API call: ${lastApiCallInfo.secondsAgo}s ago`
                : 'No API calls yet'}
            </div>
          </div>
          <div className='flex gap-3'>
            <Button
              variant='outline'
              onClick={handleRefreshStatic}
              disabled={isRefreshing || isForcingAPI}
              className='flex items-center gap-2 border-primary/20 text-primary hover:bg-primary/10 hover:text-primary'
            >
              <DatabaseIcon
                className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`}
              />
              {isRefreshing ? 'Refreshing...' : 'Refresh Static Data'}
            </Button>
            <Button
              variant='outline'
              onClick={handleForceAPICall}
              disabled={isForcingAPI || isRefreshing}
              className='flex items-center gap-2 border-orange-300 text-orange-600 hover:bg-orange/10 hover:text-orange-700'
            >
              <RefreshCwIcon
                className={`h-4 w-4 ${isForcingAPI ? 'animate-spin' : ''}`}
              />
              {isForcingAPI ? 'Forcing API...' : 'Force API Call'}
            </Button>
            <Button
              variant='outline'
              onClick={handleClear}
              className='flex items-center gap-2 border-border text-muted-foreground hover:bg-muted hover:text-foreground'
            >
              <TrashIcon className='h-4 w-4' />
              Clear All
            </Button>
          </div>
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
            {/* API Payload Display */}
            {apiPayloadData && (
              <Card className='bg-card border-border'>
                <CardHeader className='border-b border-border'>
                  <div className='flex items-center justify-between'>
                    <CardTitle className='text-lg text-foreground'>
                      Extra Life API Payload
                    </CardTitle>
                    <div className='flex items-center gap-2'>
                      <Badge variant='outline'>
                        {new Date(
                          apiPayloadData.timestamp
                        ).toLocaleString()}
                      </Badge>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => setApiPayloadData(null)}
                        className='h-8 w-8 p-0'
                      >
                        ×
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className='p-0'>
                  <div className='bg-zinc-950 rounded-lg m-4 p-4 border border-border'>
                    <JSONViewer data={apiPayloadData} />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Logs Table */}
            <Card className='bg-zinc-950/90 border-border'>
              <CardHeader className='border-b border-border'>
                <div className='flex items-center justify-between'>
                  <CardTitle className='text-lg text-foreground'>
                    API Call Logs
                  </CardTitle>
                  <div className='flex items-center gap-2'>
                    <span className='text-sm text-muted-foreground'>
                      Show
                    </span>
                    <Select
                      value={itemsPerPage.toString()}
                      onValueChange={handleItemsPerPageChange}
                    >
                      <SelectTrigger className='w-20 h-8'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='5'>5</SelectItem>
                        <SelectItem value='10'>10</SelectItem>
                        <SelectItem value='25'>25</SelectItem>
                        <SelectItem value='50'>50</SelectItem>
                        <SelectItem value='100'>100</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className='p-0'>
                <Table>
                  <TableHeader>
                    <TableRow className='border-border hover:bg-muted/50'>
                      <TableHead className='text-muted-foreground font-medium'>
                        Timestamp
                      </TableHead>
                      <TableHead className='text-muted-foreground font-medium'>
                        API Endpoint
                      </TableHead>
                      <TableHead className='text-muted-foreground font-medium'>
                        Data Type
                      </TableHead>
                      <TableHead className='w-20 text-muted-foreground font-medium'></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedData.map((entry) => {
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
                                  {formatDistanceToNow(timestamp, {
                                    addSuffix: true,
                                  })}
                                  )
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
                            <TableRow
                              key={`${entry._id}-expanded`}
                              className='border-border'
                            >
                              <TableCell
                                colSpan={4}
                                className='p-0'
                              >
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
                                          <JSONViewer
                                            data={entry.topDonation}
                                          />
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
                                          <JSONViewer
                                            data={entry.topDonor}
                                          />
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
                                          <JSONViewer
                                            data={entry.latestDonations}
                                          />
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
              {totalPages > 1 && (
                <div className='border-t border-border px-6 py-4'>
                  <div className='flex items-center justify-between'>
                    <div className='text-sm text-muted-foreground'>
                      Showing {startIndex + 1} to{' '}
                      {Math.min(endIndex, totalItems)} of {totalItems}{' '}
                      entries
                    </div>
                    <div className='flex items-center gap-2'>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                        className='h-8 px-2'
                      >
                        First
                      </Button>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() =>
                          setCurrentPage(Math.max(1, currentPage - 1))
                        }
                        disabled={currentPage === 1}
                        className='h-8 px-2'
                      >
                        Previous
                      </Button>

                      {/* Page numbers */}
                      <div className='flex items-center gap-1'>
                        {Array.from(
                          { length: Math.min(5, totalPages) },
                          (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) {
                              pageNum = i + 1;
                            } else if (currentPage <= 3) {
                              pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                              pageNum = totalPages - 4 + i;
                            } else {
                              pageNum = currentPage - 2 + i;
                            }

                            return (
                              <Button
                                key={pageNum}
                                variant={
                                  currentPage === pageNum
                                    ? 'default'
                                    : 'outline'
                                }
                                size='sm'
                                onClick={() => setCurrentPage(pageNum)}
                                className='h-8 w-8 p-0'
                              >
                                {pageNum}
                              </Button>
                            );
                          }
                        )}
                      </div>

                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() =>
                          setCurrentPage(
                            Math.min(totalPages, currentPage + 1)
                          )
                        }
                        disabled={currentPage === totalPages}
                        className='h-8 px-2'
                      >
                        Next
                      </Button>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={currentPage === totalPages}
                        className='h-8 px-2'
                      >
                        Last
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
