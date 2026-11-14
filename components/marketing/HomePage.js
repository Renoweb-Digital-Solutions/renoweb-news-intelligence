"use client";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  ScanSearch,
  Newspaper,
  ChartNoAxesCombined,
  MessagesSquare,
  Sparkles,
} from "lucide-react";
import SignalBoard from "./SignalBoard";

// # Public introduction shares the dashboard's paper, blue, yellow and ink palette.
export default function HomePage({ signedIn }) {
  const reduced = useReducedMotion();
  const destination = signedIn ? "/dashboard" : "/auth";
  return (
    <div className="marketing-page">
      <header className="marketing-header">
        <Link href="/" className="snoop-brand">
          <ScanSearch size={30} strokeWidth={2.5} /> snooptel<span>.</span>
        </Link>
        <nav aria-label="Main navigation">
          <Link href="#how-it-works" className="marketing-about">
            How it works
          </Link>
          <Link href={destination} className="neo-btn marketing-header-cta">
            {signedIn ? "Dashboard" : "Get started"}
            <ArrowUpRight size={18} />
          </Link>
        </nav>
      </header>
      <main>
        <section className="marketing-hero">
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="hero-copy"
          >
            <span className="paper-tag">
              <Sparkles size={15} /> YOUR CURIOSITY, SUPERCHARGED
            </span>
            <h1>
              Stop scrolling.
              <br />
              Start <span>snooping.</span>
            </h1>
            <p>
              Find what’s happening, what’s picking up, and what people are
              talking about. Turn the noise into your next great content idea.
            </p>
            <Link href={destination} className="neo-btn hero-cta">
              {signedIn ? "Go to your dashboard" : "Find your next idea"}
              <ArrowRight size={21} />
            </Link>
            <div className="hero-footnote">
              One workspace. News, trends & social. A fresh perspective.
            </div>
          </motion.div>
          <div className="hero-board">
            <SignalBoard />
            <span className="hero-doodle" aria-hidden="true">
              ✳
            </span>
          </div>
        </section>
        <div className="marketing-ribbon">
          <span>FOLLOW THE CURIOSITY</span>
          <span aria-hidden="true">✳</span>
          <span>CONNECT THE DOTS</span>
          <span aria-hidden="true">✳</span>
          <span>MAKE SOMETHING WORTH READING</span>
        </div>
        <section id="how-it-works" className="marketing-features">
          <div className="features-heading">
            <span className="eyebrow">YOUR RESEARCH, WITH DIRECTION</span>
            <h2>
              From “what’s out there?”
              <br />
              to “I’ve got an idea.”
            </h2>
            <p>
              Start with your company and a little context.
              <br />
              Snooptel helps you explore the bigger picture.
            </p>
          </div>
          <div className="feature-grid">
            {[
              {
                icon: Newspaper,
                color: "#ffc857",
                label: "01 / THE HEADLINES",
                title: "Catch the story.",
                description:
                  "Explore relevant news by keyword and date. Summarize articles to get to the point faster.",
              },
              {
                icon: ChartNoAxesCombined,
                color: "#a8d8ff",
                label: "02 / THE MOMENTUM",
                title: "Spot the interest.",
                description:
                  "Use Google Trends search-interest scores to see which topics deserve a closer look.",
              },
              {
                icon: MessagesSquare,
                color: "#c9bcff",
                label: "03 / THE CONVERSATION",
                title: "Read the room.",
                description:
                  "Research conversations across Instagram, YouTube, Reddit, and LinkedIn in one workspace.",
              },
            ].map(({ icon: Icon, color, label, title, description }) => (
              <article className="feature-card neo-card" key={title}>
                <div className="feature-icon" style={{ background: color }}>
                  <Icon size={25} />
                </div>
                <span className="eyebrow">{label}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="marketing-last neo-card">
          <div>
            <span className="eyebrow">THE NEXT GOOD IDEA IS OUT THERE.</span>
            <h2>Go find your angle.</h2>
          </div>
          <Link href={destination} className="neo-btn hero-cta">
            Open your workspace
            <ArrowRight size={21} />
          </Link>
        </section>
      </main>
      <footer className="marketing-footer">
        <Link href="/" className="snoop-brand">
          snooptel<span>.</span>
        </Link>
        <span>Stay curious. Create something good.</span>
        <Link href={destination}>To the dashboard ↗</Link>
      </footer>
    </div>
  );
}
