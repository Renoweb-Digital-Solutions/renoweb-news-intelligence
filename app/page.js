"use client";

import { motion } from "framer-motion";
import CompanySection from "@/components/company/CompanySection";
import KeywordsSection from "@/components/keywords/KeywordsSection";
import DateRangeSection from "@/components/date-range/DateRangeSection";
import TrendsScoreSection from "@/components/trends/TrendsScoreSection";
import TrendsTable from "@/components/trends/TrendsTable";
import NewsTable from "@/components/news/NewsTable";
import ActionsSection from "@/components/actions/ActionSection";
import SocialSection from "@/components/social/SocialSection";
import InstagramTable from "@/components/social/InstagramTable";
import YoutubeTable from "@/components/social/YoutubeTable";
import RedditTable from "@/components/social/RedditTable";
import LinkedinTable from "@/components/social/LinkedinTable";
import AppShell from "@/components/layout/AppShell";
import { useState, useEffect } from "react";
import { Chewy } from "next/font/google";

const chewy = Chewy({ weight: '400', subsets: ['latin'] });

export default function Dashboard() {
  const [keywords, setKeywords] = useState([]);
  const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0]);
  const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);
  const [trendsData, setTrendsData] = useState([]);
  const [newsData, setNewsData] = useState([]);
  const [runId, setRunId] = useState(null);

  // Social states
  const [activePlatform, setActivePlatform] = useState("instagram");
  const [instagramData, setInstagramData] = useState([]);
  const [youtubeData, setYoutubeData] = useState([]);
  const [redditData, setRedditData] = useState([]);
  const [linkedinData, setLinkedinData] = useState([]);

  return (
    <AppShell>
      <div className="px-4 sm:px-8 py-6 sm:py-10 max-w-7xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className={`text-4xl sm:text-6xl md:text-7xl text-[#191919] tracking-wide mb-2 inline-block -rotate-2 origin-left drop-shadow-[3px_3px_0_var(--rw-purple)] ${chewy.className}`}>
            Snooptel 🕵️‍♂️
          </h1>
          <p className={`text-base sm:text-lg md:text-2xl text-[#191919] tracking-wider border-b-[3px] border-[#191919] inline-block pb-1 rotate-1 ${chewy.className}`}>
            Snooping around the web to fetch, aggregate, and summarize your news! 🕵️‍♂️📰
          </p>
        </motion.div>

        <div className="space-y-6">
          <CompanySection setKeywords={setKeywords} setRunId={setRunId} />
          <KeywordsSection keywords={keywords} setKeywords={setKeywords} />
          <DateRangeSection 
            fromDate={fromDate} setFromDate={setFromDate}
            toDate={toDate} setToDate={setToDate}
          />
          <TrendsScoreSection keywords={keywords} setTrendsData={setTrendsData} />
          {trendsData.length > 0 && (
            <TrendsTable data={trendsData} />
          )}
          <ActionsSection 
            keywords={keywords}
            fromDate={fromDate}
            toDate={toDate}
            runId={runId}
            setRunId={setRunId}
            setNewsData={setNewsData}
          />
          {newsData.length > 0 && (
            <NewsTable data={newsData} />
          )}
          <SocialSection 
            keywords={keywords}
            activePlatform={activePlatform}
            setActivePlatform={setActivePlatform}
            setInstagramData={setInstagramData}
            setYoutubeData={setYoutubeData}
            setRedditData={setRedditData}
            setLinkedinData={setLinkedinData}
          />

          {activePlatform === "instagram" && instagramData.length > 0 && (
            <InstagramTable data={instagramData} />
          )}
          {activePlatform === "youtube" && youtubeData.length > 0 && (
            <YoutubeTable data={youtubeData} />
          )}
          {activePlatform === "reddit" && redditData.length > 0 && (
            <RedditTable data={redditData} />
          )}
          {activePlatform === "linkedin" && linkedinData.length > 0 && (
            <LinkedinTable data={linkedinData} />
          )}
        </div>
      </div>
    </AppShell>
  );
}