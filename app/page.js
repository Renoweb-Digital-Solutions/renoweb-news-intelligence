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
  return (
    <AppShell>

      <div className="min-h-screen px-8 py-10 max-w-7xl mx-auto">

        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold mb-8 bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent"
        >
          Renoweb News Intelligence
        </motion.h1>

        <div className="space-y-8">
          <CompanySection setKeywords={setKeywords} />
          <KeywordsSection keywords={keywords} setKeywords={setKeywords} />
          <DateRangeSection />
          <ActionsSection />
          <NewsTable />
        </div>
      </div>
    </AppShell>

  );
}