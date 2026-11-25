"use client";
import Link from "next/link";
import {usePathname,useRouter} from "next/navigation";
import {Bell,Bookmark,Compass,FileText,FolderKanban,Home,Plus,Search,User,Users,Sprout,LogIn,LogOut} from "lucide-react";
import {ReactNode,useEffect,useState} from "react";
import {useApp} from "@/lib/store";
import {Avatar} from "./ui";
import {Modal} from "./ui";
import ProjectForm from "./ProjectForm";
import {getValidSession,logout as logoutSession} from "@/lib/auth-api";
const NAV=[["/","Dashboard",Home],["/explore","Explore Projects",Compass],["/students","Find Students",Users],["/my-projects","My Projects",FolderKanban],["/applications","My Applications",FileText],["/saved","Saved",Bookmark],["/profile","Profile",User]] as const;
export default function AppShell({children}:{children:ReactNode}){
  const path=usePathname();const router=useRouter();const {me,notifications,markNotificationRead,toast,createProjectOpen,openCreateProject,closeCreateProject}=useApp();const [q,setQ]=useState("");const [signedIn,setSignedIn]=useState(false);const [showNotifications,setShowNotifications]=useState(false);
  const publicPage=path==="/login"||path==="/register"||path.startsWith("/auth/");
  useEffect(()=>{
    if(publicPage)return;
    let active=true;
    const checkSession=()=>getValidSession().then(session=>{
      if(!active)return;
      setSignedIn(Boolean(session));
    });
    void checkSession();
    const onAuthChanged=()=>{void checkSession()};
    window.addEventListener("skillbridge-auth-change",onAuthChanged);
    window.addEventListener("storage",onAuthChanged);
    return()=>{active=false;window.removeEventListener("skillbridge-auth-change",onAuthChanged);window.removeEventListener("storage",onAuthChanged)};
  },[path,publicPage]);
  if(publicPage)return <>{children}</>;
  const logout=async()=>{await logoutSession();setSignedIn(false)};
  const pending=notifications.filter(item=>!item.is_read).length;
  const active=(h:string)=>h==="/"?path==="/":path.startsWith(h)||(h==="/explore"&&path.startsWith("/projects")&&path!=="/projects/new");
  return <div className="min-h-screen lg:pl-64">
    <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-line bg-white p-5 lg:flex">
      <Link href="/" className="mb-8 flex items-center gap-2 text-xl font-extrabold"><span className="grid h-9 w-9 place-items-center rounded-xl bg-brand text-white"><Sprout size={20}/></span>SkillBridge</Link>
      <button onClick={openCreateProject} className="btn-primary mb-6 py-3"><Plus size={18}/>Create project</button>
      <nav className="space-y-1">{NAV.map(([h,l,I])=><Link key={h} href={h} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium ${active(h)?"bg-sage text-brand":"hover:bg-paper"}`}><I size={18}/>{l}</Link>)}</nav>
      {signedIn?<button onClick={logout} className="mt-3 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#5b5f5a] hover:bg-paper"><LogOut size={18}/>Sign out</button>:<Link href="/login" className="btn-primary mt-4 w-full justify-center"><LogIn size={18}/>Log in</Link>}
      <div className="mt-auto rounded-xl bg-sage p-4 text-xs text-brand">Tip: projects with every role covered show as Team complete and stop taking applications.</div>
    </aside>
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-line bg-paper/95 px-4 py-3 lg:px-8">
      <Link href="/" className="grid h-9 w-9 place-items-center rounded-xl bg-brand text-white lg:hidden"><Sprout size={18}/></Link>
      <form className="relative max-w-xl flex-1" onSubmit={e=>{e.preventDefault();router.push(`/explore?q=${encodeURIComponent(q)}`)}}><Search size={16} className="absolute left-3 top-2.5 text-[#8a8d86]"/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search projects or skills" className="input pl-9"/></form>
      <button onClick={openCreateProject} className="btn-primary px-3 lg:hidden" aria-label="Create project"><Plus size={18}/></button>
      <div className="relative"><button onClick={()=>setShowNotifications(open=>!open)} className="relative rounded-xl border border-line bg-white p-2" aria-label="Notifications"><Bell size={18}/>{pending>0&&<span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-amber px-1 text-[10px] font-bold">{pending}</span>}</button>{showNotifications&&<div className="absolute right-0 top-12 z-50 w-80 rounded-2xl border border-line bg-white p-3 shadow-xl"><div className="mb-2 flex items-center justify-between"><p className="font-bold">Notifications</p><button className="text-xs text-brand" onClick={()=>setShowNotifications(false)}>Close</button></div>{notifications.length?notifications.slice(0,8).map(item=><button key={item.id} onClick={()=>{if(!item.is_read)void markNotificationRead(item.id);}} className={`block w-full rounded-xl p-3 text-left hover:bg-paper ${item.is_read?"opacity-60":"bg-sage/50"}`}><span className="text-sm font-semibold">{item.title}</span><span className="mt-1 block text-xs text-[#5b5f5a]">{item.message}</span></button>):<p className="p-3 text-sm text-[#5b5f5a]">You are all caught up.</p>}</div>}</div>
      {signedIn?<><Link href="/profile" aria-label="Profile"><Avatar name={me.name} size={36}/></Link><button onClick={logout} className="rounded-xl border border-line bg-white p-2 text-[#5b5f5a]" aria-label="Sign out"><LogOut size={18}/></button></>:<Link href="/login" className="btn-primary px-4 py-2"><LogIn size={16}/>Log in</Link>}
    </header>
    <main className="mx-auto max-w-6xl px-4 py-6 pb-28 lg:px-8 lg:pb-10">{children}</main>
    <nav className="fixed inset-x-0 bottom-0 z-30 flex overflow-x-auto border-t border-line bg-white px-2 lg:hidden">{NAV.map(([h,l,I])=><Link key={h} href={h} className={`flex min-w-[72px] flex-1 flex-col items-center gap-1 py-2 text-[10px] font-medium ${active(h)?"text-brand":"text-[#6b6f68]"}`}><I size={20}/>{l.replace("Explore ","").replace("Find ","").replace("My ","")}</Link>)}</nav>
    {toast&&<div role="status" className="fixed bottom-24 left-1/2 z-[60] -translate-x-1/2 rounded-xl bg-ink px-4 py-2.5 text-sm text-white lg:bottom-8">{toast}</div>}
    <Modal open={createProjectOpen} onClose={closeCreateProject} title="Create a project" size="wide"><ProjectForm onComplete={closeCreateProject} onCancel={closeCreateProject}/></Modal>
  </div>;
}
