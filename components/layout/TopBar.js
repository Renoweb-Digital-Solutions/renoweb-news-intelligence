"use client";

import { motion } from "framer-motion";

export default function Topbar() {
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

                <div className="flex items-center gap-3 text-xs text-[var(--muted)]">
                    <span className="px-2.5 py-1 rounded-full bg-[#f0f3ff] text-[#4460ef] font-semibold tracking-wide uppercase">
                        News
                    </span>
                </div>
            </div>
        </motion.header>
    );
}