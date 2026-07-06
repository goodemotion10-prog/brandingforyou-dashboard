"use client";

import { useState, useEffect } from "react";
import { 
  FileText, 
  Calendar, 
  User, 
  Building, 
  Link as LinkIcon, 
  Trash2, 
  Copy, 
  Download, 
  Database, 
  AlertTriangle, 
  CheckCircle2,
  ExternalLink
} from "lucide-react";

interface Posting {
  id: string;
  company_name: string;
  url: string;
  title: string;
  employee_name: string;
  date: string;
  created_at?: string;
}

export default function DailyReportPage() {
  const [isLocalMode, setIsLocalMode] = useState(true);
  const [isTableMissing, setIsTableMissing] = useState(false);
  const [postings, setPostings] = useState<Posting[]>([]);
  const [loading, setLoading] = useState(false);

  // Form states
  const [postDate, setPostDate] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [postUrl, setPostUrl] = useState("");
  const [postTitle, setPostTitle] = useState("");

  // Filter states
  const [viewDate, setViewDate] = useState("");

  // Datalist companies
  const [companies, setCompanies] = useState<string[]>([]);

  const LOCAL_STORAGE_KEY = "bfy_local_postings";
  const WRITER_KEY = "bfy_writer_name";

  // Format date helper
  const getTodayStr = () => {
    const today = new Date();
    const offset = today.getTimezoneOffset() * 60000;
    const localToday = new Date(today.getTime() - offset);
    return localToday.toISOString().split("T")[0];
  };

  useEffect(() => {
    const todayStr = getTodayStr();
    setPostDate(todayStr);
    setViewDate(todayStr);

    const savedWriter = localStorage.getItem(WRITER_KEY);
    if (savedWriter) {
      setEmployeeName(savedWriter);
    }
  }, []);

  // Fetch postings when viewDate changes
  useEffect(() => {
    if (viewDate) {
      loadPostings(viewDate);
    }
  }, [viewDate]);

  // Load postings
  const loadPostings = async (dateStr: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/postings?date=${dateStr}`);
      if (res.status === 404) {
        handleFallback(dateStr);
        return;
      }
      const response = await res.json();

      if (response.supabase_configured === true) {
        setIsLocalMode(false);
        setIsTableMissing(false);
        setPostings(response.data || []);
      } else if (response.table_missing === true) {
        setIsLocalMode(true);
        setIsTableMissing(true);
        handleFallback(dateStr);
      } else {
        setIsLocalMode(true);
        setIsTableMissing(false);
        handleFallback(dateStr);
      }
    } catch (err) {
      setIsLocalMode(true);
      setIsTableMissing(false);
      handleFallback(dateStr);
    } finally {
      setLoading(false);
    }
  };

  const handleFallback = (dateStr: string) => {
    const dataRaw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (dataRaw) {
      try {
        const list = JSON.parse(dataRaw) as Posting[];
        setPostings(list.filter(item => item.date === dateStr));
      } catch (e) {
        setPostings([]);
      }
    } else {
      setPostings([]);
    }
  };

  // Update datalist of company names
  useEffect(() => {
    const uniqueCompanies = new Set<string>();
    postings.forEach(p => uniqueCompanies.add(p.company_name));
    
    // Add all from history
    const dataRaw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (dataRaw) {
      try {
        const list = JSON.parse(dataRaw) as Posting[];
        list.forEach(p => uniqueCompanies.add(p.company_name));
      } catch (e) {}
    }
    setCompanies(Array.from(uniqueCompanies).sort());
  }, [postings]);

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!postDate || !companyName.trim() || !postUrl.trim() || !postTitle.trim()) {
      alert("필수 입력 항목을 모두 작성해주세요.");
      return;
    }

    if (employeeName.trim()) {
      localStorage.setItem(WRITER_KEY, employeeName.trim());
    }

    const payload = {
      company_name: companyName.trim(),
      url: postUrl.trim(),
      title: postTitle.trim(),
      employee_name: employeeName.trim(),
      date: postDate
    };

    setLoading(true);

    if (isLocalMode) {
      const newPost: Posting = {
        id: "local_" + Math.random().toString(36).substring(2, 11),
        created_at: new Date().toISOString(),
        ...payload
      };
      
      const dataRaw = localStorage.getItem(LOCAL_STORAGE_KEY) || "[]";
      try {
        const list = JSON.parse(dataRaw);
        list.push(newPost);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
        alert("포스팅이 정상적으로 등록되었습니다. (로컬 브라우저 저장)");
        
        setCompanyName("");
        setPostUrl("");
        setPostTitle("");
        
        setViewDate(postDate);
        loadPostings(postDate);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    } else {
      try {
        const res = await fetch("/api/postings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const response = await res.json();

        if (response.supabase_configured === true && response.data) {
          alert("포스팅이 실시간 데이터베이스에 등록되었습니다!");
          setCompanyName("");
          setPostUrl("");
          setPostTitle("");
          setViewDate(postDate);
          loadPostings(postDate);
        } else {
          alert(`서버 저장 중 오류 발생: ${response.error || "알 수 없음"}\n임시 로컬 모드로 동작을 백업합니다.`);
          setIsLocalMode(true);
          saveLocalDirectly(payload);
        }
      } catch (err: any) {
        alert("네트워크 오류가 발생하여 임시 로컬 모드로 등록합니다.");
        setIsLocalMode(true);
        saveLocalDirectly(payload);
      } finally {
        setLoading(false);
      }
    }
  };

  const saveLocalDirectly = (payload: any) => {
    const newPost: Posting = {
      id: "local_" + Math.random().toString(36).substring(2, 11),
      created_at: new Date().toISOString(),
      ...payload
    };
    const dataRaw = localStorage.getItem(LOCAL_STORAGE_KEY) || "[]";
    try {
      const list = JSON.parse(dataRaw);
      list.push(newPost);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
      setCompanyName("");
      setPostUrl("");
      setPostTitle("");
      setViewDate(postDate);
      loadPostings(postDate);
    } catch(e) {}
  };

  // Delete posting
  const handleDelete = async (id: string) => {
    if (!confirm("정말로 이 포스팅 내역을 삭제하시겠습니까?")) return;

    setLoading(true);

    if (id.startsWith("local_") || isLocalMode) {
      const dataRaw = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (dataRaw) {
        try {
          let list = JSON.parse(dataRaw) as Posting[];
          list = list.filter(item => item.id !== id);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
          alert("포스팅이 정상적으로 삭제되었습니다.");
          loadPostings(viewDate);
        } catch (e) {}
      }
      setLoading(false);
    } else {
      try {
        const res = await fetch(`/api/postings?id=${id}`, {
          method: "DELETE"
        });
        const response = await res.json();

        if (response.supabase_configured === true) {
          alert("데이터베이스에서 포스팅이 정상적으로 삭제되었습니다.");
          loadPostings(viewDate);
        } else {
          alert(`서버 삭제 중 오류 발생: ${response.error || "알 수 없음"}\n로컬에서 임시 삭제를 진행합니다.`);
          const dataRaw = localStorage.getItem(LOCAL_STORAGE_KEY);
          if (dataRaw) {
            try {
              let list = JSON.parse(dataRaw) as Posting[];
              list = list.filter(item => item.id !== id);
              localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
            } catch (e) {}
          }
          loadPostings(viewDate);
        }
      } catch (err: any) {
        alert("네트워크 오류로 서버에서 삭제하지 못했습니다. 로컬 내역만 정리합니다.");
        loadPostings(viewDate);
      } finally {
        setLoading(false);
      }
    }
  };

  const formatKoreanDate = (dateString: string) => {
    if (!dateString) return "";
    const parts = dateString.split("-");
    if (parts.length !== 3) return dateString;
    const month = parseInt(parts[1], 10);
    const day = parseInt(parts[2], 10);
    return `${month}월 ${day}일`;
  };

  const getReportText = () => {
    if (postings.length === 0) {
      return "선택한 날짜에 등록된 포스팅이 없습니다.";
    }

    const koreanDate = formatKoreanDate(viewDate);
    return postings.map((p) => {
      return `[${koreanDate}] ${p.company_name} 포스팅입니다!\n${p.url}\n-${p.title}`;
    }).join("\n\n");
  };

  const copyReportText = () => {
    const text = getReportText();
    if (text === "선택한 날짜에 등록된 포스팅이 없습니다.") {
      alert("복사할 보고서 내용이 없습니다.");
      return;
    }

    navigator.clipboard.writeText(text).then(() => {
      alert("📋 보고서 내용이 클립보드에 복사되었습니다! 메신저에 붙여넣어 사용하세요.");
    }).catch(() => {
      alert("복사에 실패했습니다.");
    });
  };

  const downloadReportFile = () => {
    const text = getReportText();
    if (text === "선택한 날짜에 등록된 포스팅이 없습니다.") {
      alert("다운로드할 보고서 내용이 없습니다.");
      return;
    }

    const formattedDate = viewDate.replace(/-/g, "_");
    const filename = `데일리보고_${formattedDate}.txt`;

    const blob = new Blob([text], { type: "text/plain;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getGroupedPostings = () => {
    const groups: { [key: string]: Posting[] } = {};
    postings.forEach(p => {
      if (!groups[p.company_name]) {
        groups[p.company_name] = [];
      }
      groups[p.company_name].push(p);
    });
    return groups;
  };

  const groupedPostings = getGroupedPostings();
  const reportText = getReportText();

  const sqlQueryText = `CREATE TABLE IF NOT EXISTS daily_postings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  company_name TEXT NOT NULL,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  employee_name TEXT
);

ALTER TABLE daily_postings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read" ON daily_postings FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON daily_postings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public delete" ON daily_postings FOR DELETE USING (true);`;

  return (
    <div className="max-w-4xl animate-in fade-in duration-500 space-y-6">
      {/* Header */}
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1 flex items-center gap-2">
            <FileText className="w-6 h-6 text-brand-600" />
            데일리 포스팅 보고
          </h1>
          <p className="text-sm text-gray-500">각 직원이 작성한 오늘자 포스팅을 등록하고 데일리 보고용 텍스트를 추출합니다.</p>
        </div>
      </header>

      {/* Database status banner */}
      <div>
        {!isLocalMode ? (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex gap-3 items-start shadow-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">🟢 공유 데이터베이스 연동 완료 (Supabase)</p>
              <p className="text-xs text-emerald-700 mt-1">실시간으로 모든 팀원의 포스팅 정보가 클라우드 데이터베이스에 저장되고 공유됩니다.</p>
            </div>
          </div>
        ) : isTableMissing ? (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex flex-col gap-2 shadow-sm">
            <div className="flex gap-3 items-start">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">❌ Supabase 테이블 미생성 오류</p>
                <p className="text-xs text-rose-700 mt-1">
                  데이터베이스 연결 정보는 유효하나 <code>daily_postings</code> 테이블이 데이터베이스에 존재하지 않습니다. 
                  현재 임시로 <strong>로컬 저장소 모드</strong>로 백업 작동 중입니다.
                </p>
              </div>
            </div>
            <details className="mt-2 bg-white rounded-lg p-3 border border-rose-100 text-gray-800">
              <summary className="text-xs font-bold text-rose-700 cursor-pointer outline-none">
                개발자/관리자 테이블 생성 SQL 가이드 보기
              </summary>
              <p className="text-xs text-gray-500 mt-2">Supabase 프로젝트의 <strong>SQL Editor</strong>에 접속하여 아래 쿼리를 붙여넣고 Run을 실행해주세요.</p>
              <pre className="bg-gray-50 p-3 rounded text-xs font-mono overflow-x-auto max-h-40 border border-gray-200 text-gray-700 mt-2 whitespace-pre">
                {sqlQueryText}
              </pre>
            </details>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm flex flex-col gap-2 shadow-sm">
            <div className="flex gap-3 items-start">
              <Database className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">⚠️ 로컬 브라우저 저장소 모드</p>
                <p className="text-xs text-amber-700 mt-1">
                  데이터베이스(Supabase) 연동 설정이 부재하여 현재 접속하신 PC 브라우저에만 데이터가 저장됩니다. 
                  팀원들과 데이터를 공유하여 하나의 파일로 취합하려면 배포 환경 변수 설정을 완료하세요.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* STEP 1: 포스팅 등록 (직원용) */}
        <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-200/60">
          <h2 className="text-lg font-bold text-gray-900 mb-4 pb-3 border-b border-gray-100 flex items-center gap-2">
            <span className="w-5 h-5 bg-brand-100 text-brand-700 rounded-full flex items-center justify-center text-xs font-bold">1</span>
            포스팅 등록 (직원용)
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5" htmlFor="post-date">
                  포스팅 날짜
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="date" 
                    id="post-date"
                    value={postDate}
                    onChange={(e) => setPostDate(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-100 focus:border-brand-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5" htmlFor="employee-name">
                  작성자 (직원명)
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="text" 
                    id="employee-name"
                    value={employeeName}
                    onChange={(e) => setEmployeeName(e.target.value)}
                    placeholder="예: 홍길동"
                    className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-100 focus:border-brand-500"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5" htmlFor="company-name">
                업체명 (클라이언트)
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  id="company-name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="예: 집현전"
                  list="companies-datalist"
                  className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-100 focus:border-brand-500"
                  required
                />
                <datalist id="companies-datalist">
                  {companies.map(c => <option key={c} value={c} />)}
                </datalist>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5" htmlFor="post-url">
                포스팅 URL
              </label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="url" 
                  id="post-url"
                  value={postUrl}
                  onChange={(e) => setPostUrl(e.target.value)}
                  placeholder="예: https://blog.naver.com/yslawfirm27/224312554322"
                  className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-100 focus:border-brand-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5" htmlFor="post-title">
                포스팅 제목
              </label>
              <input 
                type="text" 
                id="post-title"
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
                placeholder="예: 광교 교통사고 변호사 - 뺑소니 처벌, 오해라면 피할 수 있을까?"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-100 focus:border-brand-500"
                required
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? "처리 중..." : "✨ 포스팅 등록하기"}
            </button>
          </form>
        </section>

        {/* STEP 2: 포스팅 제출 현황 */}
        <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-200/60">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-3 mb-4 gap-3">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span className="w-5 h-5 bg-brand-100 text-brand-700 rounded-full flex items-center justify-center text-xs font-bold">2</span>
              포스팅 제출 현황
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-500 shrink-0">조회 날짜</span>
              <input 
                type="date"
                value={viewDate}
                onChange={(e) => setViewDate(e.target.value)}
                className="px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-brand-100 focus:border-brand-500 font-medium"
              />
            </div>
          </div>

          {loading && postings.length === 0 ? (
            <div className="text-center py-12 text-sm text-gray-400 flex items-center justify-center gap-2">
              <span className="animate-spin text-lg">⏳</span> 데이터를 로딩하는 중입니다...
            </div>
          ) : postings.length === 0 ? (
            <div className="text-center py-12 text-gray-400 border border-dashed border-gray-200 rounded-xl">
              <span className="text-2xl block mb-2">📭</span>
              등록된 포스팅이 없습니다.<br />오늘 올린 첫 번째 포스팅을 위에서 입력해 보세요!
            </div>
          ) : (
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
              {Object.keys(groupedPostings).sort().map(company => {
                const items = groupedPostings[company];
                return (
                  <div key={company} className="border border-gray-200/60 rounded-xl p-4 bg-gray-50/50">
                    <div className="flex items-center justify-between border-b border-gray-200/60 pb-2 mb-3">
                      <span className="bg-brand-50 text-brand-700 text-xs font-bold px-2.5 py-1 rounded-md border border-brand-100">
                        {company}
                      </span>
                      <span className="text-xs text-gray-400 font-semibold">총 {items.length}개</span>
                    </div>
                    <div className="divide-y divide-gray-150">
                      {items.map(item => (
                        <div key={item.id} className="py-2.5 first:pt-0 last:pb-0 flex justify-between items-start gap-4">
                          <div className="flex-1 min-w-0">
                            <a 
                              href={item.url} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-sm font-bold text-gray-900 hover:text-brand-600 hover:underline flex items-center gap-1.5 group"
                            >
                              <span className="truncate">{item.title}</span>
                              <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-brand-500 shrink-0" />
                            </a>
                            <div className="flex items-center gap-3 mt-1.5">
                              <a 
                                href={item.url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-xs text-brand-600 truncate max-w-[200px] hover:underline"
                              >
                                {item.url}
                              </a>
                              {item.employee_name && (
                                <span className="bg-gray-200/60 text-gray-500 text-[10px] px-1.5 py-0.5 rounded font-bold">
                                  작성자: {item.employee_name}
                                </span>
                              )}
                            </div>
                          </div>
                          <button 
                            onClick={() => handleDelete(item.id)}
                            className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer shrink-0"
                            title="삭제"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* STEP 3: 데일리 보고 텍스트 추출 */}
        <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-200/60">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4 gap-3">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span className="w-5 h-5 bg-brand-100 text-brand-700 rounded-full flex items-center justify-center text-xs font-bold">3</span>
              데일리 보고 텍스트 추출
            </h2>
            {postings.length > 0 && (
              <div className="flex gap-2">
                <button 
                  onClick={copyReportText}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  텍스트 복사
                </button>
                <button 
                  onClick={downloadReportFile}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  파일 다운로드 (.txt)
                </button>
              </div>
            )}
          </div>
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200/60 min-h-[120px] max-h-60 overflow-y-auto">
            <p className="text-sm text-gray-800 font-mono whitespace-pre-wrap leading-relaxed">
              {reportText}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
