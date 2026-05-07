import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { performResearch, sendResearchEmail } from '@/lib/research-service';

export const maxDuration = 60; // Vercel Serverless Function 타임아웃 방지 (60초)

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { data: tasks, error } = await supabase
      .from('research_tasks')
      .select('*')
      .eq('status', 'active');

    if (error) throw error;
    if (!tasks || tasks.length === 0) {
      return NextResponse.json({ message: 'No active tasks found' });
    }

    const results = [];
    const currentDay = new Date().getDay(); // 0 is Sunday, 1 is Monday

    // 필터링: 주간 설정인데 오늘이 월요일(1)이 아니면 제외
    const tasksToRun = tasks.filter(task => {
      if (task.frequency === 'weekly' && currentDay !== 1) return false;
      return true;
    });

    if (tasksToRun.length === 0) {
      return NextResponse.json({ message: 'No tasks scheduled for today' });
    }

    // 비동기 병렬 처리로 60초 타임아웃 방지
    const results = await Promise.all(
      tasksToRun.map(async (task) => {
        try {
          const research = await performResearch(task.topic, task.frequency);
          if (research.success && research.summary) {
            await sendResearchEmail(task.recipients, task.topic, research.summary);
            await supabase.from('research_results').insert({
              task_id: task.id,
              title: `${task.topic} 리서치 보고서`,
              content: research.summary,
              summary: research.summary.substring(0, 200) + '...'
            });
            await supabase.from('research_tasks')
              .update({ last_run: new Date().toISOString() })
              .eq('id', task.id);
            return { topic: task.topic, status: 'success' };
          } else {
            return { topic: task.topic, status: 'failed', error: research.error };
          }
        } catch (err) {
          return { topic: task.topic, status: 'failed', error: String(err) };
        }
      })
    );
    return NextResponse.json({ message: 'Research cycle completed', results });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { topic, recipients } = body;
  if (!topic || !recipients) {
    return NextResponse.json({ error: 'Topic and recipients are required' }, { status: 400 });
  }
  const research = await performResearch(topic);
  if (research.success && research.summary) {
    await sendResearchEmail(recipients, topic, research.summary);
    return NextResponse.json({ message: 'Manual research success', summary: research.summary });
  } else {
    return NextResponse.json({ error: research.error }, { status: 500 });
  }
}
