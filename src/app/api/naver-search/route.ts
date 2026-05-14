import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const keyword = searchParams.get('keyword');
  const type = searchParams.get('type');

  if (!keyword) {
    return NextResponse.json({ error: 'Keyword is required' }, { status: 400 });
  }

  try {
    if (type === 'blog') {
      const clientId = process.env.NAVER_CLIENT_ID;
      const clientSecret = process.env.NAVER_CLIENT_SECRET;

      if (!clientId || !clientSecret) {
        throw new Error('Naver Search API keys are missing');
      }

      const response = await fetch(
        `https://openapi.naver.com/v1/search/blog.json?query=${encodeURIComponent(keyword)}&display=1`,
        {
          headers: {
            'X-Naver-Client-Id': clientId,
            'X-Naver-Client-Secret': clientSecret,
          }
        }
      );
      
      const data = await response.json();
      return NextResponse.json({ total: data.total || 0, keyword });
      
    } else if (type === 'keyword' || type === 'analyze') {
      const apiKey = process.env.NAVER_AD_API_KEY;
      const customerId = process.env.NAVER_AD_CUSTOMER_ID;
      const secretKey = process.env.NAVER_AD_SECRET_KEY;

      if (!apiKey || !customerId || !secretKey) {
        throw new Error('Naver AD API keys are missing');
      }

      const timestamp = Date.now().toString();
      const message = `${timestamp}.GET./keywordstool`;
      const signature = crypto.createHmac('sha256', secretKey!).update(message).digest('base64');
      
      const adResponse = await fetch(
        `https://api.naver.com/keywordstool?hintKeywords=${encodeURIComponent(keyword)}&showDetail=1`,
        {
          headers: {
            'X-Timestamp': timestamp,
            'X-API-KEY': apiKey,
            'X-Customer': customerId,
            'X-Signature': signature,
          }
        }
      );
      
      const adData = await adResponse.json();
      const keywordList = adData.keywordList || [];

      if (type === 'analyze' && keywordList.length > 0) {
        const clientId = process.env.NAVER_CLIENT_ID;
        const clientSecret = process.env.NAVER_CLIENT_SECRET;

        if (clientId && clientSecret) {
          const topKeywords = keywordList.slice(0, 15);
          
          const results = await Promise.all(topKeywords.map(async (item: any) => {
            try {
              const blogResponse = await fetch(
                `https://openapi.naver.com/v1/search/blog.json?query=${encodeURIComponent(item.relKeyword)}&display=1`,
                {
                  headers: {
                    'X-Naver-Client-Id': clientId,
                    'X-Naver-Client-Secret': clientSecret,
                  }
                }
              );
              const blogData = await blogResponse.json();
              return {
                ...item,
                blogCount: blogData.total || 0
              };
            } catch (e) {
              return { ...item, blogCount: -1 };
            }
          }));

          return NextResponse.json({ keywordList: results });
        }
      }
      
      return NextResponse.json(adData);
    } else {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
