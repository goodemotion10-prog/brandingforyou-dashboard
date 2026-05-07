import { Resend } from 'resend';
import { GoogleGenerativeAI } from '@google/generative-ai';

const resend = new Resend(process.env.RESEND_API_KEY);
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function performResearch(topic: string) {
  try {
    // 1. Tavily Search
    const searchResponse = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: process.env.TAVILY_API_KEY,
        query: `${topic} 최신 이슈 및 트렌드`,
        search_depth: "advanced",
        include_answer: true,
        max_results: 5
      })
    });
    
    const searchData = await searchResponse.json();
    const context = searchData.results?.map((r: any) => r.content).join('\n\n') || "검색 결과가 없습니다.";

    // 2. Gemini Summary
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `당신은 브랜딩포유(BrandingForYou)의 전문 리서치 어시스턴트입니다. 다음 검색 결과를 바탕으로 "${topic}"에 대한 고퀄리티 리포트를 작성해주세요.
    
    형식:
    1. 핵심 요약 (3줄 이내)
    2. 주요 이슈 및 트렌드 (불렛 포인트)
    3. 인사이트 및 제언
    
    어투: 전문적이면서도 친절한 비즈니스 어투 (~합니다)
    검색 결과:
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
    const { data, error } = await resend.emails.send({
      from: 'BrandingForYou <onboarding@resend.dev>',
      to: [to],
      subject: `[BrandingForYou] ${topic} 리서치 리포트`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h1 style="color: #6366f1;">BrandingForYou Research</h1>
          <p style="font-size: 16px; color: #333;">안녕하세요, 요청하신 <strong>${topic}</strong>에 대한 최신 리서치 결과입니다.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
          <div style="line-height: 1.6; color: #444;">
            ${content ? content.replace(/\n/g, '<br>') : '내용을 생성하지 못했습니다.'}
          </div>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 12px; color: #999;">본 메일은 BrandingForYou 자동 리서치 시스템에 의해 발송되었습니다.</p>
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
