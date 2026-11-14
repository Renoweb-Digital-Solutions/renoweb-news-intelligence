"use client";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, AudioLines, Search, Sparkles } from "lucide-react";

// # This clearly illustrative product board uses transforms only and respects reduced motion.
// # It previews the research workflow without presenting fabricated customer results as live data.
export default function SignalBoard() {
  const reduced = useReducedMotion();
  return (
    <div
      className="signal-board"
      aria-label="Illustration of a content research workspace"
    >
      <div className="signal-board-heading">
        <span className="signal-dot" /> YOUR NEXT BIG IDEA STARTS HERE{" "}
        <Sparkles size={18} />
      </div>
      <motion.div
        className="signal-search"
        animate={reduced ? {} : { y: [0, -5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <Search size={22} />
        <span>What’s your audience talking about?</span>
        <span className="signal-enter">↵</span>
      </motion.div>
      <div className="signal-sources">
        <span>NEWS</span>
        <span>GOOGLE TRENDS</span>
        <span>SOCIAL</span>
      </div>
      <div className="signal-chart neo-card">
        <div className="signal-chart-title">
          <span>
            <AudioLines size={18} /> Find the signal.
          </span>
          <span className="signal-demo">ILLUSTRATION</span>
        </div>
        <div className="signal-bars">
          {[25, 39, 31, 58, 46, 67, 53, 80, 70, 96].map((height, index) => (
            <motion.div
              key={index}
              style={{ height: `${height}%` }}
              initial={reduced ? false : { scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{
                delay: index * 0.05,
                duration: 0.65,
                ease: [0.22, 1, 0.36, 1],
              }}
            />
          ))}
        </div>
        <div className="signal-chart-axis">
          <span>Scattered information</span>
          <span>
            A clearer direction <ArrowUpRight size={16} />
          </span>
        </div>
      </div>
      <motion.div
        className="signal-note"
        animate={reduced ? {} : { rotate: [-3, -1, -3] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <Sparkles size={19} />
        <div>
          <strong>Less searching. More creating.</strong>
          <p>Turn the conversation into your next story.</p>
        </div>
      </motion.div>
      <div className="signal-caption">
        A little curiosity. A lot of possibility.
      </div>
    </div>
  );
}
