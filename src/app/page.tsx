import { 
  Users, 
  Search, 
  Mail, 
  TrendingUp,
  ArrowUpRight,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import Link from "next/link";

const stats = [
  { label: "관리 업체", value: "12", sub: "+2 이번 달", icon: Users, color: "from-blue-500 to-cyan-400" },
  { label: "주간 리서치", value: "48", sub: "85% 성공률", icon: Search, color: "from-indigo-500 to-purple-500" },
  { label: "알림 발송", value: "124", sub: "실시간", icon: Mail, color: "from-emerald-500 to-teal-400" },
];

export default function Home() {
  return (
    <div className="animate-fade-in max-w-7xl mx-auto">
      <header className="mb-14 flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-extrabold mb-3 tracking-tighter text-white">
            Overview
          </h1>
          <p className="text-lg text-slate-400 font-medium">
            안녕하세요, <span className="text-white">BrandingForYou</span> 팀! 오늘의 자동화 현황입니다.
          </p>
        </div>
        <div className="hidden md:flex gap-4">
          <div className="text-right">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Last Update</p>
            <p className="text-sm font-semibold text-slate-300">오늘 오후 5:24</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {stats.map((stat, i) => (
          <div key={i} className="glass-card p-8 relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-[0.03] -mr-16 -mt-16 rounded-full group-hover:opacity-[0.08] transition-opacity duration-500`} />
            
            <div className="flex justify-between items-start mb-8">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg shadow-black/20`}>
                <stat.icon className="w-7 h-7 text-white" />
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Status</span>
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {stat.sub}
                </span>
              </div>
            </div>
            
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">{stat.label}</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-white">{stat.value}</span>
              <span className="text-slate-600 font-bold italic">records</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <section className="lg:col-span-3 glass-card p-10">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              최근 리서치 타임라인
            </h2>
            <button className="text-sm font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors">
              전체 보기 <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center justify-between p-6 rounded-3xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-all group">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center font-black text-slate-400 group-hover:text-indigo-400 group-hover:scale-105 transition-all">
                    {item}
                  </div>
                  <div>
                    <p className="text-lg font-bold text-slate-200">현대자동차 자율주행 {item}</p>
                    <p className="text-sm text-slate-500">2시간 전 · 마케팅 팀 발송 완료</p>
                  </div>
                </div>
                <button className="p-3 rounded-xl bg-white/5 text-slate-500 hover:text-white hover:bg-indigo-500 transition-all">
                  <ExternalLink className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="lg:col-span-2 glass-card p-10 bg-gradient-to-br from-indigo-600/10 to-purple-600/10 border-indigo-500/10 relative overflow-hidden group">
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all duration-700" />
          
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center mb-8 shadow-2xl shadow-indigo-500/30">
              <Search className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-white">신규 리서치 가동</h3>
            <p className="text-slate-400 mb-10 leading-relaxed font-medium">
              새로운 업체나 키워드를 등록하면<br/>AI가 24시간 트렌드를 추적합니다.
            </p>
            <Link href="/research" className="btn-premium btn-primary w-full shadow-2xl">
              리서치 등록하기
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
