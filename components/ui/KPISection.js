"use client";

import { motion } from "framer-motion";

export default function KPISection() {
    const stats = [
        { label: "Articles", value: 124 },
        { label: "Keywords", value: 12 },
        { label: "Summarized", value: 97 },
        { label: "Failed", value: 2 },
    ];

    return (
        <div className="grid grid-cols-4 gap-6">
            {stats.map((stat, i) => (
                <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/5"
                >
                    <div className="text-sm text-gray-400">{stat.label}</div>
                    <div className="text-3xl font-bold mt-2">{stat.value}</div>
                </motion.div>
            ))}
        </div>
    );
}