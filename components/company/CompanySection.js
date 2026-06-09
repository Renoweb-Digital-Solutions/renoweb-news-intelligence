"use client";

import { motion, AnimatePresence } from "framer-motion";
import ClayCard from "../ui/ClayCard";
import ProgressLog from "../ui/ProgressLog";
import { useState } from "react";

export default function CompanySection({ setKeywords, setRunId }) {
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

            if (data.error) {
                alert(`Error: ${data.error}${data.details ? ` - ${data.details}` : ''}`);
                return;
            }

            if (data?.suggested_keywords) {
                setKeywords(data.suggested_keywords);
            }
            if (data?.run_id !== undefined) {
                setRunId(data.run_id);
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
                <div className="flex items-center gap-3 mb-6">
                    <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#f0f3ff] text-[#4460ef] text-xs font-bold">1</span>
                    <h2 className="text-lg font-semibold text-[#191919]">
                        Company Details
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="text-xs font-medium text-[var(--muted)] mb-1.5 block uppercase tracking-wider">
                            Company Name
                        </label>
                        <input
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            placeholder="e.g. Renoweb Digital Solutions"
                            className="clay-input w-full px-3.5 py-2.5"
                        />
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-1.5">
                            <label className="text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                                Max Keywords
                            </label>
                            <input
                                type="number"
                                min={1}
                                max={30}
                                value={maxKeywords}
                                onChange={(e) => setMaxKeywords(Number(e.target.value))}
                                className="w-16 text-sm font-bold text-[#4460ef] bg-transparent text-right outline-none appearance-none"
                            />
                        </div>

                        <input
                            type="range"
                            min={1}
                            max={30}
                            value={maxKeywords}
                            onChange={(e) =>
                                setMaxKeywords(Number(e.target.value))
                            }
                            className="w-full mt-2 cursor-pointer"
                        />
                    </div>
                </div>

                <div className="mt-5">
                    <label className="text-xs font-medium text-[var(--muted)] mb-1.5 block uppercase tracking-wider">
                        Company Description
                    </label>
                    <textarea
                        value={companyDescription}
                        onChange={(e) =>
                            setCompanyDescription(e.target.value)
                        }
                        rows={3}
                        placeholder="Describe what your company does, its industry, target audience..."
                        className="clay-input w-full px-3.5 py-2.5 resize-none"
                    />
                </div>

                <button
                    onClick={suggestKeywords}
                    disabled={loading}
                    className="clay-btn mt-6 px-6 py-2.5 text-sm disabled:opacity-50"
                >
                    {loading ? "Generating..." : "Suggest Keywords"}
                </button>

                <AnimatePresence>
                    {loading && <ProgressLog action="suggest" />}
                </AnimatePresence>
            </ClayCard>
        </motion.div>
    );
}