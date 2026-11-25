"use client";
import {useParams} from "next/navigation";
import {useApp} from "@/lib/store";
import ProjectForm from "@/components/ProjectForm";
import {Empty} from "@/components/ui";
export default function Edit(){const {id}=useParams<{id:string}>();const {projects}=useApp();const p=projects.find(x=>x.id===id);return p?<ProjectForm initial={p}/>:<Empty text="Project not found."/>}
