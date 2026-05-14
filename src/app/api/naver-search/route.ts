import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const NAVER_AD_CUSTOMER_ID = '4115465';
const NAVER_AD_API_KEY = '0100000000a14e2cb1f1481eb0a3215895b49ac7e062d876712efc571f1af1f4b3cb47b9cf';
const NAVER_AD_SECRET_KEY = 'AQAAAAChTiyx8UgesKMhWJW0msfgPh+y82fJX4AQlxz8RecTdA==';
const NAVER_CLIENT_ID = 'V3zWqCS3a1pv7PaK6YYe';
const NAVER_CLIENT_SECRET = 'C5lFNvQz8M';

function generateSignature(timestamp, method, uri, secretKey) {
    const message = `${timestamp}.${method}.${uri}`;
    return crypto.createHmac('sha256', secretKey).update(message).digest('base64');
  }

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const keyword = searchParams.get('keyword');
    if (!keyword) return NextResponse.json({ error: 'Keyword required' }, { status: 400 });

    try {
          const timestamp = Date.now().toString();
          const uri = '/keywordstool';
          const signature = generateSignature(timestamp, 'GET', uri, NAVER_AD_SECRET_KEY);

          const adRes = await fetch(`https://api.naver.com${uri}?hintKeywords=${encodeURIComponent(keyword)}&showDetail=1`, {
                  headers: {
                            'X-Timestamp': timestamp,
                            'X-API-KEY': NAVER_AD_API_KEY,
                            'X-Customer': NAVER_AD_CUSTOMER_ID,
                            'X-Signature': signature,
                          },
                });
          const adData = await adRes.json();
          const keywords = adData.keywordList.slice(0, 10);

          const results = await Promise.all(keywords.map(async (k) => {
                  const searchRes = await fetch(`https://openapi.naver.com/v1/search/blog.json?query=${encodeURIComponent(k.relKeyword)}&display=1`, {
                            headers: {
                                        'X-Naver-Client-Id': NAVER_CLIENT_ID,
                                        'X-Naver-Client-Secret': NAVER_CLIENT_SECRET,
                                      },
                          });
                  const searchData = await searchRes.json();
                  return {
                            keyword: k.relKeyword,
                            totalSearch: (parseInt(k.monthlyPcQcCnt) || 0) + (parseInt(k.monthlyMobileQcCnt) || 0),
                            blogCount: searchData.total || 0,
                          };
                }));

          return NextResponse.json({ keywords: results });
        } catch (e) {
          return NextResponse.json({ error: e.message }, { status: 500 });
        }
  }
