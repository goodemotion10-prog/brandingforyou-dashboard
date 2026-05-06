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
  Loader2
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
    const { data, error } = await supabase
      .from("research_tasks")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (data) setTasks(data);
    setLoading(false);
  };

  const addTask = async () => {
    if (!newTask.topic || !newTask.recipients) return;
    
    const { data, error } = await supabase
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
    <div className="animate-in">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "var(--font-outfit)" }}>리서치 관리</h1>
          <p className="text-slate-400">자동으로 추적할 업체나 키워드를 관리하세요.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary"
        >
          <Plus className="w-5 h-5" />
          새 리서치 추가
        </button>
      </header>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-20">
          <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
          <p className="text-slate-400">리스트를 불러오는 중...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {tasks.length === 0 ? (
            <div className="glass p-20 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-slate-500" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-slate-300">등록된 리서치가 없습니다</h3>
              <p className="text-slate-500 max-w-sm">
                새 리서치를 추가하여 업계 동향을 자동으로 받아보세요.
              </p>
            </div>
          ) : (
            tasks.map((task) => (
              <div key={task.id} className="glass p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-indigo-500/30 transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-600/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                    <Search className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-200 mb-1">{task.topic}</h3>
                    <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        {task.frequency === "daily" ? "매일" : "매주"} 발송
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Mail className="w-4 h-4" />
                        {task.recipients}
                      </span>
                      {task.last_run && (
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4" />
                          최근 실행: {new Date(task.last_run).toLocaleString('ko-KR')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-end mr-4">
                    <span className="text-xs text-slate-500 mb-1">상태</span>
                    <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-400">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                      활성
                    </span>
                  </div>
                  <button 
                    onClick={() => deleteTask(task.id)}
                    className="p-3 rounded-xl bg-red-500/5 text-red-500 hover:bg-red-500/10 border border-red-500/10 transition-colors"
                    title="삭제"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Add Task Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in">
          <div className="glass w-full max-w-lg p-8 shadow-2xl border-white/10">
            <h2 className="text-2xl font-bold mb-6">새 리서치 등록</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">리서치 주제 또는 업체명</label>
                <input 
                  type="text" 
                  className="input" 
                  placeholder="예: 현대자동차 자율주행 트렌드"
                  value={newTask.topic}
                  onChange={(e) => setNewTask({...newTask, topic: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">발송 주기</label>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setNewTask({...newTask, frequency: "daily"})}
                    className={`p-3 rounded-xl border font-medium transition-all ${
                      newTask.frequency === "daily" 
                        ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20" 
                        : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10"
                    }`}
                  >
                    매일
                  </button>
                  <button 
                    onClick={() => setNewTask({...newTask, frequency: "weekly"})}
                    className={`p-3 rounded-xl border font-medium transition-all ${
                      newTask.frequency === "weekly" 
                        ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20" 
                        : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10"
                    }`}
                  >
                    매주
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">결과 수신 이메일</label>
                <input 
                  type="email" 
                  className="input" 
                  placeholder="name@company.com"
                  value={newTask.recipients}
                  onChange={(e) => setNewTask({...newTask, recipients: e.target.value})}
                />
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 text-amber-500/80 text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p>설정한 주기에 맞춰 AI가 검색 결과를 요약하여 메일로 발송합니다.</p>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-ghost flex-1"
                >
                  취소
                </button>
                <button 
                  onClick={addTask}
                  className="btn btn-primary flex-1"
                >
                  등록하기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
