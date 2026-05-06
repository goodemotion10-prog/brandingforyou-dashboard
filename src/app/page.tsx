import { 
  Users, 
  Search, 
  Mail, 
  ArrowUpRight 
} from "lucide-react";
import Link from "next/link";

const stats = [
  { label: "관리 중인 업체", value: "12", icon: Users, color: "text-blue-400" },
  { label: "이번 주 리서치", value: "48", icon: Search, color: "text-indigo-400" },
  { label: "발송된 이메일", value: "124", icon: Mail, color: "text-emerald-400" },
];

export default function Home() {
  return (
    <div className="animate-in">
      <header className="mb-10">
        <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "var(--font-outfit)" }}>안녕하세요, BrandingForYou 님!</h1>
        <p className="text-slate-400">오늘의 업계 리포트와 리서치 현황을 확인하세요.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {stats.map((stat, i) => (
          <div key={i} className="glass p-6 group hover:border-indigo-500/30 transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <ArrowUpRight className="w-5 h-5 text-slate-600 group-hover:text-slate-400 transition-colors" />
            </div>
            <p className="text-sm text-slate-400 mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-100">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="glass p-8">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            최근 리서치 활동
          </h2>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-transparent hover:border-white/10 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-xs">
                    B4Y
                  </div>
                  <div>
                    <p className="font-semibold text-slate-200">샘플 업체 {item}</p>
                    <p className="text-xs text-slate-500">2시간 전 리서치 완료</p>
                  </div>
                </div>
                <span className="text-xs px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">성공</span>
              </div>
            ))}
          </div>
          <Link href="/history" className="inline-block mt-6 text-sm text-indigo-400 hover:text-indigo-300 font-medium">
            모든 활동 보기 →
          </Link>
        </section>

        <section className="glass p-8 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-indigo-600/20 rounded-2xl flex items-center justify-center mb-6">
            <Search className="w-8 h-8 text-indigo-400" />
          </div>
          <h3 className="text-lg font-bold mb-2">새로운 리서치 시작하기</h3>
          <p className="text-sm text-slate-400 mb-6 max-w-xs">
            관심 있는 업체나 키워드를 등록하면 매일/매주 자동으로 최신 트렌드를 보고해 드립니다.
          </p>
          <Link href="/research" className="btn btn-primary px-8">
            리서치 관리 바로가기
          </Link>
        </section>
      </div>
    </div>
  );
}
