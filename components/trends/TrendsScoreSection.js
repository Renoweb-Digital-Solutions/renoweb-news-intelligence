"use client";

import { useState } from "react";
import ClayCard from "../ui/ClayCard";
import ProgressLog from "../ui/ProgressLog";

export default function TrendsScoreSection({ keywords = [], setTrendsData }) {
    const [geo, setGeo] = useState("US");
    const [timeframe, setTimeframe] = useState("now 7-d");
    const [includeRelated, setIncludeRelated] = useState(true);
    const [loading, setLoading] = useState(false);

    const handleFetchTrends = async () => {
        if (!keywords.length) {
            alert("Please add keywords first.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/trends/score", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ keywords, geo, timeframe, include_related: includeRelated })
            });
            const data = await res.json();
            if (data.error) {
                alert(`Error: ${data.error}${data.details ? ` - ${data.details}` : ''}`);
                return;
            }
            if (data.scores) {
                setTrendsData(data.scores);
            }
        } catch (error) {
            console.error("Fetch trends failed:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ClayCard>
            <div className="flex items-center gap-3 mb-6">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--rw-yellow)] text-[#191919] text-sm font-black border-2 border-[#191919] shadow-[2px_2px_0_#191919]">4</span>
                <h2 className="text-lg font-semibold text-[#191919]">
                    Google Trends Score
                </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6 items-start">
                <div>
                    <label className="text-xs font-medium text-[var(--muted)] mb-1.5 block uppercase tracking-wider">
                        Geo
                    </label>
                    <input
                        type="text"
                        value={geo}
                        onChange={(e) => setGeo(e.target.value)}
                        placeholder="e.g. US"
                        className="neo-input px-3.5 py-2.5 w-full"
                    />
                </div>

                <div>
                    <label className="text-xs font-medium text-[var(--muted)] mb-1.5 block uppercase tracking-wider">
                        Timeframe
                    </label>
                    <select
                        value={timeframe}
                        onChange={(e) => setTimeframe(e.target.value)}
                        className="neo-input px-3.5 py-2.5 w-full bg-white"
                    >
                        <option value="now 1-d">now 1-d</option>
                        <option value="now 7-d">now 7-d</option>
                        <option value="today 1-m">today 1-m</option>
                        <option value="today 3-m">today 3-m</option>
                        <option value="today 12-m">today 12-m</option>
                        <option value="today 5-y">today 5-y</option>
                    </select>
                </div>

                <div className="flex items-center gap-3 h-[42px] md:mt-[26px] mt-0">
                    <input
                        id="include-related"
                        type="checkbox"
                        checked={includeRelated}
                        onChange={() => setIncludeRelated(!includeRelated)}
                        className="h-4 w-4 rounded"
                    />
                    <label htmlFor="include-related" className="text-sm text-[#191919] cursor-pointer select-none">
                        Include Related Queries
                    </label>
                </div>
            </div>

            <button 
                onClick={handleFetchTrends}
                disabled={loading}
                className="neo-btn py-2.5 mt-6 px-6 text-sm disabled:opacity-50"
            >
                {loading ? "Fetching Trends..." : "Get Trends Score"}
            </button>
        </ClayCard>
    );
}
