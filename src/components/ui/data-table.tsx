'use client'

import type { ReactNode } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'

interface DataTableColumn<TData> {
    accessorKey: string
    cell?: (row: { original: TData }) => ReactNode
    header: ReactNode
}

interface DataTableProps<TData> {
    columns: DataTableColumn<TData>[]
    data: TData[]
}

export function DataTable<TData>({ columns, data }: DataTableProps<TData>) {
    return (
        <div className='rounded-md border'>
            <Table className='text-lg'>
                <TableHeader>
                    <TableRow>
                        {columns.map((column) => (
                            <TableHead
                                className='h-14 px-4'
                                key={column.accessorKey}
                            >
                                {column.header}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((row, index) => (
                        <TableRow key={index}>
                            {columns.map((column) => (
                                <TableCell
                                    className='px-4 py-4'
                                    key={column.accessorKey}
                                >
                                    {column.cell
                                        ? column.cell({ original: row })
                                        : (row as Record<string, ReactNode>)[
                                              column.accessorKey
                                          ]}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
