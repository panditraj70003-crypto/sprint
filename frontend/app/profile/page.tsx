"use client";

import { useEffect, useState, FormEvent } from "react";
import { PageHeader } from "@/components/ui";
import { getProfile, updateProfile, type Profile, type ProfileUpdate } from "@/lib/profiles-api";

const emptyProfile: ProfileUpdate = { full_name: "", department: "", year: null, bio: "", skills: [], interests: [], avatar_url: "", github_url: "", linkedin_url: "" };
const asList = (value: string) => value.split(",").map(item => item.trim()).filter(Boolean);

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileUpdate>(emptyProfile);
  const [skills, setSkills] = useState("");
  const [interests, setInterests] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    getProfile().then(record => {
      setProfile({
        full_name: record.full_name ?? "", department: record.department ?? "", year: record.year,
        bio: record.bio ?? "", skills: record.skills ?? [], interests: record.interests ?? [],
        avatar_url: record.avatar_url ?? "", github_url: record.github_url ?? "", linkedin_url: record.linkedin_url ?? "",
      });
      setSkills((record.skills ?? []).join(", "));
      setInterests((record.interests ?? []).join(", "));
    }).catch(reason => setError(reason instanceof Error ? reason.message : "Could not load your profile.")).finally(() => setLoading(false));
  }, []);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving(true); setError(""); setNotice("");
    const payload = { ...profile, skills: asList(skills), interests: asList(interests) };
    try {
      const record = await updateProfile(payload);
      setProfile({ ...payload, year: record.year });
      setNotice("Profile saved.");
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Could not save your profile."); }
    finally { setSaving(false); }
  }

  const field = (key: keyof ProfileUpdate, label: string, type = "text") => <div>
    <label className="label" htmlFor={key}>{label}</label>
    <input className="input" id={key} type={type} value={String(profile[key] ?? "")} onChange={event => setProfile(current => ({ ...current, [key]: type === "number" ? (event.target.value ? Number(event.target.value) : null) : event.target.value }))} />
  </div>;

  return <>
    <PageHeader title="Profile" sub="Keep your student details, skills, and interests up to date." />
    {loading ? <div className="card text-sm text-[#5b5f5a]">Loading profile…</div> : <form onSubmit={save} className="card max-w-3xl space-y-4">
      {error && <p role="alert" className="err">{error}</p>}
      {notice && <p role="status" className="text-sm text-brand">{notice}</p>}
      {field("full_name", "Full name")}
      <div className="grid gap-4 sm:grid-cols-2">{field("department", "Department")}{field("year", "Academic year (number)", "number")}</div>
      <div><label className="label" htmlFor="bio">Bio</label><textarea className="input" id="bio" rows={4} maxLength={1000} value={profile.bio ?? ""} onChange={event => setProfile(current => ({ ...current, bio: event.target.value }))} /></div>
      <div><label className="label" htmlFor="skills">Skills (comma separated)</label><input className="input" id="skills" value={skills} onChange={event => setSkills(event.target.value)} placeholder="TypeScript, UI/UX, SQL" /></div>
      <div><label className="label" htmlFor="interests">Interests (comma separated)</label><input className="input" id="interests" value={interests} onChange={event => setInterests(event.target.value)} placeholder="Open source, AI, accessibility" /></div>
      {field("avatar_url", "Avatar URL", "url")}{field("github_url", "GitHub URL", "url")}{field("linkedin_url", "LinkedIn URL", "url")}
      <div className="flex justify-end"><button className="btn-primary" disabled={saving || loading}>{saving ? "Saving…" : "Save profile"}</button></div>
    </form>}
  </>;
}
