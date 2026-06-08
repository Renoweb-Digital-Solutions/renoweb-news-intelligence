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
            <h2 className="text-xl font-semibold mb-6 text-slate-800">
                2. Selected Keywords
            </h2>

            {/* Empty state */}
            {keywords.length === 0 && (
                <div className="text-sm font-medium text-slate-500 mb-4 p-4 clay-input text-center">
                    No keywords yet. Generate suggestions above.
                </div>
            )}

            {/* Selected keywords */}
            <div className="flex flex-wrap gap-3">
                {keywords.map((kw) => (
                    <div
                        key={kw}
                        className="flex items-center gap-2 px-4 py-2 border border-emerald-500/20 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium shadow-sm transition-all hover:bg-emerald-100"
                    >
                        {kw}
                        <button
                            onClick={() => removeKeyword(kw)}
                            className="text-emerald-600/50 hover:text-red-500 transition-colors"
                        >
                            <X size={16} />
                        </button>
                    </div>
                ))}
            </div>

            {/* Add custom keyword */}
            <div className="mt-8 flex gap-4">
                <input
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Add custom keyword"
                    className="clay-input flex-1 p-3"
                />

                <button
                    onClick={addKeyword}
                    className="clay-btn px-6 flex items-center gap-2 whitespace-nowrap"
                >
                    <Plus size={18} />
                    Add Keyword
                </button>
            </div>
        </ClayCard>
    );
}