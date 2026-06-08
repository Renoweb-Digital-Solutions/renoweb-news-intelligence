"use client";

import { motion } from "framer-motion";
import CompanySection from "@/components/company/CompanySection";
import KeywordsSection from "@/components/keywords/KeywordsSection";
import DateRangeSection from "@/components/date-range/DateRangeSection";
import NewsTable from "@/components/news/NewsTable";
import ActionsSection from "@/components/actions/ActionSection";
import AppShell from "@/components/layout/AppShell";
import { useState } from "react";

export default function Dashboard() {
  const [keywords, setKeywords] = useState([]);
  const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0]);
  const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);
  const [newsData, setNewsData] = useState([]);
  const [runId, setRunId] = useState(0);

  return (
    <AppShell>
      <div className="min-h-screen px-8 py-10 max-w-7xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-3xl font-bold text-[#191919] tracking-tight">
            News Intelligence
          </h1>
          <p className="text-sm text-[var(--muted)] mt-1">
            Discover, aggregate, and summarize news for your keywords.
          </p>
        </motion.div>

        <div className="space-y-6">
          <CompanySection setKeywords={setKeywords} />
          <KeywordsSection keywords={keywords} setKeywords={setKeywords} />
          <DateRangeSection 
            fromDate={fromDate} setFromDate={setFromDate}
            toDate={toDate} setToDate={setToDate}
          />
          <ActionsSection 
            keywords={keywords}
            fromDate={fromDate}
            toDate={toDate}
            runId={runId}
            setRunId={setRunId}
            setNewsData={setNewsData}
          />
          <NewsTable data={newsData} />
        </div>
      </div>
    </AppShell>
  );
}