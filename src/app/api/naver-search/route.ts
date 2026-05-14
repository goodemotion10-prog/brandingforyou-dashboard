import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
const CUSTOMER_ID = process.env.NAVER_AD_CUSTOMER_ID;
const API_KEY = process.env.NAVER_AD_API_KEY;
const SECRET_KEY = process.env.NAVER_AD_SECRET_KEY;
const CLIENT_ID = process.env.NAVER_CLIENT_ID;
const CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET;
function generateSignature(timestamp: any, method: any, uri: any, secretKey: any) {
        const message = `${timestamp}.${method}.${uri}`;
        return crypto.createHmac('sha256', secretKey).update(message).digest('base64');
}
export async function GET(req: NextRequest) {
        const { searchParams } = new URL(req.url);
        const keyword = searchParams.get('keyword');
        if (!keyword) return NextResponse.json({ error: 'Keyword is required' }, { status: 400 });
        try {
                  const timestamp = Date.now().toString();
                  const uri = '/keywordstool';
                  const method = 'GET';
                  if (!SECRET_KEY || !API_KEY || !CUSTOMER_ID) return NextResponse.json({ error: 'Credentials missing' }, { status: 500 });
                  const signature = generateSignature(timestamp, method, uri, SECRET_KEY);
                  const adRes = await fetch(`https://api.naver.com${uri}?keywords=${encodeURIComponent(keyword)}&showDetail=1`, {
                              headers: { 'X-Timestamp': timestamp, 'X-API-KEY': API_KEY, 'X-Customer': CUSTOMER_ID, 'X-Signature': signature }
                  });
                  const adData = await adRes.json();
                  if (!adData.keywordList) return NextResponse.json({ error: 'Failed Ads API' }, { status: 500 });
                  const keywords = adData.keywordList.slice(0, 10);
                  const results = await Promise.all(keywords.map(async (item: any) => {
                              const kw = item.relKeyword;
                              const pc = (typeof item.monthlyPcQcCnt === 'number') ? item.monthlyPcQcCnt : 0;
                              const mo = (typeof item.monthlyMobileQcCnt === 'number') ? item.monthlyMobileQcCnt : 0;
                              const vol = pc + mo;
                              const searchRes = await fetch(`https://openapi.naver.com/v1/search/blog.json?query=${encodeURIComponent(kw)}&display=1`, {
                                            headers: { 'X-Naver-Client-Id': CLIENT_ID || '', 'X-Naver-Client-Secret': CLIENT_SECRET || '' }
                              });
                              const searchData = await searchRes.json();
                              const blogCount = searchData.total || 0;
                              return { keyword: kw, searchVolume: vol, blogCount, ratio: vol > 0 ? (blogCount / vol).toFixed(2) : 0 };
                  }));
                  return NextResponse.json(results);
        } catch (error: any) {
                  return NextResponse.json({ error: error.message }, { status: 500 });
        }
}
