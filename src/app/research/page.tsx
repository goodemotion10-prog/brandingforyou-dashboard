"use client";

import { useState, useEffect } from "react";
import { 
  Plus, 
  Trash2, 
  Search, 
  Mail, 
  Clock, 
  Calendar,
  AlertCircle,
  Loader2,
  X,
  Target,
  ArrowRight
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface ResearchTask {
  id: string;
  topic: string;
  frequency: "daily" | "weekly";
  recipients: string;
  status: "active" | "paused";
  last_run?: string;
}

export default function ResearchManagement() {
  const [tasks, setTasks] = useState<ResearchTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({ topic: "", frequency: "daily", recipients: "" });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("research_tasks")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (data) setTasks(data);
    setLoading(false);
  };

  const addTask = async () => {
    if (!newTask.topic || !newTask.recipients) return;
    
    const { data } = await supabase
      .from("research_tasks")
      .insert([{
        topic: newTask.topic,
        frequency: newTask.frequency,
        recipients: newTask.recipients,
        status: "active"
      }])
      .select();

    if (data) {
      setTasks([data[0], ...tasks]);
      setNewTask({ topic: "", frequency: "daily", recipients: "" });
      setIsModalOpen(false);
    }
  };

  const deleteTask = async (id: string) => {
    const { error } = await supabase
      .from("research_tasks")
      .delete()
      .eq("id", id);

    if (!error) {
      setTasks(tasks.filter(t => t.id !== id));
    }
  };

  return (
    <div className="animate-fade-in max-w-7xl mx-auto">
      <header className="flex justify-between items-end mb-14">
        <div>
          <h1 className="text-5xl font-extrabold mb-3 tracking-tighter text-white">Research Hub</h1>
          <p className="text-lg text-slate-400 font-medium">자동화 리서치 작업을 관리하고 모니터링합니다.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-premium btn-primary shadow-2xl"
        >
          <Plus className="w-5 h-5" />
          신규 태스크 등록
        </button>
      </header>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-32">
          <div className="relative">
            <Loader2 className="w-16 h-16 text-indigo-500 animate-spin" />
            <div className="absolute inset-0 blur-xl bg-indigo-500/20 animate-pulse" />
          </div>
          <p className="mt-8 text-slate-500 font-bold uppercase tracking-widest">Loading Pipeline...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {tasks.length === 0 ? (
            <div className="md:col-span-2 glass-card p-24 flex flex-col items-center justify-center text-center">
              <div className="w-24 h-24 bg-slate-800/50 rounded-3xl flex items-center justify-center mb-8 border border-white/5">
                <Target className="w-10 h-10 text-slate-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-300">리서치 목록이 비어있습니다.</h3>
              <p className="text-slate-500 max-w-md font-medium leading-relaxed">
                우측 상단의 버튼을 눌러 첫 번째 자동화 리서치 태스크를 등록해 보세요.
              </p>
            </div>
          ) : (
            tasks.map((task) => (
              <div key={task.id} className="glass-card p-8 group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500 opacity-[0.02] rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700" />
                
                <div className="flex justify-between items-start mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center text-indigo-400 border border-indigo-500/20 group-hover:scale-110 transition-transform duration-300">
                    <Search className="w-8 h-8" />
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => deleteTask(task.id)}
                      className="p-3 rounded-xl bg-red-500/5 text-red-500/40 hover:text-red-500 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">{task.topic}</h3>
                  <div className="flex items-center gap-2 text-slate-500">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm font-medium">{task.recipients}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-500/5 border border-indigo-500/10">
                      <Clock className="w-4 h-4 text-indigo-400" />
                      <span className="text-xs font-bold text-indigo-400 uppercase tracking-tighter">
                        {task.frequency === "daily" ? "Every Day" : "Every Week"}
                      </span>
                    </div>
                    {task.last_run && (
                      <div className="flex items-center gap-2 text-slate-500">
                        <Calendar className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase tracking-tighter">Last Run: {new Date(task.last_run).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                    <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Active</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modern Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="glass-card w-full max-w-xl p-10 relative overflow-hidden border-white/10 shadow-[0_0_100px_rgba(99,102,241,0.1)]">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h2 className="text-3xl font-extrabold text-white tracking-tight">New Research Task</h2>
                <p className="text-slate-400 text-sm mt-1">리서치 자동화 설정을 완료하세요.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/5 rounded-full text-slate-500 hover:text-white transition-all">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-8">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mb-3">Topic / Company</label>
                <input 
                  type="text" 
                  className="premium-input" 
                  placeholder="예: AI 헬스케어 스타트업 트렌드"
                  value={newTask.topic}
                  onChange={(e) => setNewTask({...newTask, topic: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mb-3">Frequency</label>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setNewTask({...newTask, frequency: "daily"})}
                    className={`px-6 py-4 rounded-2xl border font-bold transition-all ${
                      newTask.frequency === "daily" 
                        ? "bg-indigo-600/20 border-indigo-500 text-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.2)]" 
                        : "bg-white/[0.02] border-white/5 text-slate-500 hover:border-white/10"
                    }`}
                  >
                    매일 발송 (Daily)
                  </button>
                  <button 
                    onClick={() => setNewTask({...newTask, frequency: "weekly"})}
                    className={`px-6 py-4 rounded-2xl border font-bold transition-all ${
                      newTask.frequency === "weekly" 
                        ? "bg-indigo-600/20 border-indigo-500 text-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.2)]" 
                        : "bg-white/[0.02] border-white/5 text-slate-500 hover:border-white/10"
                    }`}
                  >
                    매주 발송 (Weekly)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mb-3">Recipients (Email)</label>
                <input 
                  type="email" 
                  className="premium-input" 
                  placeholder="name@company.com"
                  value={newTask.recipients}
                  onChange={(e) => setNewTask({...newTask, recipients: e.target.value})}
                />
              </div>

              <div className="flex items-start gap-4 p-5 rounded-2xl bg-indigo-500/5 border border-indigo-500/10">
                <AlertCircle className="w-6 h-6 text-indigo-400 flex-shrink-0" />
                <p className="text-xs text-slate-400 leading-relaxed">
                  설정한 주기에 맞춰 Tavily 엔진이 웹을 검색하고 ChatGPT-4o가 인사이트를 요약하여 이메일로 전송합니다.
                </p>
              </div>

              <div className="flex gap-4 pt-6">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="btn-premium btn-secondary flex-1"
                >
                  취소
                </button>
                <button 
                  onClick={addTask}
                  className="btn-premium btn-primary flex-1 group"
                >
                  태스크 생성하기
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
