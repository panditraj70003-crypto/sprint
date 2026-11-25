"use client";
import Link from "next/link";
import {usePathname,useRouter} from "next/navigation";
import {Bell,Bookmark,Compass,FileText,FolderKanban,Home,Plus,Search,User,Users,Sprout} from "lucide-react";
import {ReactNode,useState} from "react";
import {useApp} from "@/lib/store";
import {ME} from "@/lib/data";
import {Avatar} from "./ui";
const NAV=[["/","Dashboard",Home],["/explore","Explore Projects",Compass],["/students","Find Students",Users],["/my-projects","My Projects",FolderKanban],["/applications","My Applications",FileText],["/saved","Saved",Bookmark],["/profile","Profile",User]] as const;
export default function AppShell({children}:{children:ReactNode}){
  const path=usePathname();const router=useRouter();const {me,projects,apps,toast}=useApp();const [q,setQ]=useState("");
  const pending=apps.filter(a=>a.status==="Pending"&&projects.find(p=>p.id===a.projectId)?.creatorId===ME).length;
  const active=(h:string)=>h==="/"?path==="/":path.startsWith(h)||(h==="/explore"&&path.startsWith("/projects")&&path!=="/projects/new");
  return <div className="min-h-screen lg:pl-64">
    <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-line bg-white p-5 lg:flex">
      <Link href="/" className="mb-8 flex items-center gap-2 text-xl font-extrabold"><span className="grid h-9 w-9 place-items-center rounded-xl bg-brand text-white"><Sprout size={20}/></span>SkillBridge</Link>
      <Link href="/projects/new" className="btn-primary mb-6 py-3"><Plus size={18}/>Create project</Link>
      <nav className="space-y-1">{NAV.map(([h,l,I])=><Link key={h} href={h} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium ${active(h)?"bg-sage text-brand":"hover:bg-paper"}`}><I size={18}/>{l}</Link>)}</nav>
      <div className="mt-auto rounded-xl bg-sage p-4 text-xs text-brand">Tip: projects with every role covered show as Team complete and stop taking applications.</div>
    </aside>
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-line bg-paper/95 px-4 py-3 lg:px-8">
      <Link href="/" className="grid h-9 w-9 place-items-center rounded-xl bg-brand text-white lg:hidden"><Sprout size={18}/></Link>
      <form className="relative max-w-xl flex-1" onSubmit={e=>{e.preventDefault();router.push(`/explore?q=${encodeURIComponent(q)}`)}}><Search size={16} className="absolute left-3 top-2.5 text-[#8a8d86]"/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search projects or skills" className="input pl-9"/></form>
      <Link href="/projects/new" className="btn-primary px-3 lg:hidden" aria-label="Create project"><Plus size={18}/></Link>
      <Link href="/my-projects" className="relative rounded-xl border border-line bg-white p-2" aria-label="Notifications"><Bell size={18}/>{pending>0&&<span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-amber px-1 text-[10px] font-bold">{pending}</span>}</Link>
      <Link href="/profile" aria-label="Profile"><Avatar name={me.name} size={36}/></Link>
    </header>
    <main className="mx-auto max-w-6xl px-4 py-6 pb-28 lg:px-8 lg:pb-10">{children}</main>
    <nav className="fixed inset-x-0 bottom-0 z-30 flex overflow-x-auto border-t border-line bg-white px-2 lg:hidden">{NAV.map(([h,l,I])=><Link key={h} href={h} className={`flex min-w-[72px] flex-1 flex-col items-center gap-1 py-2 text-[10px] font-medium ${active(h)?"text-brand":"text-[#6b6f68]"}`}><I size={20}/>{l.replace("Explore ","").replace("Find ","").replace("My ","")}</Link>)}</nav>
    {toast&&<div role="status" className="fixed bottom-24 left-1/2 z-[60] -translate-x-1/2 rounded-xl bg-ink px-4 py-2.5 text-sm text-white lg:bottom-8">{toast}</div>}
  </div>;
}
