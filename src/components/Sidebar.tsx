"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Search, 
  History, 
  Settings, 
  ChevronRight,
  Sparkles,
  ArrowRightCircle
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
      <div className="flex items-center gap-4 mb-12 px-2">
        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-500/20">
          <Sparkles className="text-white w-7 h-7" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            B4Y Hub
          </h1>
          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold">BrandingForYou</p>
        </div>
      </div>

      <nav className="flex-1 space-y-3">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-300 group ${
                isActive 
                  ? "bg-white/5 text-indigo-400 border border-white/10 shadow-lg" 
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-4">
                <item.icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? "text-indigo-400 scale-110" : "group-hover:scale-110"}`} />
                <span className={`font-semibold tracking-wide ${isActive ? "text-white" : ""}`}>{item.label}</span>
              </div>
              {isActive && <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]" />}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto p-6 glass-card bg-indigo-600/5 border-white/5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">System Operational</span>
        </div>
        <p className="text-[11px] text-slate-500 leading-relaxed mb-4">
          리서치 자동화 파이프라인이 정상적으로 가동 중입니다.
        </p>
        <button className="w-full flex items-center justify-between text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors group">
          로그아웃
          <ArrowRightCircle className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </aside>
  );
}
