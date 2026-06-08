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
        bg-[#f8fbf9]/80
        border-b border-gray-200/60
      "
        >
            <div className="max-w-6xl mx-auto px-8 h-20 flex items-center justify-between">

                <div className="text-xl font-semibold tracking-tight">
                    Renoweb
                    <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent ml-2">
                        Intelligence
                    </span>
                </div>

                {/* <div className="flex items-center gap-6 text-sm text-gray-400">
                    <span>Enterprise</span>
                    <div className="h-9 w-9 rounded-full bg-blue-500/20 flex items-center justify-center">
                        SD
                    </div>
                </div> */}
            </div>
        </motion.header>
    );
}