"use client";

import { useState, useEffect } from "react";
import ClayCard from "../ui/ClayCard";
import { AnimatePresence } from "framer-motion";
import ProgressLog from "../ui/ProgressLog";

export default function SocialSection({ keywords = [], setInstagramData, setYoutubeData, setRedditData, activePlatform, setActivePlatform }) {
    const [selectedKeyword, setSelectedKeyword] = useState("");
    const [loadingAction, setLoadingAction] = useState(null);

    // Instagram config
    const [instaLimit, setInstaLimit] = useState(20);
    const [instaType, setInstaType] = useState("reels");

    // Youtube config
    const [ytLimit, setYtLimit] = useState(20);
    const [ytDateFilter, setYtDateFilter] = useState("year");

    // Reddit config
    const [redditLimit, setRedditLimit] = useState(30);
    const [redditSort, setRedditSort] = useState("top");
    const [redditTime, setRedditTime] = useState("week");

    useEffect(() => {
        if (keywords.length > 0 && !keywords.includes(selectedKeyword)) {
            setSelectedKeyword(keywords[0]);
        }
    }, [keywords, selectedKeyword]);

    const handleSearch = async () => {
        if (!selectedKeyword) {
            alert("Please select a keyword first.");
            return;
        }

        setLoadingAction(`search_${activePlatform}`);
        try {
            if (activePlatform === "instagram") {
                const formattedHashtag = selectedKeyword.replace(/\s+/g, '_');
                const res = await fetch("/api/social/instagram", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        hashtags: [formattedHashtag],
                        resultsLimit: instaLimit,
                        resultsType: instaType
                    })
                });
                const data = await res.json();
                if (data.error) throw new Error(`${data.error} - ${data.details || ''}`);
                setInstagramData(data.results || []);
            } else if (activePlatform === "youtube") {
                const res = await fetch("/api/social/youtube", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        query: selectedKeyword,
                        max_results: ytLimit,
                        date_filter: ytDateFilter
                    })
                });
                const data = await res.json();
                if (data.error) throw new Error(`${data.error} - ${data.details || ''}`);
                setYoutubeData(data.results || []);
            } else if (activePlatform === "reddit") {
                const res = await fetch("/api/social/reddit", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        query: selectedKeyword,
                        max_posts: redditLimit,
                        sort: redditSort,
                        time: redditTime
                    })
                });
                const data = await res.json();
                if (data.error) throw new Error(`${data.error} - ${data.details || ''}`);
                setRedditData(data.results || []);
            }
        } catch (error) {
            console.error(`${activePlatform} search failed:`, error);
            alert(`Error: ${error.message}`);
        } finally {
            setLoadingAction(null);
        }
    };

    return (
        <ClayCard>
            <div className="flex items-center gap-3 mb-6">
                <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#f0f3ff] text-[#4460ef] text-xs font-bold">8</span>
                <h2 className="text-lg font-semibold text-[#191919]">Social Intelligence</h2>
            </div>

            <div className="flex gap-4 mb-6 border-b border-[var(--border)] pb-4">
                {["instagram", "youtube", "reddit"].map(p => (
                    <button
                        key={p}
                        onClick={() => setActivePlatform(p)}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors capitalize ${activePlatform === p ? "bg-[#4460ef] text-white" : "bg-[#f0f3ff] text-[#4460ef] hover:bg-[#e4e9ff]"}`}
                    >
                        {p}
                    </button>
                ))}
            </div>

            <div className="grid md:grid-cols-4 gap-6 items-start mb-6">
                <div>
                    <label className="text-xs font-medium text-[var(--muted)] mb-1.5 block uppercase tracking-wider">Keyword</label>
                    <select
                        value={selectedKeyword}
                        onChange={(e) => setSelectedKeyword(e.target.value)}
                        className="clay-input px-3.5 py-2.5 w-full bg-white"
                    >
                        {keywords.length === 0 ? <option value="">No keywords</option> : keywords.map(k => <option key={k} value={k}>{k}</option>)}
                    </select>
                </div>

                {activePlatform === "instagram" && (
                    <>
                        <div>
                            <label className="text-xs font-medium text-[var(--muted)] mb-1.5 block uppercase tracking-wider">Type</label>
                            <select value={instaType} onChange={e => setInstaType(e.target.value)} className="clay-input px-3.5 py-2.5 w-full bg-white">
                                <option value="reels">Reels</option>
                                <option value="posts">Posts</option>
                                <option value="stories">Stories</option>
                            </select>
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-1.5">
                                <label className="text-xs font-medium text-[var(--muted)] uppercase tracking-wider">Limit</label>
                                <input type="number" min={1} max={50} value={instaLimit} onChange={e => setInstaLimit(Number(e.target.value))} className="w-12 text-xs font-bold text-[#4460ef] bg-transparent text-right outline-none appearance-none" />
                            </div>
                            <input type="range" min={1} max={50} value={instaLimit} onChange={e => setInstaLimit(Number(e.target.value))} className="w-full mt-2 cursor-pointer" />
                        </div>
                    </>
                )}

                {activePlatform === "youtube" && (
                    <>
                        <div>
                            <label className="text-xs font-medium text-[var(--muted)] mb-1.5 block uppercase tracking-wider">Date Filter</label>
                            <select value={ytDateFilter} onChange={e => setYtDateFilter(e.target.value)} className="clay-input px-3.5 py-2.5 w-full bg-white">
                                <option value="hour">Past Hour</option>
                                <option value="today">Today</option>
                                <option value="week">This Week</option>
                                <option value="month">This Month</option>
                                <option value="year">This Year</option>
                            </select>
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-1.5">
                                <label className="text-xs font-medium text-[var(--muted)] uppercase tracking-wider">Limit</label>
                                <input type="number" min={1} max={50} value={ytLimit} onChange={e => setYtLimit(Number(e.target.value))} className="w-12 text-xs font-bold text-[#4460ef] bg-transparent text-right outline-none appearance-none" />
                            </div>
                            <input type="range" min={1} max={50} value={ytLimit} onChange={e => setYtLimit(Number(e.target.value))} className="w-full mt-2 cursor-pointer" />
                        </div>
                    </>
                )}

                {activePlatform === "reddit" && (
                    <>
                        <div>
                            <label className="text-xs font-medium text-[var(--muted)] mb-1.5 block uppercase tracking-wider">Sort</label>
                            <select value={redditSort} onChange={e => setRedditSort(e.target.value)} className="clay-input px-3.5 py-2.5 w-full bg-white">
                                <option value="top">Top</option>
                                <option value="hot">Hot</option>
                                <option value="new">New</option>
                                <option value="comments">Comments</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-[var(--muted)] mb-1.5 block uppercase tracking-wider">Time</label>
                            <select value={redditTime} onChange={e => setRedditTime(e.target.value)} className="clay-input px-3.5 py-2.5 w-full bg-white">
                                <option value="day">Day</option>
                                <option value="week">Week</option>
                                <option value="month">Month</option>
                                <option value="year">Year</option>
                                <option value="all">All Time</option>
                            </select>
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-1.5">
                                <label className="text-xs font-medium text-[var(--muted)] uppercase tracking-wider">Limit</label>
                                <input type="number" min={1} max={50} value={redditLimit} onChange={e => setRedditLimit(Number(e.target.value))} className="w-12 text-xs font-bold text-[#4460ef] bg-transparent text-right outline-none appearance-none" />
                            </div>
                            <input type="range" min={1} max={50} value={redditLimit} onChange={e => setRedditLimit(Number(e.target.value))} className="w-full mt-2 cursor-pointer" />
                        </div>
                    </>
                )}
            </div>

            <button 
                onClick={handleSearch}
                disabled={loadingAction !== null || keywords.length === 0}
                className="clay-btn py-2.5 px-6 text-sm font-semibold disabled:opacity-50"
            >
                {loadingAction ? `Searching ${activePlatform}...` : `Search ${activePlatform}`}
            </button>

            <AnimatePresence>
                {loadingAction && <ProgressLog action={loadingAction} />}
            </AnimatePresence>
        </ClayCard>
    );
}
