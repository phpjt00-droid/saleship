import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkSchema() {
  console.log('--- Checking Supabase "posts" table ---');
  const { data, count, error } = await supabase
    .from('posts')
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.error('Error:', error.message);
    if (error.message.includes('relation "public.posts" does not exist')) {
      console.log('STATUS: The "posts" table is MISSING. Please run supabase_schema.sql in Supabase SQL Editor.');
    }
  } else {
    console.log(`STATUS: The "posts" table EXISTS and has ${count} records.`);
  }
}

checkSchema();
