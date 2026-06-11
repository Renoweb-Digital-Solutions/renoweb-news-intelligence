"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Chewy } from "next/font/google";

const chewy = Chewy({ weight: '400', subsets: ['latin'] });

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

                <div className={`flex items-center gap-2 ${chewy.className}`}>
                    <span className="text-3xl text-[#191919] tracking-wide drop-shadow-[2px_2px_0_var(--rw-purple)] -rotate-1">
                        Snooptel 🕵️‍♂️
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
                    <span className={`px-3 py-1 rounded-md bg-[var(--rw-yellow)] text-[#191919] text-base tracking-widest border-2 border-[#191919] shadow-[2px_2px_0_#191919] -rotate-3 ${chewy.className}`}>
                        NEWS!
                    </span>
                </div>
            </div>
        </motion.header>
    );
}