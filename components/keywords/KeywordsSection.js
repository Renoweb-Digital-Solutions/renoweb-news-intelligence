"use client";

import { useState } from "react";
import { X, Plus } from "lucide-react";
import ClayCard from "../ui/ClayCard";

export default function KeywordsSection({ keywords, setKeywords }) {
    const [newKeyword, setNewKeyword] = useState("");

    const removeKeyword = (kw) => {
        setKeywords(keywords.filter((k) => k !== kw));
    };

    const addKeyword = () => {
        const trimmed = newKeyword.trim();

        if (!trimmed) return;
        if (keywords.includes(trimmed)) {
            setNewKeyword("");
            return;
        }

        setKeywords([...keywords, trimmed]);
        setNewKeyword("");
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addKeyword();
        }
    };

    return (
        <ClayCard>
            <div className="flex items-center gap-3 mb-6">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--rw-yellow)] text-[#191919] text-sm font-black border-2 border-[#191919] shadow-[2px_2px_0_#191919]">2</span>
                <h2 className="text-lg font-semibold text-[#191919]">
                    Selected Keywords
                </h2>
                {keywords.length > 0 && (
                    <span className="ml-auto text-xs font-medium text-[var(--muted)] bg-[var(--background)] px-2.5 py-1 rounded-full">
                        {keywords.length} selected
                    </span>
                )}
            </div>

            {/* Empty state */}
            {keywords.length === 0 && (
                <div className="text-sm text-[var(--muted)] mb-4 p-6 border border-dashed border-[var(--border)] rounded-xl text-center">
                    No keywords yet. Generate suggestions above or add your own below.
                </div>
            )}

            {/* Selected keywords */}
            <div className="flex flex-wrap gap-2">
                {keywords.map((kw) => (
                    <div
                        key={kw}
                        className="flex items-center gap-1.5 px-3 py-1.5 border border-[#4460ef]/15 bg-[#f0f3ff] text-[#4460ef] rounded-lg text-sm font-medium transition-all hover:bg-[#e4e9ff]"
                    >
                        {kw}
                        <button
                            onClick={() => removeKeyword(kw)}
                            className="text-[#4460ef]/40 hover:text-red-500 transition-colors ml-0.5"
                        >
                            <X size={14} />
                        </button>
                    </div>
                ))}
            </div>

            {/* Add custom keyword */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <input
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Add custom keyword"
                    className="neo-input flex-1 min-w-0 px-3.5 py-2.5"
                />

                <button
                    onClick={addKeyword}
                    className="neo-btn-secondary px-5 py-2.5 flex items-center justify-center gap-2 whitespace-nowrap text-sm w-full sm:w-auto"
                >
                    <Plus size={16} />
                    Add
                </button>
            </div>
        </ClayCard>
    );
}