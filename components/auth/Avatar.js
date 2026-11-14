"use client";
import { useState } from "react";
import { User } from "lucide-react";

// # Google accounts show their photo; password accounts (or a failed image) show the user icon.
export default function Avatar({ user, size = 36, className = "" }) {
  const [failed, setFailed] = useState(false);
  const showPhoto = user?.picture && !failed;
  return (
    <span
      className={`avatar ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {showPhoto ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={user.picture}
          alt=""
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
        />
      ) : (
        <User size={Math.round(size * 0.55)} strokeWidth={2.5} />
      )}
    </span>
  );
}
