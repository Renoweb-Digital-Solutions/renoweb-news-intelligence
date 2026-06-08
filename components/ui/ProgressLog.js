"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FUNNY_LOGS = {
    fetch_live: [
        "Warming up the news radar...",
        "Intercepting satellite signals 🛰️",
        "Bribing Google for headlines...",
        "Reading every newspaper on Earth...",
        "Eavesdropping on journalists ☕",
        "Convincing the internet to share...",
        "Catching news from every TV on the planet 📺",
        "Hacking into the newsroom... jk, using the API",
        "Asking Siri, Alexa, AND Google at once...",
        "Filtering out the clickbait 🗑️",
        "Teaching the AI to read faster...",
        "Scrolling through Twitter so you don't have to",
        "News anchors hate this one trick...",
        "Making reporters type faster ⌨️",
        "Checking under rocks for hidden articles...",
        "Speed-reading 47 newspapers simultaneously...",
        "Deploying carrier pigeons for backup 🐦",
        "Parsing headlines at the speed of light...",
        "Still faster than your morning coffee ☕",
        "We're not slow, we're thorough 😤",
    ],
    check_db: [
        "Knocking on the database door 🚪",
        "Checking every drawer...",
        "Rummaging through old records...",
        "Asking the database nicely...",
        "Dusting off the archives 📂",
        "Poking around the data warehouse...",
        "The database is thinking about it...",
        "SELECT * FROM patience WHERE timeout = never",
        "Counting rows like sheep 🐑",
        "Checking if anyone's home...",
    ],
    load_db: [
        "Waking up the database...",
        "Loading articles from the vault 🏦",
        "Unpacking stored headlines...",
        "Database is stretching... almost ready...",
        "Fetching data at bureaucratic speed 🐌",
        "Restoring from the memory palace...",
        "The database remembers everything...",
        "Retrieving your saved news stash...",
        "Pulling records from the filing cabinet 🗄️",
        "Data is on its way... taking the scenic route",
    ],
    summarize: [
        "Teaching the AI to read...",
        "Summarizing in 3... 2... 1... wait, still reading",
        "Distilling wisdom from chaos 🧪",
        "Making long stories short... literally",
        "AI is putting on its reading glasses 🤓",
        "Compressing knowledge into bite-sized pieces...",
        "TL;DR-ing the entire internet...",
        "The AI just said 'hmm interesting'...",
        "Generating summaries, not excuses...",
        "Writing book reports at superhuman speed 📝",
        "Channeling the spirit of every editor...",
        "Plot twist: the AI actually read them all",
        "Skimming articles like a college student 📚",
        "Turning novels into tweets...",
        "The AI needs a coffee break but we said no ☕",
        "Almost done... the AI is being a perfectionist",
        "Summarizing so hard right now...",
        "Your personal news digest is cooking 🍳",
    ],
    suggest: [
        "Brainstorming keywords...",
        "The AI is having a think 🤔",
        "Consulting the keyword oracle...",
        "Mining for golden keywords ⛏️",
        "Generating ideas at the speed of thought...",
        "The keyword fairy is working on it 🧚",
    ],
};

function getRandomLog(action, usedIndices) {
    const logs = FUNNY_LOGS[action] || FUNNY_LOGS.fetch_live;
    const available = logs.map((_, i) => i).filter((i) => !usedIndices.has(i));
    
    if (available.length === 0) {
        usedIndices.clear();
        return { log: logs[Math.floor(Math.random() * logs.length)], index: 0 };
    }
    
    const idx = available[Math.floor(Math.random() * available.length)];
    return { log: logs[idx], index: idx };
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) return `${mins}m ${secs}s`;
    return `${secs}s`;
}

function estimateETA(action, elapsed) {
    const estimates = {
        fetch_live: 60,
        check_db: 8,
        load_db: 15,
        summarize: 90,
        suggest: 20,
    };
    const est = estimates[action] || 30;
    const remaining = Math.max(0, est - elapsed);
    if (elapsed > est) return "any moment now...";
    return `~${formatTime(remaining)}`;
}

export default function ProgressLog({ action }) {
    const [elapsed, setElapsed] = useState(0);
    const [logs, setLogs] = useState([]);
    const usedIndices = useRef(new Set());
    const logContainerRef = useRef(null);

    // Timer
    useEffect(() => {
        const interval = setInterval(() => {
            setElapsed((prev) => prev + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // Funny log rotation
    useEffect(() => {
        // First log immediately
        const { log, index } = getRandomLog(action, usedIndices.current);
        usedIndices.current.add(index);
        setLogs([{ text: log, time: 0 }]);

        const interval = setInterval(() => {
            const { log: newLog, index: newIdx } = getRandomLog(action, usedIndices.current);
            usedIndices.current.add(newIdx);
            setLogs((prev) => [...prev, { text: newLog, time: Math.floor((Date.now() - startTime) / 1000) }]);
        }, 5000 + Math.random() * 2000); // 5-7 seconds

        const startTime = Date.now();
        return () => clearInterval(interval);
    }, [action]);

    // Auto-scroll
    useEffect(() => {
        if (logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
    }, [logs]);

    const actionLabels = {
        fetch_live: "Fetching live news",
        check_db: "Checking database",
        load_db: "Loading from database",
        summarize: "Summarizing articles",
        suggest: "Suggesting keywords",
    };

    return (
        <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
        >
            <div className="mt-4 rounded-xl border border-[var(--border)] bg-[#191919] text-white overflow-hidden">
                {/* Header bar */}
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 bg-white/[0.03]">
                    <div className="flex items-center gap-3">
                        {/* Pulsing dot */}
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4ec8ef] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#4ec8ef]"></span>
                        </span>
                        <span className="text-sm font-medium text-white/90">
                            {actionLabels[action] || "Processing"}
                        </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-white/50 font-mono">
                        <span>⏱ {formatTime(elapsed)}</span>
                        <span>ETA {estimateETA(action, elapsed)}</span>
                    </div>
                </div>

                {/* Log lines */}
                <div ref={logContainerRef} className="px-4 py-3 max-h-40 overflow-y-auto font-mono text-xs space-y-1.5">
                    <AnimatePresence>
                        {logs.map((log, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.25 }}
                                className="flex items-start gap-2"
                            >
                                <span className="text-white/25 shrink-0 tabular-nums w-10 text-right">
                                    {formatTime(log.time)}
                                </span>
                                <span className="text-[#4ec8ef]">›</span>
                                <span className="text-white/70">{log.text}</span>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {/* Blinking cursor */}
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-white/25 w-10 text-right tabular-nums">{formatTime(elapsed)}</span>
                        <span className="text-[#4ec8ef]">›</span>
                        <span className="inline-block w-1.5 h-3.5 bg-[#4ec8ef] animate-pulse rounded-sm"></span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
