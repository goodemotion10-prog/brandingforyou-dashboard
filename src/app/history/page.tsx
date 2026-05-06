"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, History, FileText, Calendar } from "lucide-react";

export default function HistoryPage() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResults() {
      setLoading(true);
      const { data } = await supabase
        .from('research_results')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (data) setResults(data);
      setLoading(false);
    }
    fetchResults();
  }, []);

  return (
    <div className="max-w-5xl animate-in fade-in duration-500">
      <header className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1 flex items-center gap-2">
            <History className="w-6 h-6 text-brand-600" />
            리서치 결과 (History)
          </h1>
          <p className="text-sm text-gray-500">자동으로 수집된 리서치 리포트 기록을 확인합니다.</p>
        </div>
      </header>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-brand-500 animate-spin mb-4" />
          <p className="text-sm text-gray-500">기록을 불러오는 중...</p>
        </div>
      ) : results.length === 0 ? (
        <div className="bg-white rounded-xl p-16 flex flex-col items-center justify-center text-center shadow-sm border border-gray-100">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">수집된 리서치 결과가 없습니다</h3>
          <p className="text-sm text-gray-500 max-w-sm">
            리서치 스케줄러가 실행되면 이곳에 결과가 쌓입니다.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {results.map((result) => (
            <div key={result.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:border-brand-200 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-gray-900">{result.title}</h3>
                <span className="flex items-center gap-1.5 text-xs font-medium text-gray-500 bg-gray-50 px-2.5 py-1.5 rounded-md border border-gray-200">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(result.created_at).toLocaleString('ko-KR')}
                </span>
              </div>
              <div className="prose prose-sm prose-slate max-w-none text-gray-600 border-t border-gray-100 pt-4">
                <div dangerouslySetInnerHTML={{ __html: result.summary ? result.summary.replace(/\n/g, '<br/>') : '내용이 없습니다.' }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
