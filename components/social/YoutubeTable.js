"use client";

import { useReactTable, getCoreRowModel, getSortedRowModel, getPaginationRowModel, flexRender } from "@tanstack/react-table";
import { useMemo } from "react";
import ClayCard from "../ui/ClayCard";

export default function YoutubeTable({ data = [] }) {
    const columns = useMemo(
        () => [
            { header: "Query", accessorKey: "query" },
            { 
                header: "Title", 
                accessorKey: "title",
                cell: ({ getValue }) => {
                    const val = getValue();
                    return val ? (val.length > 80 ? val.substring(0, 80) + "..." : val) : "-";
                }
            },
            { header: "Channel", accessorKey: "channelName" },
            { header: "Views", accessorKey: "viewCount" },
            { header: "Likes", accessorKey: "likes" },
            { header: "Subscribers", accessorKey: "numberOfSubscribers" },
            { header: "Duration", accessorKey: "duration" },
            { 
                header: "Date", 
                accessorKey: "date", 
                cell: ({ getValue }) => {
                    const val = getValue();
                    if (!val) return "-";
                    return new Date(val).toLocaleDateString();
                }
            },
            { 
                header: "Link", 
                accessorKey: "url",
                cell: ({ getValue }) => <a href={getValue()} target="_blank" rel="noreferrer" className="text-[#4460ef] hover:underline">View</a>
            },
        ],
        []
    );

    const table = useReactTable({ 
        data, 
        columns, 
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            sorting: [{ id: "viewCount", desc: true }],
            pagination: { pageSize: 10 }
        }
    });

    return (
        <ClayCard>
            <h2 className="text-lg font-semibold text-[#191919] mb-6">YouTube Results</h2>
            {data.length === 0 ? (
                <div className="text-sm text-[var(--muted)] p-8 border border-dashed border-[var(--border)] rounded-xl text-center">No results.</div>
            ) : (
                <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
                    <table className="w-full text-sm border-separate border-spacing-0">
                        <thead className="text-[var(--muted)] text-xs uppercase tracking-wider bg-[var(--background)]">
                            {table.getHeaderGroups().map(hg => (
                                <tr key={hg.id}>
                                    {hg.headers.map(h => <th key={h.id} className="text-left font-semibold py-3 px-4 border-b border-[var(--border)]">{flexRender(h.column.columnDef.header, h.getContext())}</th>)}
                                </tr>
                            ))}
                        </thead>
                        <tbody className="bg-white">
                            {table.getRowModel().rows.map(row => (
                                <tr key={row.id} className="hover:bg-[#f8f9fc]">
                                    {row.getVisibleCells().map(cell => <td key={cell.id} className="py-3 px-4 border-b border-[var(--border)]/50">{flexRender(cell.column.columnDef.cell ?? cell.column.columnDef.accessorKey, cell.getContext())}</td>)}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {data.length > 10 && (
                        <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--border)] bg-[var(--background)]">
                            <div className="text-sm text-[var(--muted)]">
                                Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => table.previousPage()}
                                    disabled={!table.getCanPreviousPage()}
                                    className="px-3 py-1.5 text-sm bg-white border border-[var(--border)] text-[#191919] rounded-lg disabled:opacity-50 hover:bg-[#f8f9fc] transition-colors"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => table.nextPage()}
                                    disabled={!table.getCanNextPage()}
                                    className="px-3 py-1.5 text-sm bg-white border border-[var(--border)] text-[#191919] rounded-lg disabled:opacity-50 hover:bg-[#f8f9fc] transition-colors"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </ClayCard>
    );
}
