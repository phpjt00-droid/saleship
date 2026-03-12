import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function listTables() {
  console.log('--- Listing Supabase Tables ---');
  
  // Try to query common tables to see what exists
  const tables = ['posts', 'post_likes', 'post_bookmarks', 'comments'];
  
  for (const table of tables) {
    const { count, error } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.log(`Table "${table}": ERROR - ${error.message}`);
    } else {
      console.log(`Table "${table}": EXISTS (${count} records)`);
    }
  }
}

listTables();
