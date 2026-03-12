import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function listAllTables() {
  console.log('--- Listing All Tables ---');
  // We can try to guess or use the fact that some tables might exist
  // Let's try to select from information_schema if we can, but usually anon doesn't have access.
  // Instead, let's try 'post' (singular) and 'posts' (plural) and 'Post' and 'Posts'
  const targets = ['posts', 'post', 'Posts', 'Post', 'hot_deals', 'deals'];
  
  for (const t of targets) {
    const { error } = await supabase.from(t).select('id').limit(1);
    if (error) {
      console.log(`Table "${t}": NO - ${error.message}`);
    } else {
      console.log(`Table "${t}": YES`);
    }
  }
}

listAllTables();
