"use client";

import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    flexRender,
} from "@tanstack/react-table";
import { useMemo } from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import ClayCard from "../ui/ClayCard";

export default function NewsTable({ data = [] }) {

    const columns = useMemo(
        () => [
            { header: "Keyword", accessorKey: "keyword" },
            { 
                header: "Title", 
                accessorKey: "title",
                cell: ({ row, getValue }) => {
                    const title = getValue();
                    const link = row.original.link;
                    if (link) {
                        return (
                            <a href={link} target="_blank" rel="noreferrer" className="text-[#4460ef] hover:text-[#023dbb] hover:underline font-medium">
                                {title}
                            </a>
                        );
                    }
                    return <span className="font-medium text-[#191919]">{title}</span>;
                }
            },
            { 
                header: "Source", 
                accessorKey: "source",
                cell: ({ getValue }) => {
                    const val = getValue();
                    if (!val) return "-";
                    if (typeof val === "object") return val.name || JSON.stringify(val);
                    const match = val.match(/'name':\s*"([^"]+)"|'name':\s*'([^']+)'/);
                    return match ? (match[1] || match[2]) : val;
                }
            },
            { 
                header: "Date", 
                accessorKey: "published_at",
                cell: ({ getValue }) => {
                    const val = getValue();
                    if (!val) return "-";
                    try {
                        const date = new Date(val);
                        return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
                    } catch (e) {
                        return val;
                    }
                }
            },
            { header: "GT Score", accessorKey: "google_trends_score", cell: ({ getValue }) => getValue() ?? "-" },
            { header: "Freshness", accessorKey: "freshness_score", cell: ({ getValue }) => getValue() ?? "-" },
            { header: "Trend Score", accessorKey: "trend_score", cell: ({ getValue }) => getValue() ?? "-" },
            { header: "Summary", accessorKey: "summary" },
        ],
        []
    );

    const hasTrendScore = data.length > 0 && data[0].trend_score !== undefined;

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        initialState: {
            pagination: {
                pageSize: 10,
            },
            sorting: hasTrendScore ? [{ id: "trend_score", desc: true }] : [],
        },
    });

    const pageIndex = table.getState().pagination.pageIndex;
    const pageCount = table.getPageCount();
    const totalRows = data.length;
    const startRow = pageIndex * 10 + 1;
    const endRow = Math.min((pageIndex + 1) * 10, totalRows);

    return (
        <ClayCard>
            <div className="flex items-center gap-3 mb-6">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--rw-yellow)] text-[#191919] text-sm font-black border-2 border-[#191919] shadow-[2px_2px_0_#191919]">7</span>
                <h2 className="text-lg font-semibold text-[#191919]">Results</h2>
                {data.length > 0 && (
                    <span className="ml-auto text-xs font-medium text-[var(--muted)] bg-[var(--background)] px-2.5 py-1 rounded-full">
                        {data.length} articles
                    </span>
                )}
            </div>

            {data.length === 0 ? (
                <div className="text-sm text-[var(--muted)] p-8 border-2 border-dashed border-[var(--border)] rounded-lg text-center bg-white">
                    No results yet. Use the actions above to fetch or load news.
                </div>
            ) : (
                <>
                    <div className="overflow-x-auto rounded-lg border-2 border-[var(--border)] bg-white shadow-[4px_4px_0_var(--border)]">
                        <table className="w-full text-sm border-separate border-spacing-0">
                            <thead className="text-[var(--muted)] text-xs uppercase tracking-wider bg-[var(--background)]">
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <tr key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => (
                                            <th
                                                key={header.id}
                                                className="text-left font-semibold py-3 px-4 border-b border-[var(--border)]"
                                            >
                                                {flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>

                            <tbody className="bg-white">
                                {table.getRowModel().rows.map((row) => (
                                    <tr key={row.id} className="hover:bg-[#f8f9fc] transition-colors">
                                        {row.getVisibleCells().map((cell) => (
                                            <td key={cell.id} className="py-3 px-4 border-b border-[var(--border)]/50 text-[#191919] whitespace-pre-wrap text-sm">
                                                {flexRender(
                                                    cell.column.columnDef.cell ?? cell.column.columnDef.accessorKey,
                                                    cell.getContext()
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between mt-4 px-1">
                        <span className="text-xs text-[var(--muted)]">
                            Showing {startRow}–{endRow} of {totalRows}
                        </span>

                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => table.setPageIndex(0)}
                                disabled={!table.getCanPreviousPage()}
                                className="p-1.5 rounded-lg text-[var(--muted)] hover:bg-[#f0f3ff] hover:text-[#4460ef] disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[var(--muted)] transition-colors"
                                title="First page"
                            >
                                <ChevronsLeft size={16} />
                            </button>
                            <button
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                                className="p-1.5 rounded-lg text-[var(--muted)] hover:bg-[#f0f3ff] hover:text-[#4460ef] disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[var(--muted)] transition-colors"
                                title="Previous page"
                            >
                                <ChevronLeft size={16} />
                            </button>

                            {/* Page numbers */}
                            <div className="flex items-center gap-0.5 mx-1">
                                {Array.from({ length: pageCount }, (_, i) => i).map((i) => (
                                    <button
                                        key={i}
                                        onClick={() => table.setPageIndex(i)}
                                        className={`min-w-[32px] h-8 rounded-lg text-xs font-semibold transition-colors ${
                                            pageIndex === i
                                                ? "bg-[#4460ef] text-white shadow-sm"
                                                : "text-[var(--muted)] hover:bg-[#f0f3ff] hover:text-[#4460ef]"
                                        }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                                className="p-1.5 rounded-lg text-[var(--muted)] hover:bg-[#f0f3ff] hover:text-[#4460ef] disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[var(--muted)] transition-colors"
                                title="Next page"
                            >
                                <ChevronRight size={16} />
                            </button>
                            <button
                                onClick={() => table.setPageIndex(pageCount - 1)}
                                disabled={!table.getCanNextPage()}
                                className="p-1.5 rounded-lg text-[var(--muted)] hover:bg-[#f0f3ff] hover:text-[#4460ef] disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[var(--muted)] transition-colors"
                                title="Last page"
                            >
                                <ChevronsRight size={16} />
                            </button>
                        </div>
                    </div>
                </>
            )}
        </ClayCard>
    );
}