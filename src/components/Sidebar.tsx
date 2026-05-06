"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Search, 
  History, 
  Settings, 
  ChevronRight,
  TrendingUp
} from "lucide-react";

const menuItems = [
  { icon: LayoutDashboard, label: "대시보드", href: "/" },
  { icon: Search, label: "리서치 관리", href: "/research" },
  { icon: History, label: "리서치 결과", href: "/history" },
  { icon: Settings, label: "설정", href: "/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <TrendingUp className="text-white w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight">BrandingForYou</h1>
          <p className="text-xs text-slate-500 font-medium">Research Hub</p>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20" 
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className={`w-5 h-5 ${isActive ? "text-indigo-400" : "group-hover:text-slate-200"}`} />
                <span className="font-medium">{item.label}</span>
              </div>
              {isActive && <ChevronRight className="w-4 h-4" />}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto p-4 glass rounded-2xl bg-indigo-600/5 border-indigo-500/10">
        <p className="text-xs text-slate-400 mb-1">현재 상태</p>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-sm font-semibold text-slate-200">시스템 정상</span>
        </div>
      </div>
    </aside>
  );
}
