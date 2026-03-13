import React from 'react'
import { ArrowLeft, Clock, Eye, Heart, MessageSquare } from 'lucide-react'

export default function Loading() {
  return (
    <div className="container py-24">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 animate-pulse">
        {/* Main Content Skeleton */}
        <div className="flex flex-col">
          {/* Back Button Skeleton */}
          <div className="flex items-center gap-2 text-slate-300 mb-6">
            <ArrowLeft size={18} />
            <div className="h-4 w-20 bg-slate-200 rounded"></div>
          </div>

          {/* Meta Skeleton */}
          <div className="flex items-center gap-4 mb-4">
            <div className="h-6 w-24 bg-slate-200 rounded-full"></div>
            <div className="flex items-center gap-2 text-slate-200">
              <Clock size={14} />
              <div className="h-4 w-24 bg-slate-100 rounded"></div>
            </div>
          </div>

          {/* Title Skeleton */}
          <div className="space-y-3 mb-8">
            <div className="h-10 w-full bg-slate-200 rounded-xl"></div>
            <div className="h-10 w-3/4 bg-slate-200 rounded-xl"></div>
          </div>

          {/* Featured Image Skeleton */}
          <div className="w-full h-[300px] md:h-[450px] bg-slate-100 rounded-3xl mb-8"></div>

          {/* Price Box Skeleton */}
          <div className="p-8 bg-slate-50 border border-slate-100 rounded-3xl mb-8 flex justify-between items-center">
            <div className="flex items-center gap-6">
              <div className="h-8 w-16 bg-orange-100 rounded-lg"></div>
              <div className="h-10 w-32 bg-slate-200 rounded-lg"></div>
              <div className="h-6 w-24 bg-slate-100 rounded-lg"></div>
            </div>
            <div className="h-14 w-48 bg-slate-200 rounded-2xl"></div>
          </div>

          {/* Author Bar Skeleton */}
          <div className="flex items-center justify-between py-6 border-y border-slate-100 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-slate-100 rounded-2xl"></div>
              <div className="space-y-2">
                <div className="h-4 w-20 bg-slate-200 rounded"></div>
                <div className="h-3 w-16 bg-slate-100 rounded"></div>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="h-4 w-12 bg-slate-100 rounded"></div>
              <div className="h-4 w-12 bg-slate-100 rounded"></div>
              <div className="h-4 w-12 bg-slate-100 rounded"></div>
            </div>
          </div>

          {/* Content Body Skeleton */}
          <div className="space-y-4">
            <div className="h-4 w-full bg-slate-50 rounded"></div>
            <div className="h-4 w-full bg-slate-50 rounded"></div>
            <div className="h-4 w-4/5 bg-slate-50 rounded"></div>
            <div className="h-4 w-full bg-slate-50 rounded"></div>
            <div className="h-4 w-3/4 bg-slate-50 rounded"></div>
          </div>
        </div>

        {/* Sidebar Skeleton */}
        <div className="hidden lg:flex flex-col gap-4">
          <div className="p-6 bg-white border border-slate-100 rounded-3xl space-y-4">
            <div className="h-4 w-24 bg-slate-100 rounded"></div>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-slate-50 rounded-xl"></div>
              <div className="space-y-2">
                <div className="h-4 w-20 bg-slate-200 rounded"></div>
                <div className="h-3 w-16 bg-slate-100 rounded"></div>
              </div>
            </div>
            <div className="h-12 w-full bg-slate-50 rounded-2xl"></div>
          </div>
          <div className="p-6 bg-white border border-slate-100 rounded-3xl space-y-4">
            <div className="h-4 w-24 bg-slate-100 rounded"></div>
            {[1, 2, 3].map(i => (
              <div key={i} className="flex gap-3">
                <div className="w-6 h-6 bg-slate-50 rounded"></div>
                <div className="h-4 flex-1 bg-slate-50 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
