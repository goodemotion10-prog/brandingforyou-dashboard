"use client";

import { useState, useEffect } from "react";
import { 
  Users, 
  Search, 
  Mail, 
  TrendingUp,
  ExternalLink,
  ChevronRight,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [taskCount, setTaskCount] = useState(0);
  const [resultCount, setResultCount] = useState(0);
  const [recentResults, setRecentResults] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      
      // 1. 활성 리서치 태스크 수 가져오기
      const { count: tCount } = await supabase
        .from('research_tasks')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');
        
      if (tCount !== null) setTaskCount(tCount);

      // 2. 전체 리서치 발송(결과) 수 가져오기
      const { count: rCount } = await supabase
        .from('research_results')
        .select('*', { count: 'exact', head: true });
        
      if (rCount !== null) setResultCount(rCount);

      // 3. 최근 리서치 결과 가져오기 (타임라인용)
      const { data: results } = await supabase
        .from('research_results')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);
        
      if (results) setRecentResults(results);

      setLoading(false);
    }

    fetchData();
  }, []);

  const stats = [
    { label: "관리 업체 (활성)", value: loading ? "-" : taskCount, sub: "현재 가동 중", icon: Users, color: "text-blue-600 bg-blue-50" },
    { label: "주간 리서치 수집", value: loading ? "-" : resultCount, sub: "누적 수집량", icon: Search, color: "text-indigo-600 bg-indigo-50" },
    { label: "알림 발송", value: loading ? "-" : resultCount, sub: "정상 발송됨", icon: Mail, color: "text-emerald-600 bg-emerald-50" },
  ];

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in duration-500">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          대시보드 Overview
        </h1>
        <p className="text-sm text-gray-500">
          안녕하세요, BrandingForYou 자동화 현황입니다.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-gray-900">
                  {loading ? <Loader2 className="w-5 h-5 animate-spin text-gray-400 inline-block" /> : stat.value}
                </span>
                {!loading && (
                  <span className="text-xs font-medium text-emerald-600 flex items-center gap-0.5">
                    <TrendingUp className="w-3 h-3" />
                    {stat.sub}
                  </span>
                )}
              </div>
            </div>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <section className="lg:col-span-3 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-900">최근 리서치 타임라인</h2>
            <Link href="/history" className="text-sm font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1">
              전체 보기 <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="space-y-4">
            {loading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="w-6 h-6 animate-spin text-gray-300" />
              </div>
            ) : recentResults.length === 0 ? (
              <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                <p className="text-gray-500 text-sm">아직 생성된 리서치 기록이 없습니다.</p>
                <p className="text-gray-400 text-xs mt-1">리서치 관리에서 신규 리서치를 등록해 보세요.</p>
              </div>
            ) : (
              recentResults.map((result, index) => (
                <div key={result.id} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center font-bold text-gray-500 shadow-sm border border-gray-200">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{result.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {new Date(result.created_at).toLocaleString('ko-KR')} · 발송 완료
                      </p>
                    </div>
                  </div>
                  <Link href="/history" className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="lg:col-span-2 bg-brand-50 rounded-xl p-8 border border-brand-100 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-brand-100 text-brand-600">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold mb-2 text-gray-900">신규 리서치 가동</h3>
          <p className="text-sm text-gray-600 mb-8 leading-relaxed">
            새로운 업체나 키워드를 등록하면<br/>AI가 24시간 트렌드를 추적합니다.
          </p>
          <Link href="/research" className="w-full py-2.5 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 transition-colors shadow-sm">
            리서치 등록하기
          </Link>
        </section>
      </div>
    </div>
  );
}
