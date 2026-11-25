"use client";
import Link from "next/link";
import {useApp} from "@/lib/store";
import {ProjectCard} from "@/components/Cards";
import {Empty,PageHeader} from "@/components/ui";
export default function Saved(){
  const {projects,saved}=useApp();const list=projects.filter(p=>saved.includes(p.id));
  return <><PageHeader title="Saved projects" sub="Projects you bookmarked to come back to."/>
    {list.length?<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{list.map(p=><ProjectCard key={p.id} p={p}/>)}</div>:<Empty text="Nothing saved yet. Tap the bookmark on any project to keep it here." action={<Link href="/explore" className="btn-primary">Explore projects</Link>}/>}</>;
}
