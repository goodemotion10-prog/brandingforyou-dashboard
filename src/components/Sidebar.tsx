"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Search, 
  History, 
  Settings,
  Sparkles,
  Lightbulb
} from "lucide-react";

const menuItems = [
  { icon: LayoutDashboard, label: "대시보드", href: "/" },
  { icon: Search, label: "리서치 관리", href: "/research" },
  { icon: History, label: "리서치 결과", href: "/history" },
  { icon: Settings, label: "설정", href: "/settings" },
  { icon: Lightbulb, label: "사용법 가이드", href: "/tips" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 shadow-sm flex flex-col z-50">
      <div className="flex items-center gap-3 px-6 h-16 border-b border-gray-100">
        <Sparkles className="w-5 h-5 text-brand-600" />
        <h1 className="text-xl font-bold text-brand-600 tracking-tight">
          B4Y Hub
        </h1>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors ${
                isActive 
                  ? "bg-brand-50 text-brand-700 font-medium" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? "text-brand-600" : "text-gray-400"}`} />
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="flex flex-col gap-1 px-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full" />
            <span className="text-xs font-medium text-gray-500">System Online</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">리서치 엔진 정상 가동 중</p>
        </div>
      </div>
    </aside>
  );
}
