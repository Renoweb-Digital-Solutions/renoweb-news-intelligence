"use client";

import { motion } from "framer-motion";
import ClayCard from "../ui/ClayCard";
import { useState } from "react";

export default function CompanySection({ setKeywords }) {
    const [companyName, setCompanyName] = useState("");
    const [companyDescription, setCompanyDescription] = useState("");
    const [maxKeywords, setMaxKeywords] = useState(12);
    const [loading, setLoading] = useState(false);

    const suggestKeywords = async () => {
        if (!companyName || !companyDescription) return;

        setLoading(true);

        try {
            const res = await fetch("/api/keywords/suggest", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    company_name: companyName,
                    company_description: companyDescription,
                    max_keywords: maxKeywords,
                }),
            });

            const data = await res.json();

            if (data?.suggested_keywords) {
                setKeywords(data.suggested_keywords);
            }

        } catch (err) {
            console.error("Keyword suggestion failed:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <ClayCard>
                <h2 className="text-xl font-semibold mb-6 text-slate-800">
                    1. Company Details
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-sm font-medium text-slate-500 mb-2 block">
                            Company Name
                        </label>
                        <input
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            placeholder="Enter company name"
                            className="clay-input w-full p-3"
                        />
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-sm font-medium text-slate-500">
                                Max Keywords
                            </label>
                            <span className="text-sm font-bold text-emerald-600">
                                {maxKeywords}
                            </span>
                        </div>

                        <input
                            type="range"
                            min={1}
                            max={30}
                            value={maxKeywords}
                            onChange={(e) =>
                                setMaxKeywords(Number(e.target.value))
                            }
                            className="w-full mt-2 accent-emerald-500 cursor-pointer"
                        />
                    </div>
                </div>

                <div className="mt-6">
                    <label className="text-sm font-medium text-slate-500 mb-2 block">
                        Company Description
                    </label>
                    <textarea
                        value={companyDescription}
                        onChange={(e) =>
                            setCompanyDescription(e.target.value)
                        }
                        rows={3}
                        className="clay-input w-full p-3 resize-none"
                    />
                </div>

                <button
                    onClick={suggestKeywords}
                    disabled={loading}
                    className="clay-btn mt-8 px-8 py-3 disabled:opacity-50"
                >
                    {loading ? "Generating..." : "Suggest Keywords"}
                </button>
            </ClayCard>
        </motion.div>
    );
}