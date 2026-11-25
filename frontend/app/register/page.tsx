"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { register } from "@/lib/auth-api";

export default function RegisterPage() {
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setMessage(""); setPending(true);
    const form = new FormData(event.currentTarget);
    const fullName = String(form.get("full_name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    try {
      const result = await register(fullName, email, password);
      if (result.session) window.location.assign("/profile");
      else setMessage("Check your email to confirm your account, then sign in.");
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Unable to create your account."); }
    finally { setPending(false); }
  }

  return <main className="mx-auto max-w-md px-4 py-16"><div className="card space-y-5">
    <div><h1 className="text-2xl font-extrabold">Create your account</h1><p className="mt-1 text-sm text-[#5b5f5a]">Join SkillBridge and build your student profile.</p></div>
    <form onSubmit={submit} className="space-y-4">
      <div><label className="label" htmlFor="full_name">Full name</label><input className="input" id="full_name" name="full_name" autoComplete="name" minLength={2} maxLength={100} required /></div>
      <div><label className="label" htmlFor="email">Email</label><input className="input" id="email" name="email" type="email" autoComplete="email" required /></div>
      <div><label className="label" htmlFor="password">Password</label><input className="input" id="password" name="password" type="password" autoComplete="new-password" minLength={8} required /></div>
      {error && <p role="alert" className="err">{error}</p>}
      {message && <p role="status" className="text-sm text-brand">{message}</p>}
      <button className="btn-primary w-full justify-center" disabled={pending}>{pending ? "Creating account…" : "Create account"}</button>
    </form>
    <p className="text-sm text-[#5b5f5a]">Already registered? <Link className="text-brand underline" href="/login">Sign in</Link></p>
  </div></main>;
}
