"use client";

import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

interface ToolCardProps {
  href: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
  tag: string;
}

function ToolCard({ href, icon, iconBg, iconColor, title, description, tag }: ToolCardProps) {
  return (
    <Link 
      href={href} 
      className="bg-white border border-slate-200 rounded-2xl p-6 text-center hover:-translate-y-1 hover:border-brand-500 hover:shadow-xl hover:shadow-brand-500/10 transition-all flex flex-col items-center gap-4 min-h-[280px]"
    >
      <div className="flex flex-col items-center gap-4 w-full">
        <div 
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
          style={{ backgroundColor: iconBg, color: iconColor }}
        >
          {icon}
        </div>
        <strong className="text-[18px] font-bold text-slate-900">{title}</strong>
      </div>
      <p className="text-[14px] text-slate-500 leading-relaxed">{description}</p>
      <div className="mt-auto flex justify-between items-center w-full text-[13px] font-medium text-brand-600">
        <span className="bg-brand-50 px-2.5 py-1 rounded-md">{tag}</span>
        <span>시작하기 →</span>
      </div>
    </Link>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[14px] font-bold text-brand-600 mb-4 uppercase tracking-wider flex items-center gap-2">
      {children}
      <div className="h-px bg-slate-200 flex-1 ml-2"></div>
    </div>
  );
}

