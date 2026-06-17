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
    const [redditNsfw, setRedditNsfw] = useState(false);

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
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--rw-yellow)] text-[#191919] text-sm font-black border-2 border-[#191919] shadow-[2px_2px_0_#191919]">8</span>
                <h2 className="text-lg font-semibold text-[#191919]">Social Intelligence</h2>
            </div>

            <div className="flex flex-wrap gap-2 sm:gap-4 mb-6 border-b-[3px] border-[var(--border)] pb-6">
                {["instagram", "youtube", "reddit"].map(p => (
                    <button
                        key={p}
                        onClick={() => setActivePlatform(p)}
                        className={`px-3 sm:px-6 py-2 border-2 border-[var(--border)] rounded-md text-sm font-black uppercase tracking-wider transition-all ${activePlatform === p ? "bg-[var(--rw-sky)] text-[#191919] shadow-[3px_3px_0_var(--border)] translate-x-[-2px] translate-y-[-2px]" : "bg-white text-[#191919] hover:bg-[#f0f0f0] shadow-[1px_1px_0_var(--border)] hover:shadow-[2px_2px_0_var(--border)] translate-x-0 translate-y-0"}`}
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
                        className="neo-input px-3.5 py-2.5 w-full bg-white"
                    >
                        {keywords.length === 0 ? <option value="">No keywords</option> : keywords.map(k => <option key={k} value={k}>{k}</option>)}
                    </select>
                </div>

                {activePlatform === "instagram" && (
                    <>
                        <div>
                            <label className="text-xs font-medium text-[var(--muted)] mb-1.5 block uppercase tracking-wider">Type</label>
                            <select value={instaType} onChange={e => setInstaType(e.target.value)} className="neo-input px-3.5 py-2.5 w-full bg-white">
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
                            <select value={ytDateFilter} onChange={e => setYtDateFilter(e.target.value)} className="neo-input px-3.5 py-2.5 w-full bg-white">
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
                            <select value={redditSort} onChange={e => setRedditSort(e.target.value)} className="neo-input px-3.5 py-2.5 w-full bg-white">
                                <option value="top">Top</option>
                                <option value="hot">Hot</option>
                                <option value="new">New</option>
                                <option value="comments">Comments</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-[var(--muted)] mb-1.5 block uppercase tracking-wider">Time</label>
                            <select value={redditTime} onChange={e => setRedditTime(e.target.value)} className="neo-input px-3.5 py-2.5 w-full bg-white">
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
                        <div className="flex items-center h-[42px] md:mt-6 mt-0">
                            <input 
                                type="checkbox" 
                                id="redditNsfw" 
                                checked={redditNsfw} 
                                onChange={e => setRedditNsfw(e.target.checked)} 
                                className="w-4 h-4 text-[#4460ef] bg-white border-2 border-[var(--border)] rounded focus:ring-[#4460ef]"
                            />
                            <label htmlFor="redditNsfw" className="ml-2 text-xs font-medium text-[#191919] cursor-pointer">Include NSFW</label>
                        </div>
                    </>
                )}
            </div>

            <button 
                onClick={handleSearch}
                disabled={loadingAction !== null || keywords.length === 0}
                className="neo-btn py-2.5 px-6 text-sm disabled:opacity-50"
            >
                {loadingAction ? `Searching ${activePlatform}...` : `Search ${activePlatform}`}
            </button>

            <AnimatePresence>
                {loadingAction && <ProgressLog action={loadingAction} />}
            </AnimatePresence>
        </ClayCard>
    );
}
