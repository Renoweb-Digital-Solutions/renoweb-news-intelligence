"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Chewy } from "next/font/google";
import { ArrowLeft, LogOut } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import ClayCard from "@/components/ui/ClayCard";
import Avatar from "@/components/auth/Avatar";
import useLogout from "@/components/auth/useLogout";

const chewy = Chewy({ weight: "400", subsets: ["latin"] });

function memberSince(value) {
  const date = value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function signInMethods(user) {
  const methods = [];
  if (user.google) methods.push("Google");
  if (user.password) methods.push("Email & password");
  return methods.length ? methods : ["Email"];
}

// # Account details are rendered from the server-validated user; nothing here is editable yet.
export default function ProfileView({ user }) {
  const { logout, busy, error } = useLogout();
  const details = [
    { label: "Username", value: user.username },
    { label: "Email", value: user.email },
    { label: "Sign-in", value: signInMethods(user).join(" + ") },
    { label: "Member since", value: memberSince(user.created_at) },
  ];

  return (
    <AppShell>
      <div className="px-4 sm:px-8 py-6 sm:py-10 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1
            className={`text-4xl sm:text-6xl md:text-7xl text-[#191919] tracking-wide mb-2 inline-block -rotate-2 origin-left drop-shadow-[3px_3px_0_var(--rw-purple)] ${chewy.className}`}
          >
            Your profile 🕵️‍♂️
          </h1>
          <p
            className={`text-base sm:text-lg md:text-2xl text-[#191919] tracking-wider border-b-[3px] border-[#191919] inline-block pb-1 rotate-1 ${chewy.className}`}
          >
            Here&apos;s everything we know about you, snooper! 📋
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <ClayCard>
            <div className="profile-head">
              <Avatar user={user} size={96} className="avatar-lg" />
              <div className="profile-identity">
                <span className="eyebrow">Signed in as</span>
                <h2 className={chewy.className}>{user.username}</h2>
                <p>{user.email}</p>
              </div>
            </div>

            <dl className="profile-details">
              {details.map((item) => (
                <div key={item.label} className="profile-row">
                  <dt>{item.label}</dt>
                  <dd>{item.value}</dd>
                </div>
              ))}
            </dl>

            <div className="profile-actions">
              <Link
                href="/dashboard"
                className="neo-btn px-5 py-3 text-xs inline-flex items-center gap-2"
              >
                <ArrowLeft size={16} strokeWidth={3} /> Back to dashboard
              </Link>
              <button
                type="button"
                onClick={logout}
                disabled={busy}
                className="neo-btn-secondary px-5 py-3 text-xs inline-flex items-center gap-2"
              >
                <LogOut size={16} strokeWidth={3} />
                {busy ? "Signing out…" : "Sign out"}
              </button>
              {error && (
                <span role="alert" className="profile-error">
                  {error}
                </span>
              )}
            </div>
          </ClayCard>
        </motion.div>
      </div>
    </AppShell>
  );
}
