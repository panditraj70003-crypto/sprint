"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { completeAuthFromRedirect } from "@/lib/auth-api";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [message, setMessage] = useState("Confirming your account…");
  useEffect(() => {
    completeAuthFromRedirect(window.location.hash).then(() => router.replace("/profile"))
      .catch(reason => setMessage(reason instanceof Error ? reason.message : "Confirmation link is invalid or expired."));
  }, [router]);
  return <main className="mx-auto max-w-md px-4 py-16"><div className="card text-sm">{message}</div></main>;
}
