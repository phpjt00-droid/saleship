'use client'

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Deal } from '@/types/deal';
import { BadgeCheck, Plus, Trash2, Edit2, Save, X, ExternalLink, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { isAdmin } from '@/lib/security';

export default function AdminPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || !isAdmin(session.user.email)) {
        toast.error('권한이 없습니다.');
        router.push('/');
        return;
      }
      fetchDeals();
    };
    checkAuth();
  }, [router]);

  const fetchDeals = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('id', { ascending: false });

      if (error) throw error;
      setDeals(data || []);
    } catch (error: any) {
      toast.error('데이터 로드 실패: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string | number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    try {
      const { error } = await supabase.from('posts').delete().eq('id', id);
      if (error) throw error;
      toast.success('삭제되었습니다.');
      fetchDeals();
    } catch (error: any) {
      toast.error('삭제 실패: ' + error.message);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500 font-bold">로딩 중...</div>;

  return (
    <main className="container py-12">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">관리자 데스크</h1>
          <p className="text-slate-500 font-medium">전체 핫딜 게시물을 관리합니다.</p>
        </div>
        <button 
          onClick={() => router.push('/admin/post')}
          className="px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl flex items-center gap-2 transition-all shadow-xl shadow-blue-200"
        >
          <Plus size={20} /> 새 핫딜 게시
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border dark:border-slate-800 overflow-hidden shadow-2xl shadow-slate-200/50">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b dark:border-slate-800">
              <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Post Info</th>
              <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">Category</th>
              <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Price Info</th>
              <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-slate-800">
            {deals.map((deal) => (
              <tr key={deal.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-6">
                  <div className="flex items-center gap-4">
                    <img src={deal.thumbnail} className="w-16 h-16 rounded-xl object-cover" />
                    <div>
                      <div className="font-black text-slate-900 dark:text-white mb-1 line-clamp-1">{deal.title}</div>
                      <div className="text-xs text-slate-400 font-bold">{deal.brand_name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-6 text-center">
                  <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-[11px] font-black rounded-lg">
                    {deal.category}
                  </span>
                </td>
                <td className="px-6 py-6 text-right">
                  <div className="font-black text-rose-600">{deal.price_info?.currentPrice}</div>
                  <div className="text-xs text-slate-400 line-through">{deal.price_info?.originalPrice}</div>
                </td>
                <td className="px-6 py-6">
                  <div className="flex items-center justify-center gap-2">
                    <button 
                      onClick={() => router.push(`/deals/${deal.id}`)}
                      className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                    >
                      <ExternalLink size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(deal.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
