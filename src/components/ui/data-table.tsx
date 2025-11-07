'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { ReactNode } from 'react';

interface DataTableColumn<TData> {
  accessorKey: string;
  header: ReactNode;
  cell?: (row: { original: TData }) => ReactNode;
}

interface DataTableProps<TData> {
  columns: DataTableColumn<TData>[];
  data: TData[];
}

export function DataTable<TData>({ columns, data }: DataTableProps<TData>) {
  return (
    <div className='rounded-md border'>
      <Table className='text-lg'>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.accessorKey} className='h-14 px-4'>{column.header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              {columns.map((column) => (
                <TableCell key={column.accessorKey} className='px-4 py-4'>
                  {column.cell
                    ? column.cell({ original: row })
                    : (row as Record<string, ReactNode>)[column.accessorKey]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
