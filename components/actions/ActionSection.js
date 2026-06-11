"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import ClayCard from "../ui/ClayCard";
import ProgressLog from "../ui/ProgressLog";

export default function ActionsSection({ keywords = [], fromDate, toDate, runId, setRunId, setNewsData }) {
    const [maxArticles, setMaxArticles] = useState(40);
    const [forceResummarize, setForceResummarize] = useState(true);
    const [loadingAction, setLoadingAction] = useState(null);
    const [dbHasResult, setDbHasResult] = useState(null);

    const handleCheckDb = async () => {
        setLoadingAction("check_db");
        try {
            const res = await fetch("/api/db/has", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ keywords, from_date: fromDate, to_date: toDate, news_limit: maxArticles })
            });
            const data = await res.json();
            if (data.error) {
                alert(`Error: ${data.error}${data.details ? ` - ${data.details}` : ''}`);
                return;
            }
            setDbHasResult(data);
            alert(data.has_any ? "News found in DB!" : "No news found in DB.");
        } catch (error) {
            console.error("Check DB failed:", error);
        } finally {
            setLoadingAction(null);
        }
    };

    const handleLoadDb = async () => {
        setLoadingAction("load_db");
        try {
            const res = await fetch("/api/db/existing", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ keywords, from_date: fromDate, to_date: toDate, news_limit: maxArticles })
            });
            const data = await res.json();
            if (data.error) {
                alert(`Error: ${data.error}${data.details ? ` - ${data.details}` : ''}`);
                return;
            }
            if (data.news_table) {
                setNewsData(data.news_table);
            }
        } catch (error) {
            console.error("Load DB failed:", error);
        } finally {
            setLoadingAction(null);
        }
    };

    const handleFetchNewsTrends = async () => {
        setLoadingAction("fetch_news_trends");
        try {
            const res = await fetch("/api/news/aggregate-with-trends", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ run_id: runId, keywords, from_date: fromDate, to_date: toDate })
            });
            const data = await res.json();
            if (data.error) {
                alert(`Error: ${data.error}${data.details ? ` - ${data.details}` : ''}`);
                return;
            }
            if (data.news_table) setNewsData(data.news_table);
            if (data.run_id !== undefined) setRunId(data.run_id);
        } catch (error) {
            console.error("Fetch news trends failed:", error);
        } finally {
            setLoadingAction(null);
        }
    };

    const handleFetchLive = async () => {
        setLoadingAction("fetch_live");
        try {
            const res = await fetch("/api/news/aggregate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ run_id: runId, keywords, from_date: fromDate, to_date: toDate })
            });
            const data = await res.json();
            if (data.error) {
                alert(`Error: ${data.error}${data.details ? ` - ${data.details}` : ''}`);
                return;
            }
            if (data.news_table) setNewsData(data.news_table);
            if (data.run_id !== undefined) setRunId(data.run_id);
        } catch (error) {
            console.error("Fetch live failed:", error);
        } finally {
            setLoadingAction(null);
        }
    };

    const handleSummarize = async () => {
        setLoadingAction("summarize");
        try {
            const res = await fetch("/api/news/summarize", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ run_id: runId, max_articles: maxArticles, force: forceResummarize })
            });
            const data = await res.json();
            if (data.error) {
                alert(`Error: ${data.error}${data.details ? ` - ${data.details}` : ''}`);
                return;
            }
            if (data.news_table) setNewsData(data.news_table);
            if (data.run_id !== undefined) setRunId(data.run_id);
            alert(`Summarized: ${data.summarized}, Skipped: ${data.skipped}, Failed: ${data.failed}`);
        } catch (error) {
            console.error("Summarize failed:", error);
        } finally {
            setLoadingAction(null);
        }
    };

    return (
        <ClayCard>
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--rw-yellow)] text-[#191919] text-sm font-black border-2 border-[#191919] shadow-[2px_2px_0_#191919]">6</span>
                    <h2 className="text-lg font-semibold text-[#191919]">
                        Actions
                    </h2>
                </div>

                {/* Controls row */}
                <div className="grid md:grid-cols-2 gap-6 items-start">
                    {/* Slider Section */}
                    <div>
                        <div className="flex justify-between items-center mb-1.5">
                            <label className="text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                                Max articles to summarize
                            </label>
                            <input
                                type="number"
                                min={1}
                                max={100}
                                value={maxArticles}
                                onChange={(e) => setMaxArticles(Number(e.target.value))}
                                className="w-16 text-sm font-bold text-[#4460ef] bg-transparent text-right outline-none appearance-none"
                            />
                        </div>

                        <input
                            type="range"
                            min={1}
                            max={100}
                            value={maxArticles}
                            onChange={(e) =>
                                setMaxArticles(Number(e.target.value))
                            }
                            className="w-full cursor-pointer"
                        />
                    </div>

                    {/* Force Checkbox */}
                    <div className="flex items-center gap-3 mt-4 md:mt-4">
                        <input
                            id="force-resummarize"
                            type="checkbox"
                            checked={forceResummarize}
                            onChange={() =>
                                setForceResummarize(!forceResummarize)
                            }
                            className="h-4 w-4 rounded"
                        />
                        <label htmlFor="force-resummarize" className="text-sm text-[#191919] cursor-pointer select-none">
                            Force re-summarize (overwrite existing)
                        </label>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="grid md:grid-cols-5 gap-3 pt-2">
                    <button 
                        onClick={handleCheckDb}
                        disabled={loadingAction !== null}
                        className="neo-btn-secondary py-2.5 flex items-center justify-center text-sm disabled:opacity-50"
                    >
                        {loadingAction === "check_db" ? "Checking..." : "Check DB"}
                    </button>

                    <button 
                        onClick={handleLoadDb}
                        disabled={loadingAction !== null}
                        className="neo-btn-secondary py-2.5 flex items-center justify-center text-sm disabled:opacity-50"
                    >
                        {loadingAction === "load_db" ? "Loading..." : "Load from DB"}
                    </button>

                    <button 
                        onClick={handleFetchLive}
                        disabled={loadingAction !== null}
                        className="neo-btn py-2.5 flex items-center justify-center text-sm disabled:opacity-50 bg-[#a8d8ff] text-[#191919]"
                    >
                        {loadingAction === "fetch_live" ? "Fetching..." : "Fetch Live"}
                    </button>

                    <button 
                        onClick={handleFetchNewsTrends}
                        disabled={loadingAction !== null}
                        className="neo-btn py-2.5 flex items-center justify-center text-sm disabled:opacity-50 bg-[#4460ef] text-white"
                    >
                        {loadingAction === "fetch_news_trends" ? "Fetching..." : "News + Trends"}
                    </button>

                    <button 
                        onClick={handleSummarize}
                        disabled={loadingAction !== null}
                        className="neo-btn py-2.5 bg-[var(--rw-yellow)] text-[#191919] hover:bg-[#ffdb80] flex items-center justify-center text-sm disabled:opacity-50"
                        style={{ boxShadow: "0 1px 2px rgba(255,200,87,0.3), 0 4px 12px rgba(255,200,87,0.15)" }}
                    >
                        {loadingAction === "summarize" ? "Summarizing..." : `Summarize (${maxArticles})`}
                    </button>
                </div>

                {/* Progress Log */}
                <AnimatePresence>
                    {loadingAction && <ProgressLog action={loadingAction} />}
                </AnimatePresence>
            </div>
        </ClayCard>
    );
}