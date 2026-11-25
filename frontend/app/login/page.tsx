"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/auth-api";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setPending(true);
    const form = new FormData(event.currentTarget);
    try {
      await login(String(form.get("email") ?? "").trim(), String(form.get("password") ?? ""));
      const requested = new URLSearchParams(window.location.search).get("next") ?? "/profile";
      router.replace(requested.startsWith("/") && !requested.startsWith("//") ? requested : "/profile");
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Unable to sign in."); }
    finally { setPending(false); }
  }

  return <main className="mx-auto max-w-md px-4 py-16"><div className="card space-y-5">
    <div><h1 className="text-2xl font-extrabold">Welcome back</h1><p className="mt-1 text-sm text-[#5b5f5a]">Sign in to your SkillBridge account.</p></div>
    <form onSubmit={submit} className="space-y-4">
      <div><label className="label" htmlFor="email">Email</label><input className="input" id="email" name="email" type="email" autoComplete="email" required /></div>
      <div><label className="label" htmlFor="password">Password</label><input className="input" id="password" name="password" type="password" autoComplete="current-password" required /></div>
      {error && <p role="alert" className="err">{error}</p>}
      <button className="btn-primary w-full justify-center" disabled={pending}>{pending ? "Signing in…" : "Sign in"}</button>
    </form>
    <p className="text-sm text-[#5b5f5a]">New to SkillBridge? <Link className="text-brand underline" href="/register">Create an account</Link></p>
  </div></main>;
}
