"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Topbar() {
    const [health, setHealth] = useState(null);

    useEffect(() => {
        const checkHealth = async () => {
            try {
                const res = await fetch("/api/health");
                const data = await res.json();
                if (!data.error) {
                    setHealth(data);
                }
            } catch (err) {
                console.error("Health check failed", err);
            }
        };
        checkHealth();
    }, []);

    return (
        <motion.header
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="
        sticky top-0 z-20
        backdrop-blur-xl
        bg-white/80
        border-b border-[var(--border)]
      "
        >
            <div className="max-w-7xl mx-auto px-8 h-16 flex items-center justify-between">

                <div className="flex items-center gap-2">
                    <span className="text-xl font-bold tracking-tight text-[#191919]">
                        Renoweb
                    </span>
                    <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-[#023dbb] to-[#308fef] bg-clip-text text-transparent">
                        Intelligence
                    </span>
                </div>

                <div className="flex items-center gap-3 text-xs">
                    {health && (
                        <div className="flex items-center gap-2 mr-4">
                            <span className="text-[var(--muted)] font-medium">Services:</span>
                            <div className="flex items-center gap-1.5">
                                <span title="Database" className={`w-2 h-2 rounded-full ${health.db ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                <span title="SerpApi" className={`w-2 h-2 rounded-full ${health.serpapi_configured ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                <span title="Groq" className={`w-2 h-2 rounded-full ${health.groq_configured ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                <span title="Apify" className={`w-2 h-2 rounded-full ${health.apify_configured ? 'bg-green-500' : 'bg-red-500'}`}></span>
                            </div>
                        </div>
                    )}
                    <span className="px-2.5 py-1 rounded-full bg-[#f0f3ff] text-[#4460ef] font-semibold tracking-wide uppercase">
                        News
                    </span>
                </div>
            </div>
        </motion.header>
    );
}