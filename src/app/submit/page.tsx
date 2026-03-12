'use client'
import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import WritePost from '@/components/WritePost/WritePost'


export default function Page() {
  return <WritePost />
}
