"use client";

import {
    useReactTable,
    getCoreRowModel,
    flexRender,
} from "@tanstack/react-table";
import { useMemo } from "react";
import ClayCard from "../ui/ClayCard";

export default function NewsTable() {
    const data = useMemo(
        () => [
            {
                keyword: "B2B SaaS",
                title: "Acme raises Series C",
                source: "TechCrunch",
                published_at: "2026-02-18",
                summary: "Funding announcement.\nExplains valuation impact.",
            },
        ],
        []
    );

    const columns = useMemo(
        () => [
            { header: "Keyword", accessorKey: "keyword" },
            { header: "Title", accessorKey: "title" },
            { header: "Source", accessorKey: "source" },
            { header: "Date", accessorKey: "published_at" },
            { header: "Summary", accessorKey: "summary" },
        ],
        []
    );

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <ClayCard>
            <h2 className="text-xl font-semibold mb-6 text-slate-800">Results</h2>

            <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-sm border-separate border-spacing-0">
                    <thead className="text-slate-500 text-xs uppercase tracking-wider bg-slate-50">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        className="text-left font-semibold py-4 px-6 border-b border-slate-200"
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
                            <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                                {row.getVisibleCells().map((cell) => (
                                    <td key={cell.id} className="py-4 px-6 border-b border-slate-100 text-slate-700 whitespace-pre-wrap">
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

                {/* TODO:
                  Add sorting
                  Add filtering
                  Add pagination
                  Add link click
                  Expandable row for summary
                */}
            </div>
        </ClayCard>
    );
}