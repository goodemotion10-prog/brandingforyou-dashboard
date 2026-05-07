import { Resend } from 'resend';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { marked } from 'marked';

const resend = new Resend(process.env.RESEND_API_KEY);
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// 수신자 이메일 고정 (대표님 전용)
const ADMIN_EMAIL = 'goodemotion10@gmail.com';

export async function performResearch(topic: string, frequency: string = 'daily') {
  try {
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
        time_range: timeRange
      })
    });
    
    const searchData = await searchResponse.json();
    const context = searchData.results?.map((r: any) => `[제목: ${r.title}]\n[내용: ${r.content}]\n[출처: ${r.url}]`).join('\n\n') || "최근 24시간 내에 발견된 새로운 소식이 없습니다.";

    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
    const prompt = `당신은 브랜딩포유(BrandingForYou)의 수석 리서치 애널리스트입니다. 
    오늘의 미션은 "${topic}"에 대해 지난 ${frequency === 'weekly' ? '1주일' : '24시간'} 동안 발생한 **'새로운' 이슈와 변화**를 포착하여 보고하는 것입니다.
    
    지침:
    - 어제와 오늘 사이에 새롭게 등장한 뉴스, 블로그, 트렌드 변화를 우선적으로 다루세요.
    - 한국어로 작성하며, 전문적이면서도 가독성이 높은 비즈니스 어투(~합니다)를 사용하세요.
    
    형식:
    # 🚀 핵심 요약
    (가장 중요한 변화를 1~2줄로 요약)
    
    ## 📈 주요 이슈 및 뉴스
    - 항목별로 상세히 기술
    
    ## 💡 비즈니스 인사이트 및 제언
    - 전략적 제안 포함
    
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
    const finalRecipient = ADMIN_EMAIL;
    const cleanTopic = topic.replace(/[^\w\sㄱ-ㅎ가-힣]/gi, '').trim();
    const subject = `[B4Y 리서치] ${cleanTopic} 최신 보고서`;

    // 마크다운을 HTML로 변환
    const htmlContent = marked.parse(content);

    const { data, error } = await resend.emails.send({
      from: 'BrandingForYou <onboarding@resend.dev>',
      to: [finalRecipient],
      subject: subject,
      html: `
        <div style="font-family: 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 30px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 20px;">
          <div style="margin-bottom: 30px;">
            <span style="background-color: #6366f1; color: #ffffff; padding: 6px 14px; border-radius: 8px; font-size: 11px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase;">Daily Intelligence</span>
          </div>
          
          <h1 style="color: #0f172a; font-size: 26px; font-weight: 800; margin-bottom: 8px; line-height: 1.3; letter-spacing: -0.5px;">
            ${cleanTopic} 리포트
          </h1>
          <p style="font-size: 14px; color: #64748b; margin-bottom: 40px; font-weight: 400;">
            ${new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })} 발행
          </p>
          
          <div style="line-height: 1.8; color: #334155; font-size: 16px;">
            <style>
              h1, h2, h3 { color: #1e293b; margin-top: 30px; margin-bottom: 15px; font-weight: 800; }
              h1 { font-size: 22px; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px; }
              h2 { font-size: 19px; color: #4338ca; }
              p { margin-bottom: 16px; }
              ul, ol { margin-bottom: 20px; padding-left: 20px; }
              li { margin-bottom: 10px; }
              strong { color: #0f172a; font-weight: 700; }
              blockquote { border-left: 4px solid #e2e8f0; padding-left: 20px; color: #64748b; font-style: italic; margin: 20px 0; }
            </style>
            ${htmlContent}
          </div>
          
          <div style="margin-top: 50px; padding-top: 30px; border-top: 1px solid #f1f5f9; text-align: center;">
            <p style="font-size: 12px; color: #94a3b8; line-height: 1.6;">
              본 리포트는 BrandingForYou AI 자동화 엔진에 의해 생성되었습니다.<br>
              수신 거부 또는 설정 변경은 대시보드에서 가능합니다.
            </p>
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
