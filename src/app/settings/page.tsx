import { Settings as SettingsIcon, Shield, Bell, Database } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="max-w-4xl animate-in fade-in duration-500">
      <header className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1 flex items-center gap-2">
            <SettingsIcon className="w-6 h-6 text-brand-600" />
            시스템 설정
          </h1>
          <p className="text-sm text-gray-500">대시보드 관리자 설정 및 외부 연동 키를 관리합니다.</p>
        </div>
      </header>

      <div className="space-y-6">
        <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
            <Shield className="w-5 h-5 text-gray-400" />
            <h2 className="text-lg font-bold text-gray-900">API 연동 키 관리</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-bold text-gray-900">Tavily Search API</p>
                <p className="text-xs text-gray-500 mt-0.5">최신 웹 정보 검색용 엔진 연동</p>
              </div>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full border border-emerald-200">
                연결됨 (Active)
              </span>
            </div>
            
            <div className="flex items-center justify-between py-2 border-t border-gray-50">
              <div>
                <p className="text-sm font-bold text-gray-900">OpenAI (ChatGPT)</p>
                <p className="text-xs text-gray-500 mt-0.5">데이터 요약 및 리포트 작성 엔진 연동</p>
              </div>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full border border-emerald-200">
                연결됨 (Active)
              </span>
            </div>

            <div className="flex items-center justify-between py-2 border-t border-gray-50">
              <div>
                <p className="text-sm font-bold text-gray-900">Resend Email API</p>
                <p className="text-xs text-gray-500 mt-0.5">리포트 이메일 발송 서비스 연동</p>
              </div>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full border border-emerald-200">
                연결됨 (Active)
              </span>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
            <Database className="w-5 h-5 text-gray-400" />
            <h2 className="text-lg font-bold text-gray-900">데이터베이스 (Supabase)</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            현재 BrandingForYou 메인 데이터베이스와 연결되어 있습니다.
          </p>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-500 font-mono">Project URL: https://lxczauzjxfzvfcvxcnmw.supabase.co</p>
          </div>
        </section>
      </div>
    </div>
  );
}
