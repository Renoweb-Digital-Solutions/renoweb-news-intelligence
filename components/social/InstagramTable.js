"use client";

import { useReactTable, getCoreRowModel, getPaginationRowModel, flexRender } from "@tanstack/react-table";
import { useMemo } from "react";
import ClayCard from "../ui/ClayCard";

export default function InstagramTable({ data = [] }) {
    const columns = useMemo(
        () => [
            { header: "Query", accessorKey: "query" },
            { 
                header: "Caption", 
                accessorKey: "caption",
                cell: ({ getValue }) => {
                    const val = getValue();
                    return val ? (val.length > 100 ? val.substring(0, 100) + "..." : val) : "-";
                }
            },
            { header: "Owner", accessorKey: "ownerUsername" },
            { header: "Likes", accessorKey: "likesCount" },
            { header: "Comments", accessorKey: "commentsCount" },
            { 
                header: "Date", 
                accessorKey: "timestamp", 
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
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: { pageSize: 10 }
        }
    });

    return (
        <ClayCard>
            <h2 className="text-lg font-semibold text-[#191919] mb-6">Instagram Results</h2>
            {data.length === 0 ? (
                <div className="text-sm text-[var(--muted)] p-8 border-2 border-dashed border-[var(--border)] rounded-lg text-center bg-white">No results.</div>
            ) : (
                <div className="overflow-x-auto rounded-lg border-2 border-[var(--border)] bg-white shadow-[4px_4px_0_var(--border)]">
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
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t-2 border-[var(--border)] bg-[var(--background)]">
                            <div className="text-sm text-[var(--muted)] font-medium">
                                Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => table.previousPage()}
                                    disabled={!table.getCanPreviousPage()}
                                    className="neo-btn-secondary px-3 py-1.5 text-sm disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => table.nextPage()}
                                    disabled={!table.getCanNextPage()}
                                    className="neo-btn-secondary px-3 py-1.5 text-sm disabled:opacity-50"
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
