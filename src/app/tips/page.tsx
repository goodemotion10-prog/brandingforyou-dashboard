"use client";

import { 
  Lightbulb, 
  Target, 
  Users, 
  Search, 
  CheckCircle2, 
  ArrowRight,
  Zap,
  MessageSquare,
  Sparkles
} from "lucide-react";

const TipCard = ({ icon: Icon, title, description, examples, color }: any) => (
  <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm hover:shadow-md transition-all hover:border-brand-200 group">
    <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
    <p className="text-gray-500 text-sm leading-relaxed mb-6">
      {description}
    </p>
    <div className="space-y-3">
      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Example Queries</p>
      {examples.map((ex: string, i: number) => (
        <div key={i} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-100 text-sm text-gray-700 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
          {ex}
        </div>
      ))}
    </div>
  </div>
);

export default function TipsPage() {
  return (
    <div className="max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-600 text-xs font-bold mb-4">
          <Sparkles className="w-3 h-3" />
          RESEARCH GUIDE
        </div>
        <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight leading-tight">
          더 날카로운 리서치 결과를 <br/>얻기 위한 가이드
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl font-medium">
          키워드 조합 하나로 AI의 분석 깊이가 달라집니다. <br/>브랜딩포유 대시보드를 200% 활용하는 방법을 알아보세요.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        <TipCard 
          icon={Target}
          title="키워드 + 구체적 목적"
          description="단순한 단어보다 '무엇의 무엇'인지 명확히 적을 때 AI가 가장 날카로운 분석을 내놓습니다."
          examples={[
            "현대자동차 자율주행 신기술 트렌드",
            "친환경 화장품 패키징 소재 변화"
          ]}
          color="bg-blue-600"
        />
        <TipCard 
          icon={Users}
          title="경쟁사 및 업체 추적"
          description="특정 업체를 추적하고 싶을 때는 업체명과 함께 '이슈'나 '전략' 단어를 붙여주세요."
          examples={[
            "[업체명] 최근 팝업스토어 운영 현황",
            "[경쟁사명] 2026년 마케팅 주력 전략"
          ]}
          color="bg-brand-600"
        />
        <TipCard 
          icon={MessageSquare}
          title="자연어 질문형 활용"
          description="질문 형태로 등록하면 AI가 검색 결과 중에서 그 질문에 대한 '정답'을 찾으려고 노력합니다."
          examples={[
            "인플루언서 마케팅에서 가장 효과적인 채널은?",
            "MZ세대가 선호하는 브랜드 경험의 특징은?"
          ]}
          color="bg-indigo-600"
        />
      </div>

      <section className="bg-brand-900 rounded-3xl p-10 text-white relative overflow-hidden shadow-xl">
        <Zap className="absolute right-[-20px] bottom-[-20px] w-64 h-64 text-white opacity-5" />
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-2xl font-black mb-6">💡 리서치 마스터의 한마디</h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center font-bold text-sm shrink-0">1</div>
              <p className="text-brand-100 leading-relaxed">
                <strong className="text-white">누가 + 무엇을 + 어떻게</strong> 하는지 포함된 디테일한 자연어 형태가 가장 좋습니다.
              </p>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center font-bold text-sm shrink-0">2</div>
              <p className="text-brand-100 leading-relaxed">
                매일 발송되는 리서치는 <strong className="text-white">최근 24시간 내 발생한 새로운 뉴스</strong>가 없을 경우 "소식 없음"으로 나올 수 있습니다. 이는 시스템이 정상적으로 최신 데이터를 필터링하고 있다는 증거입니다.
              </p>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center font-bold text-sm shrink-0">3</div>
              <p className="text-brand-100 leading-relaxed">
                한 달 최대 1,000건의 검색이 가능하므로, 핵심 키워드 <strong className="text-white">20~30개</strong>를 등록해 두는 것이 가장 효율적입니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="mt-16 text-center">
        <p className="text-gray-400 text-sm mb-6">지금 바로 새로운 키워드를 등록하러 가볼까요?</p>
        <a 
          href="/research" 
          className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-gray-800 transition-all hover:scale-105"
        >
          리서치 등록하러 가기
          <ArrowRight className="w-5 h-5" />
        </a>
      </footer>
    </div>
  );
}
