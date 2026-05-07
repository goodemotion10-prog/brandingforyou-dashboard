"use client";

import { useState, useEffect } from "react";
import { 
  Users, 
  Search, 
  Mail, 
  Calendar, 
  TrendingUp, 
  CheckCircle,
  Clock,
  ArrowRight,
  Target,
  Sparkles,
  X,
  ChevronRight
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { marked } from 'marked';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: any;
  trend?: string;
  color: string;
}

function StatCard({ title, value, icon: Icon, trend, color }: StatCardProps) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2.5 rounded-xl ${color} bg-opacity-10 text-brand-600`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <span className="text-[12px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
            {trend}
          </span>
        )}
      </div>
      <h3 className="text-sm font-medium text-gray-500 mb-1">{title}</h3>
      <p className="text-2xl font-black text-gray-900 tracking-tight">{value}</p>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState({
    activeTasks: 0,
    totalResults: 0,
    lastRun: "대기 중"
  });
  const [recentResults, setRecentResults] = useState<any[]>([]);
  const [selectedResult, setSelectedResult] = useState<any | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    const { count: tasksCount } = await supabase
      .from("research_tasks")
      .select("*", { count: "exact", head: true })
      .eq("status", "active");

    const { count: resultsCount } = await supabase
      .from("research_results")
      .select("*", { count: "exact", head: true });

    const { data: recent } = await supabase
      .from("research_results")
      .select("*, task:research_tasks(topic)")
      .order("created_at", { ascending: false })
      .limit(5);

    setStats({
      activeTasks: tasksCount || 0,
      totalResults: resultsCount || 0,
      lastRun: recent?.[0] ? new Date(recent[0].created_at).toLocaleDateString() : "기록 없음"
    });
    
    if (recent) setRecentResults(recent);
  };

  return (
    <div className="max-w-6xl animate-in fade-in duration-700">
      <header className="mb-10">
        <h1 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Dashboard Overview</h1>
        <p className="text-gray-500 font-medium">실시간 리서치 현황과 최근 분석 리포트를 확인하세요.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <StatCard 
          title="활성 리서치 키워드" 
          value={`${stats.activeTasks}개`} 
          icon={Search} 
          trend="+2 New"
          color="bg-brand-500"
        />
        <StatCard 
          title="총 리포트 생성" 
          value={`${stats.totalResults}건`} 
          icon={Mail} 
          trend="누적 데이터"
          color="bg-brand-500"
        />
        <StatCard 
          title="최근 업데이트" 
          value={stats.lastRun} 
          icon={Clock} 
          color="bg-brand-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* 최근 리포트 타임라인 */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-brand-600" />
              최근 생성된 리서치
            </h2>
            <a href="/history" className="text-sm font-bold text-brand-600 hover:underline flex items-center gap-1">
              전체 보기 <ArrowRight className="w-4 h-4" />
            </a>
          </div>
          <div className="space-y-4">
            {recentResults.length === 0 ? (
              <p className="text-gray-400 py-10 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">데이터가 없습니다.</p>
            ) : (
              recentResults.map((result, idx) => (
                <div 
                  key={result.id} 
                  onClick={() => setSelectedResult(result)}
                  className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:border-brand-300 transition-all group cursor-pointer flex items-center justify-between"
                >
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 bg-brand-500 rounded-full mb-2 group-hover:scale-150 transition-transform"></div>
                      <div className="w-px h-full bg-gray-100"></div>
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-gray-900 mb-1 group-hover:text-brand-600 transition-colors">
                        {result.title}
                      </h4>
                      <p className="text-sm text-gray-500 mb-2 line-clamp-1">{result.summary}</p>
                      <span className="text-[12px] font-bold text-gray-400 uppercase">
                        {new Date(result.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-brand-500 transition-colors" />
                </div>
              ))
            )}
          </div>
        </section>

        {/* 시스템 상태 및 통계 */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-brand-600" />
            리서치 인사이트
          </h2>
          <div className="bg-brand-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-brand-200">
            <Sparkles className="absolute right-[-20px] top-[-20px] w-40 h-40 text-white opacity-10 rotate-12" />
            <div className="relative z-10">
              <h3 className="text-2xl font-black mb-4 leading-tight">지능형 자동 리서치로<br/>비즈니스 기회를 포착하세요.</h3>
              <p className="text-brand-100 text-sm leading-relaxed mb-8 max-w-sm">
                현재 등록된 키워드들이 매일 아침 AI에 의해 분석되어 이메일로 전송되고 있습니다. 최신 트렌드를 놓치지 마세요.
              </p>
              <div className="flex gap-4">
                <a href="/research" className="px-6 py-3 bg-white text-brand-900 text-sm font-bold rounded-xl hover:bg-brand-50 transition-colors">
                  키워드 관리
                </a>
                <div className="flex items-center gap-2 text-brand-200 text-sm font-medium">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  System Healthy
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <p className="text-xs font-bold text-gray-400 uppercase mb-2">오늘의 데이터</p>
              <p className="text-lg font-black text-gray-900">100% 수집됨</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <p className="text-xs font-bold text-gray-400 uppercase mb-2">검색 정확도</p>
              <p className="text-lg font-black text-gray-900">Deep Focus</p>
            </div>
          </div>
        </section>
      </div>

      {/* 상세 보기 모달 (대시보드 공용) */}
      {selectedResult && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center text-white">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-gray-900 leading-tight">리포트 전문 보기</h2>
                  <p className="text-[12px] text-gray-400 font-medium">{new Date(selectedResult.created_at).toLocaleString()}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedResult(null)}
                className="p-2 bg-gray-50 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-grow overflow-y-auto p-8 md:p-12 bg-white">
              <article className="max-w-3xl mx-auto">
                <div className="mb-10 text-center">
                  <h1 className="text-3xl font-black text-gray-900 mb-6 leading-tight">
                    {selectedResult.title}
                  </h1>
                  <div className="h-1.5 w-16 bg-brand-500 mx-auto rounded-full"></div>
                </div>
                
                <div 
                  className="prose prose-brand max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-p:leading-relaxed prose-li:text-gray-600"
                  style={{
                    lineHeight: '1.8',
                    fontSize: '17px',
                    color: '#374151'
                  }}
                  dangerouslySetInnerHTML={{ __html: marked.parse(selectedResult.content) }}
                >
                </div>
              </article>
            </div>

            <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button 
                onClick={() => setSelectedResult(null)}
                className="px-8 py-3 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition-colors shadow-md"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
