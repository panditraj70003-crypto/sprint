import "./globals.css";
import {Manrope} from "next/font/google";
import type {Metadata} from "next";
import {StoreProvider} from "@/lib/store";
import AppShell from "@/components/AppShell";
const f=Manrope({subsets:["latin"],variable:"--font-manrope"});
export const metadata:Metadata={title:"SkillBridge",description:"Find projects and teammates with complementary skills."};
export default function Root({children}:{children:React.ReactNode}){return <html lang="en"><body className={`${f.variable} font-sans`}><StoreProvider><AppShell>{children}</AppShell></StoreProvider></body></html>}