export default function HubPage() {
  return (
    <div className="max-w-[1100px] mx-auto animate-in fade-in duration-700 pb-16">
      
      {/* Header */}
      <header className="mb-12 flex flex-col items-center text-center gap-4">
        <div className="flex flex-col items-center gap-4">
          <div className="bg-brand-500 text-white font-black w-12 h-12 flex items-center justify-center rounded-xl text-lg shadow-md">
            BFY
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 mb-2">브랜딩포유 AI 도구 허브</h1>
            <p className="text-slate-500 font-medium">SNS 마케팅 실무를 위한 AI 프롬프트 생성기 모음</p>
          </div>
        </div>
        <span className="bg-brand-500 text-white px-3 py-1 rounded-full text-xs font-bold mt-2">Beta v1.0</span>
      </header>

      <p className="text-slate-600 text-center max-w-2xl mx-auto mb-12 leading-relaxed">
        클라이언트 정보를 입력하면 최적화된 마케팅 프롬프트가 자동으로 구성됩니다.<br/>
        생성된 프롬프트를 Claude나 ChatGPT에 붙여넣어 고품질 결과물을 만드세요.
      </p>

      {/* 카테고리: 콘텐츠 제작 */}
      <section className="mb-14">
        <SectionLabel>콘텐츠 제작</SectionLabel>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <ToolCard 
            href="/tools/caption-generator.html" icon="📸" iconBg="#EEF2FF" iconColor="#4F46E5"
            title="인스타 캡션 생성기" tag="Instagram"
            description="업종·주제·톤 입력 → 후킹 문구와 해시태그 30개 자동 완성" 
          />
          <ToolCard 
            href="/tools/cardnews-generator.html" icon="📰" iconBg="#FFF7ED" iconColor="#EA580C"
            title="카드뉴스 프롬프트" tag="Design"
            description="5장 구성의 카드뉴스 흐름과 이미지 생성용 프롬프트 설계" 
          />
          <ToolCard 
            href="/tools/thread-blog-generator.html" icon="✍️" iconBg="#F0FDF4" iconColor="#16A34A"
            title="스레드·블로그 생성기" tag="Multi-Channel"
            description="핵심 키워드 하나로 스레드용 요약과 블로그용 긴 글 동시 생성" 
          />
          <ToolCard 
            href="/tools/youtube-script.html" icon="🎬" iconBg="#FEF2F2" iconColor="#DC2626"
            title="유튜브 스크립트 구조" tag="Video"
            description="주제와 길이에 맞춘 후킹-본론-CTA 3단계 대본 구조 설계" 
          />
        </div>
      </section>

      {/* 카테고리: 전략 설계 */}
      <section className="mb-14">
        <SectionLabel>전략 설계</SectionLabel>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <ToolCard 
            href="/tools/funnel-designer.html" icon="🎯" iconBg="#FDF4FF" iconColor="#C026D3"
            title="마케팅 퍼널 설계" tag="Strategy"
            description="업종과 타깃에 맞춘 AIDA 기반 단계별 마케팅 전략 수립" 
          />
          <ToolCard 
            href="/tools/content-calendar.html" icon="📅" iconBg="#F0F9FF" iconColor="#0284C7"
            title="콘텐츠 캘린더 생성" tag="Planning"
            description="업종별 시즌 이슈를 반영한 한 달 분량 콘텐츠 주제 제안" 
          />
        </div>
      </section>

      {/* 카테고리: 클라이언트 업무 */}
      <section className="mb-14">
        <SectionLabel>클라이언트 업무</SectionLabel>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* 리서치 대시보드 카드 추가 (가장 중요) */}
          <Link 
            href="/research-dashboard" 
            className="bg-brand-900 border border-brand-800 rounded-2xl p-6 text-center hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-500/20 transition-all flex flex-col items-center gap-4 min-h-[280px] relative overflow-hidden group"
          >
            <Sparkles className="absolute right-[-10px] top-[-10px] w-24 h-24 text-white opacity-5 group-hover:opacity-10 group-hover:rotate-12 transition-all" />
            <div className="flex flex-col items-center gap-4 w-full relative z-10">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-white/10 text-white">
                <Sparkles className="w-8 h-8" />
              </div>
              <strong className="text-[18px] font-bold text-white">매일 자동 리서치</strong>
            </div>
            <p className="text-[14px] text-brand-100 leading-relaxed relative z-10">
              키워드 기반의 트렌드 분석 및 AI 자동 리서치 리포트 열람
            </p>
            <div className="mt-auto flex justify-between items-center w-full text-[13px] font-medium text-white relative z-10">
              <span className="bg-white/20 px-2.5 py-1 rounded-md">Dashboard</span>
              <span className="flex items-center gap-1">열람하기 <ArrowRight className="w-4 h-4"/></span>
            </div>
          </Link>

          <ToolCard 
            href="/tools/naver-seo.html" icon="🔍" iconBg="#F0FDF4" iconColor="#16A34A"
            title="네이버 블로그 SEO 구조" tag="Naver Blog"
            description="상위 노출을 위한 검색 의도 분석 및 포스팅 목차 설계" 
          />
          <ToolCard 
            href="/tools/proposal-generator.html" icon="📋" iconBg="#F8FAFC" iconColor="#475569"
            title="마케팅 제안서 구조" tag="Business"
            description="클라이언트 맞춤형 제안 포인트와 5단계 제안서 목차 생성" 
          />
        </div>
      </section>

      {/* 카테고리: 보조 도구 */}
      <section className="mb-14">
        <SectionLabel>보조 도구</SectionLabel>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <ToolCard 
            href="/tools/hashtag-analyzer.html" icon="#️⃣" iconBg="#FFFBEB" iconColor="#D97706"
            title="해시태그 효과 분석" tag="Instagram"
            description="사용 중인 해시태그의 규모별 비율(대/중/소) 분석 및 최적화" 
          />
          <ToolCard 
            href="/tools/lecture-copy.html" icon="🎓" iconBg="#F5F3FF" iconColor="#7C3AED"
            title="강의 랜딩 카피 생성" tag="Copywriting"
            description="강의의 혜택과 차별점을 강조하는 상세페이지 카피 라이팅" 
          />
          <ToolCard 
            href="/tools/bni-message.html" icon="🤝" iconBg="#FEF2F2" iconColor="#DC2626"
            title="BNI 추천 메시지" tag="Networking"
            description="비즈니스 협업을 위한 멤버 추천 및 소개 멘트 자동 생성" 
          />
          <ToolCard 
            href="/tools/naver-keyword.html" icon="📊" iconBg="#ECFDF5" iconColor="#059669"
            title="네이버 키워드 분석" tag="SEO Data"
            description="키워드별 검색량과 블로그 발행량 기반 경쟁도 분석 (API)" 
          />
        </div>
      </section>

      {/* 하단 플로우 박스 */}
      <div className="mt-16 bg-brand-50 rounded-3xl p-10 text-center">
        <h3 className="text-brand-600 font-bold mb-8 uppercase tracking-widest text-sm">모든 도구 공통 사용 흐름</h3>
        <div className="flex flex-col md:flex-row justify-center items-start gap-6 md:gap-2">
          {[
            { num: "1", text: "도구 선택" },
            { num: "2", text: "브랜드/상황 입력" },
            { num: "3", text: "프롬프트 생성" },
            { num: "4", text: "복사 후 AI 붙여넣기" },
            { num: "5", text: "결과물 실무 적용" }
          ].map((step, idx) => (
            <div key={idx} className="flex flex-col md:flex-row items-start md:contents">
              <div className="flex items-center md:flex-col gap-4 md:gap-3 w-full md:w-auto">
                <div className="w-8 h-8 rounded-full bg-brand-600 text-white font-bold flex items-center justify-center text-sm shadow-md shrink-0">
                  {step.num}
                </div>
                <p className="text-slate-800 font-medium text-sm md:w-28 leading-snug text-left md:text-center">{step.text}</p>
              </div>
              {idx < 4 && (
                <div className="hidden md:block text-brand-300 text-3xl font-light leading-none pt-0.5 px-2">
                  ›
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
