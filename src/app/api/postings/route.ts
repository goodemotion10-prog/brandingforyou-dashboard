import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Supabase 설정 확인
const hasSupabase = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function GET(req: NextRequest) {
  if (!hasSupabase) {
    return NextResponse.json({
      supabase_configured: false,
      message: 'Supabase credentials are missing.'
    });
  }

  const { searchParams } = new URL(req.url);
  const date = searchParams.get('date');

  if (!date) {
    return NextResponse.json({ error: 'date 파라미터가 누락되었습니다.' }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from('daily_postings')
      .select('*')
      .eq('date', date)
      .order('created_at', { ascending: true });

    if (error) {
      const isTableMissing = error.code === '42P01' || error.message.includes('relation "daily_postings" does not exist');
      return NextResponse.json({
        error: error.message,
        code: error.code,
        table_missing: isTableMissing
      }, { status: 500 });
    }

    return NextResponse.json({
      supabase_configured: true,
      data: data || []
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!hasSupabase) {
    return NextResponse.json({
      supabase_configured: false,
      error: 'Supabase credentials are missing.'
    }, { status: 200 });
  }

  try {
    const { company_name, url, title, employee_name, date } = await req.json();

    if (!company_name || !url || !title || !date) {
      return NextResponse.json({ error: '필수 필드(company_name, url, title, date)가 누락되었습니다.' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('daily_postings')
      .insert([
        {
          company_name,
          url,
          title,
          employee_name: employee_name || null,
          date
        }
      ])
      .select();

    if (error) {
      const isTableMissing = error.code === '42P01' || error.message.includes('relation "daily_postings" does not exist');
      return NextResponse.json({
        error: error.message,
        code: error.code,
        table_missing: isTableMissing
      }, { status: 500 });
    }

    return NextResponse.json({
      supabase_configured: true,
      data: data[0]
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!hasSupabase) {
    return NextResponse.json({
      supabase_configured: false,
      error: 'Supabase credentials are missing.'
    }, { status: 200 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'id 파라미터가 누락되었습니다.' }, { status: 400 });
  }

  try {
    const { error } = await supabase
      .from('daily_postings')
      .delete()
      .eq('id', id);

    if (error) {
      const isTableMissing = error.code === '42P01' || error.message.includes('relation "daily_postings" does not exist');
      return NextResponse.json({
        error: error.message,
        code: error.code,
        table_missing: isTableMissing
      }, { status: 500 });
    }

    return NextResponse.json({
      supabase_configured: true,
      message: '성공적으로 삭제되었습니다.'
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
