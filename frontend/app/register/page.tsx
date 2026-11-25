"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { register } from "@/lib/auth-api";
import { DEPARTMENTS, YEARS } from "@/lib/data";

const splitTags = (value: FormDataEntryValue | null) => String(value ?? "").split(",").map(tag => tag.trim()).filter(Boolean);

export default function RegisterPage() {
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setPending(true);
    const form = new FormData(event.currentTarget);
    const fullName = String(form.get("full_name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    try {
      const yearValue = String(form.get("year") ?? "");
      await register({
        full_name: fullName,
        email,
        password,
        department: String(form.get("department") ?? ""),
        year: yearValue ? Number(yearValue) : null,
        bio: String(form.get("bio") ?? "").trim(),
        skills: splitTags(form.get("skills")),
        interests: splitTags(form.get("interests")),
        avatar_url: String(form.get("avatar_url") ?? "").trim(),
        github_url: String(form.get("github_url") ?? "").trim(),
        linkedin_url: String(form.get("linkedin_url") ?? "").trim(),
      });
      window.location.assign("/profile");
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Unable to create your account."); }
    finally { setPending(false); }
  }

  return <main className="mx-auto max-w-md px-4 py-16"><div className="card space-y-5">
    <div><h1 className="text-2xl font-extrabold">Create your account</h1><p className="mt-1 text-sm text-[#5b5f5a]">Join SkillBridge and build your student profile.</p></div>
    <form onSubmit={submit} className="space-y-4">
      <div><label className="label" htmlFor="full_name">Full name</label><input className="input" id="full_name" name="full_name" autoComplete="name" minLength={2} maxLength={100} required /></div>
      <div><label className="label" htmlFor="email">Email</label><input className="input" id="email" name="email" type="email" autoComplete="email" required /></div>
      <div><label className="label" htmlFor="password">Password</label><input className="input" id="password" name="password" type="password" autoComplete="new-password" minLength={8} required /></div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className="label" htmlFor="department">Department</label><select className="input" id="department" name="department" defaultValue=""><option value="">Select department</option>{DEPARTMENTS.map(department=><option key={department} value={department}>{department}</option>)}</select></div>
        <div><label className="label" htmlFor="year">Academic year</label><select className="input" id="year" name="year" defaultValue=""><option value="">Select year</option>{YEARS.map((year,index)=><option key={year} value={index+1}>{year}</option>)}</select></div>
      </div>
      <div><label className="label" htmlFor="bio">Bio</label><textarea className="input" id="bio" name="bio" rows={3} maxLength={1000} /></div>
      <div><label className="label" htmlFor="skills">Skills (comma separated)</label><input className="input" id="skills" name="skills" placeholder="TypeScript, SQL, UI/UX" /></div>
      <div><label className="label" htmlFor="interests">Interests (comma separated)</label><input className="input" id="interests" name="interests" placeholder="Open source, AI, accessibility" /></div>
      <div><label className="label" htmlFor="avatar_url">Avatar URL (optional)</label><input className="input" id="avatar_url" name="avatar_url" type="url" /></div>
      <div className="grid gap-4 sm:grid-cols-2"><div><label className="label" htmlFor="github_url">GitHub URL (optional)</label><input className="input" id="github_url" name="github_url" type="url" /></div><div><label className="label" htmlFor="linkedin_url">LinkedIn URL (optional)</label><input className="input" id="linkedin_url" name="linkedin_url" type="url" /></div></div>
      {error && <p role="alert" className="err">{error}</p>}
      <button className="btn-primary w-full justify-center" disabled={pending}>{pending ? "Creating account…" : "Create account"}</button>
    </form>
    <p className="text-sm text-[#5b5f5a]">Already registered? <Link className="text-brand underline" href="/login">Sign in</Link></p>
  </div></main>;
}
