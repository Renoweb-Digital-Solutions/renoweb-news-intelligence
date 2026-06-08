"use client";

import { useState } from "react";
import ClayCard from "../ui/ClayCard";

export default function ActionsSection() {
    const [maxArticles, setMaxArticles] = useState(40);
    const [forceResummarize, setForceResummarize] = useState(true);

    return (
        <ClayCard>
            <div className="space-y-8">
                <h2 className="text-xl font-semibold mb-6 text-slate-800">
                    4. Load existing / Fetch live / Summarize
                </h2>

                {/* Slider + Force Toggle */}
                <div className="grid md:grid-cols-2 gap-8 items-start">
                    {/* Slider Section */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-sm font-medium text-slate-500">
                                Summaries to generate (max_articles)
                            </label>
                            <span className="text-emerald-600 font-bold">
                                {maxArticles}
                            </span>
                        </div>

                        <input
                            type="range"
                            min={1}
                            max={100}
                            value={maxArticles}
                            onChange={(e) =>
                                setMaxArticles(Number(e.target.value))
                            }
                            className="w-full accent-emerald-500 cursor-pointer"
                        />
                    </div>

                    {/* Force Checkbox */}
                    <div className="flex items-center gap-3 mt-6 md:mt-2">
                        <input
                            type="checkbox"
                            checked={forceResummarize}
                            onChange={() =>
                                setForceResummarize(!forceResummarize)
                            }
                            className="h-5 w-5 accent-emerald-500"
                        />
                        <label className="text-sm font-medium text-slate-600 cursor-pointer" onClick={() => setForceResummarize(!forceResummarize)}>
                            Force re-summarize (overwrite existing)
                        </label>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="grid md:grid-cols-4 gap-4 pt-4">
                    <button className="clay-btn-secondary py-3 flex items-center justify-center font-semibold rounded-xl">
                        Check DB
                    </button>

                    <button className="clay-btn-secondary py-3 text-emerald-700 bg-emerald-50 flex items-center justify-center font-semibold rounded-xl">
                        Load from DB
                    </button>

                    <button className="clay-btn bg-teal-500 py-3 flex items-center justify-center font-semibold rounded-xl hover:bg-teal-600">
                        Fetch live (news only)
                    </button>

                    <button className="clay-btn py-3 flex items-center justify-center font-semibold rounded-xl">
                        Summarize (target {maxArticles})
                    </button>
                </div>
            </div>
        </ClayCard>
    );
}