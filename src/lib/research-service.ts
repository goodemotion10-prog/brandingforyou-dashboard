import { Resend } from 'resend';
import { GoogleGenerativeAI } from '@google/generative-ai';

const resend = new Resend(process.env.RESEND_API_KEY);
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// 수신자 이메일 고정 (사용자 요청 반영)
const ADMIN_EMAIL = 'goodemotion10@gmail.com';

export async function performResearch(topic: string, frequency: string = 'daily') {
  try {
    // 1. Tavily Search (최신성 강화)
    // frequency에 따라 검색 범위를 'day'(24시간) 또는 'week'(1주일)로 제한
    const timeRange = frequency === 'weekly' ? 'week' : 'day';
    
    const searchResponse = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: process.env.TAVILY_API_KEY,
        query: `${topic} 최신 이슈 뉴스 트렌드 변화`,
        search_depth: "advanced",
        include_answer: true,
        max_results: 6,
        time_range: timeRange // 최신 이슈 중심 검색 핵심 옵션
      })
    });
    
    const searchData = await searchResponse.json();
    const context = searchData.results?.map((r: any) => `[제목: ${r.title}]\n[내용: ${r.content}]\n[출처: ${r.url}]`).join('\n\n') || "최근 24시간 내에 발견된 새로운 소식이 없습니다.";

    // 2. Gemini Summary (프롬프트 강화)
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
    const prompt = `당신은 브랜딩포유(BrandingForYou)의 수석 리서치 애널리스트입니다. 
    오늘의 미션은 "${topic}"에 대해 지난 ${frequency === 'weekly' ? '1주일' : '24시간'} 동안 발생한 **'새로운' 이슈와 변화**를 포착하여 보고하는 것입니다.
    
    지침:
    - 뻔한 정보보다는 어제와 오늘 사이에 새롭게 등장한 뉴스, 블로그, 트렌드 변화를 우선적으로 다루세요.
    - 만약 아주 새로운 소식이 없다면, 현재 시점에서 가장 주목해야 할 관련 동향을 분석하세요.
    - 한국어로 작성하며, 전문적이면서도 가독성이 높은 비즈니스 어투(~합니다)를 사용하세요.
    
    형식:
    1. 🚀 핵심 요약 (어제오늘 가장 중요한 변화 1~2줄)
    2. 📈 주요 이슈 및 뉴스 (최신순 리스트)
    3. 💡 비즈니스 인사이트 및 제언 (브랜딩포유를 위한 전략적 제안)
    
    검색 결과 데이터:
    ${context}`;

    const result = await model.generateContent(prompt);
    const summary = result.response.text();

    return {
      success: true,
      summary,
      sources: searchData.results || []
    };
  } catch (error) {
    console.error('Research failed:', error);
    return { success: false, error: String(error) };
  }
}

export async function sendResearchEmail(to: string, topic: string, content: string) {
  try {
    // 사용자 요청에 따라 모든 발송을 고정된 ADMIN_EMAIL로 강제 전환
    const finalRecipient = ADMIN_EMAIL;
    
    // 제목 깨짐 방지를 위해 특수문자 제거 및 깔끔한 정리
    const cleanTopic = topic.replace(/[^\w\sㄱ-ㅎ가-힣]/gi, '').trim();
    const subject = `[B4Y 리서치] ${cleanTopic} 최신 보고서`;

    const { data, error } = await resend.emails.send({
      from: 'BrandingForYou <onboarding@resend.dev>',
      to: [finalRecipient],
      subject: subject,
      html: `
        <div style="font-family: 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px;">
          <div style="margin-bottom: 30px;">
            <span style="background-color: #6366f1; color: #ffffff; padding: 6px 12px; border-radius: 8px; font-size: 12px; font-weight: bold; letter-spacing: 1px;">DAILY INTELLIGENCE</span>
          </div>
          <h1 style="color: #1e293b; font-size: 24px; font-weight: 800; margin-bottom: 10px; line-height: 1.3;">
            ${cleanTopic} 리서치 리포트
          </h1>
          <p style="font-size: 14px; color: #64748b; margin-bottom: 30px;">
            안녕하세요 대표님, 요청하신 주제에 대해 지난 ${content.includes('1주일') ? '7일' : '24시간'}간의 데이터를 분석한 결과입니다.
          </p>
          <div style="background-color: #f8fafc; padding: 25px; border-radius: 12px; line-height: 1.8; color: #334155; font-size: 15px; border-left: 4px solid #6366f1;">
            ${content ? content.replace(/\n/g, '<br>') : '리포트 내용을 생성하는 중 오류가 발생했습니다.'}
          </div>
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center;">
            <p style="font-size: 12px; color: #94a3b8;">본 리포트는 BrandingForYou AI 자동화 엔진(Gemini-Flash)에 의해 생성되었습니다.</p>
          </div>
        </div>
      `,
    });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Email failed:', error);
    return { success: false, error: String(error) };
  }
}
