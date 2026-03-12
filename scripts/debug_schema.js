import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkSchema() {
  console.log('--- Checking Schema ---');
  // Use rpc or just a raw query if enabled, but here we can try to 'select' from a table that always exists or use a trick
  // Since we can't do raw SQL easily through the client without an RPC, let's just try to select from 'posts' specifically again with more info
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .limit(1);

  if (error) {
    console.log('Error selecting from "posts":', error.message);
    if (error.hint) console.log('Hint:', error.hint);
  } else {
    console.log('Successfully connected to "posts" table.');
  }
}

checkSchema();
