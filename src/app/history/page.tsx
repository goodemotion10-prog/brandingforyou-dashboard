"use client";

import { useState, useEffect } from "react";
import { 
  FileText, 
  Calendar, 
  Search, 
  ChevronRight, 
  ExternalLink, 
  Clock,
  Filter,
  Download,
  Loader2,
  X,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { marked } from 'marked';

interface ResearchResult {
  id: string;
  task_id: string;
  title: string;
  content: string;
  summary: string;
  created_at: string;
  task?: {
    topic: string;
  };
}

export default function ResearchHistory() {
  const [results, setResults] = useState<ResearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedResult, setSelectedResult] = useState<ResearchResult | null>(null);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("research_results")
      .select(`
        *,
        task:research_tasks(topic)
      `)
      .order("created_at", { ascending: false });
    
    if (data) setResults(data);
    setLoading(false);
  };

  const filteredResults = results.filter(r => 
    r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.task?.topic.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">리서치 결과 History</h1>
          <p className="text-sm text-gray-500">지금까지 수집된 모든 리서치 리포트를 확인하세요.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="주제 검색..."
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 w-64 shadow-sm bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors bg-white shadow-sm">
            <Filter className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </header>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-brand-500 animate-spin mb-4" />
          <p className="text-sm text-gray-500">데이터를 불러오는 중...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResults.length === 0 ? (
            <div className="col-span-full py-20 text-center bg-white rounded-2xl border border-dashed border-gray-200">
              <p className="text-gray-400">검색 결과가 없습니다.</p>
            </div>
          ) : (
            filteredResults.map((result) => (
              <div 
                key={result.id} 
                onClick={() => setSelectedResult(result)}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-brand-200 transition-all cursor-pointer group flex flex-col h-full"
              >
                <div className="p-5 flex-grow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-brand-50 rounded-lg text-brand-600 border border-brand-100 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                      <FileText className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50 px-2 py-1 rounded">
                      {new Date(result.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 leading-snug group-hover:text-brand-600 transition-colors">
                    {result.title}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-3 leading-relaxed mb-4">
                    {result.summary}
                  </p>
                </div>
                <div className="px-5 py-4 bg-gray-50/50 border-t border-gray-100 rounded-b-2xl flex justify-between items-center">
                  <div className="flex items-center gap-2 text-[12px] font-medium text-gray-500">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    {new Date(result.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="flex items-center gap-1 text-brand-600 text-xs font-bold group-hover:translate-x-1 transition-transform">
                    전문 보기
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 상세 보기 모달 */}
      {selectedResult && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-200">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-gray-900 leading-tight">리서치 결과 전문</h2>
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
                  <div className="h-1 w-20 bg-brand-500 mx-auto rounded-full"></div>
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

            <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
              <p className="text-sm text-gray-500 font-medium italic">
                &quot;{selectedResult.task?.topic || '리서치 주제'}&quot;에 대한 분석 결과입니다.
              </p>
              <button 
                onClick={() => setSelectedResult(null)}
                className="px-6 py-2.5 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition-colors shadow-md"
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
