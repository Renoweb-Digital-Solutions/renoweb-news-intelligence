"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

// # Revoke the server session before leaving the authenticated interface.
export default function useLogout() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function logout() {
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{}",
      });
      if (!response.ok && response.status !== 401)
        throw new Error("Please try signing out again.");
      router.replace("/auth");
      router.refresh();
    } catch (failure) {
      setError(failure.message);
      setBusy(false);
    }
  }
  return { logout, busy, error };
}
