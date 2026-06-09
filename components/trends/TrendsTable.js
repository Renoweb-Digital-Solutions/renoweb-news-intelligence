"use client";

import React, { useMemo, useState } from "react";
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
} from "@tanstack/react-table";
import { ChevronDown, ChevronRight } from "lucide-react";
import ClayCard from "../ui/ClayCard";

export default function TrendsTable({ data = [] }) {
    const [expanded, setExpanded] = useState({});

    const columns = useMemo(
        () => [
            {
                id: 'expander',
                header: () => null,
                cell: ({ row }) => {
                    const hasRelated = row.original.related_queries?.rising?.length || row.original.related_queries?.top?.length;
                    if (!hasRelated) return null;
                    return (
                        <button
                            onClick={row.getToggleExpandedHandler()}
                            className="p-1 hover:bg-[#f0f3ff] rounded text-[var(--muted)] hover:text-[#4460ef] transition-colors"
                        >
                            {row.getIsExpanded() ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </button>
                    )
                },
            },
            { header: "Keyword", accessorKey: "keyword" },
            { header: "Score", accessorKey: "google_trends_score" },
            { header: "Current", accessorKey: "current_interest" },
            { header: "Avg", accessorKey: "avg_interest" },
            { header: "Peak", accessorKey: "peak_interest" },
            { 
                header: "Growth Rate", 
                accessorKey: "growth_rate",
                cell: ({ getValue }) => {
                    const val = getValue();
                    if (val === null || val === undefined) return "-";
                    return <span className={val > 0 ? "text-green-600 font-medium" : val < 0 ? "text-red-600 font-medium" : ""}>{val}%</span>;
                }
            },
            { header: "Geo", accessorKey: "geo" },
            { header: "Timeframe", accessorKey: "timeframe" },
        ],
        []
    );

    const table = useReactTable({
        data,
        columns,
        state: {
            expanded,
        },
        onExpandedChange: setExpanded,
        getRowCanExpand: (row) => row.original.related_queries?.rising?.length || row.original.related_queries?.top?.length,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <ClayCard>
            <div className="flex items-center gap-3 mb-6">
                <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#f0f3ff] text-[#4460ef] text-xs font-bold">5</span>
                <h2 className="text-lg font-semibold text-[#191919]">Trends Score</h2>
                {data.length > 0 && (
                    <span className="ml-auto text-xs font-medium text-[var(--muted)] bg-[var(--background)] px-2.5 py-1 rounded-full">
                        {data.length} keywords
                    </span>
                )}
            </div>

            {data.length === 0 ? (
                <div className="text-sm text-[var(--muted)] p-8 border border-dashed border-[var(--border)] rounded-xl text-center">
                    No trends fetched yet.
                </div>
            ) : (
                <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
                    <table className="w-full text-sm border-separate border-spacing-0">
                        <thead className="text-[var(--muted)] text-xs uppercase tracking-wider bg-[var(--background)]">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <th key={header.id} className="text-left font-semibold py-3 px-4 border-b border-[var(--border)]">
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody className="bg-white">
                            {table.getRowModel().rows.map((row) => (
                                <React.Fragment key={row.id}>
                                    <tr className="hover:bg-[#f8f9fc] transition-colors">
                                        {row.getVisibleCells().map((cell) => (
                                            <td key={cell.id} className="py-3 px-4 border-b border-[var(--border)]/50 text-[#191919] whitespace-pre-wrap text-sm">
                                                {flexRender(cell.column.columnDef.cell ?? cell.column.columnDef.accessorKey, cell.getContext())}
                                            </td>
                                        ))}
                                    </tr>
                                    {row.getIsExpanded() && (
                                        <tr className="bg-[#fcfdff]">
                                            <td colSpan={columns.length} className="px-10 py-4 border-b border-[var(--border)]/50">
                                                <div className="flex gap-10">
                                                    {row.original.related_queries?.rising?.length > 0 && (
                                                        <div>
                                                            <h4 className="font-semibold text-xs text-[var(--muted)] uppercase mb-2">Rising Queries</h4>
                                                            <ul className="text-sm space-y-1">
                                                                {row.original.related_queries.rising.map((q, i) => (
                                                                    <li key={i} className="flex justify-between gap-4">
                                                                        <span>{q.query}</span>
                                                                        <span className="font-medium text-[#4460ef]">{q.value}</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                    {row.original.related_queries?.top?.length > 0 && (
                                                        <div>
                                                            <h4 className="font-semibold text-xs text-[var(--muted)] uppercase mb-2">Top Queries</h4>
                                                            <ul className="text-sm space-y-1">
                                                                {row.original.related_queries.top.map((q, i) => (
                                                                    <li key={i} className="flex justify-between gap-4">
                                                                        <span>{q.query}</span>
                                                                        <span className="font-medium text-[var(--muted)]">{q.value}</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </ClayCard>
    );
}
