"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { LogOut, UserRound } from "lucide-react";
import Avatar from "@/components/auth/Avatar";
import useLogout from "@/components/auth/useLogout";

// # Home link plus an avatar menu. Hover, focus or tap opens it; Escape or an outside click closes it.
export default function AccountNav() {
  const { logout, busy, error } = useLogout();
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const wrapper = useRef(null);
  const closeTimer = useRef(null);

  useEffect(() => {
    let active = true;
    fetch("/api/auth/me")
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => active && data?.user && setUser(data.user))
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event) => {
      if (!wrapper.current?.contains(event.target)) setOpen(false);
    };
    const onKey = (event) => event.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // A short close delay lets the pointer cross the gap between the avatar and the menu.
  const show = () => {
    clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const hide = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), 150);
  };

  return (
    <div className="account-nav">
      <Link href="/">Home</Link>
      <div
        className="account-menu"
        ref={wrapper}
        onMouseEnter={show}
        onMouseLeave={hide}
      >
        <button
          type="button"
          className="account-avatar"
          aria-label="Account menu"
          aria-haspopup="menu"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <Avatar user={user} size={36} />
        </button>
        {open && (
          <div className="account-popover" role="menu">
            {user && (
              <div className="account-popover-head">
                <strong>{user.username}</strong>
                <span>{user.email}</span>
              </div>
            )}
            <Link
              href="/profile"
              role="menuitem"
              onClick={() => setOpen(false)}
            >
              <UserRound size={16} strokeWidth={2.5} /> Profile
            </Link>
            <button
              type="button"
              role="menuitem"
              onClick={logout}
              disabled={busy}
            >
              <LogOut size={16} strokeWidth={2.5} />
              {busy ? "Signing out…" : "Sign out"}
            </button>
            {error && <span role="alert">{error}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
