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
  Target
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
    <div className="max-w-5xl animate-in fade-in duration-500">
      <header className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">리서치 관리</h1>
          <p className="text-sm text-gray-500">자동으로 추적할 업체나 키워드를 관리하세요.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          새 리서치 추가
        </button>
      </header>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-brand-500 animate-spin mb-4" />
          <p className="text-sm text-gray-500">목록을 불러오는 중...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.length === 0 ? (
            <div className="bg-white rounded-xl p-16 flex flex-col items-center justify-center text-center shadow-sm border border-gray-100">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100">
                <Target className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">등록된 리서치가 없습니다</h3>
              <p className="text-sm text-gray-500 max-w-sm">
                우측 상단의 버튼을 눌러 새 리서치를 추가하여 업계 동향을 자동으로 받아보세요.
              </p>
            </div>
          ) : (
            tasks.map((task) => (
              <div key={task.id} className="bg-white rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm border border-gray-100 hover:border-brand-200 transition-colors group">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600 border border-brand-100">
                    <Search className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900 mb-1.5">{task.topic}</h3>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-gray-400" />
                        {task.frequency === "daily" ? "매일" : "매주"} 발송
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Mail className="w-4 h-4 text-gray-400" />
                        {task.recipients}
                      </span>
                      {task.last_run && (
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          최근 실행: {new Date(task.last_run).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-end">
                    <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-0.5">Status</span>
                    <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-600">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                      활성
                    </span>
                  </div>
                  <div className="h-8 w-px bg-gray-200 hidden md:block"></div>
                  <button 
                    onClick={() => deleteTask(task.id)}
                    className="p-2 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
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

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-lg font-bold text-gray-900">새 리서치 등록</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">리서치 주제 또는 업체명</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors"
                  placeholder="예: 현대자동차 자율주행 트렌드"
                  value={newTask.topic}
                  onChange={(e) => setNewTask({...newTask, topic: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">발송 주기</label>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setNewTask({...newTask, frequency: "daily"})}
                    className={`px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                      newTask.frequency === "daily" 
                        ? "bg-brand-50 border-brand-500 text-brand-700" 
                        : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    매일
                  </button>
                  <button 
                    onClick={() => setNewTask({...newTask, frequency: "weekly"})}
                    className={`px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                      newTask.frequency === "weekly" 
                        ? "bg-brand-50 border-brand-500 text-brand-700" 
                        : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    매주
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">결과 수신 이메일</label>
                <input 
                  type="email" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors"
                  placeholder="name@company.com"
                  value={newTask.recipients}
                  onChange={(e) => setNewTask({...newTask, recipients: e.target.value})}
                />
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-100">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm leading-relaxed">
                  설정한 주기에 맞춰 AI가 검색 결과를 요약하여 메일로 발송합니다.
                </p>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex gap-3 justify-end">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button 
                onClick={addTask}
                className="px-4 py-2 text-sm font-medium text-white bg-brand-600 rounded-lg hover:bg-brand-700 transition-colors"
              >
                등록하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
