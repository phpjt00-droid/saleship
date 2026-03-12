import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function listAllTables() {
  let log = '--- Listing All Tables ---\n';
  const targets = ['posts', 'post', 'Posts', 'Post', 'hot_deals', 'deals'];
  
  for (const t of targets) {
    const { error } = await supabase.from(t).select('id').limit(1);
    if (error) {
      log += `Table "${t}": NO - ${error.message}\n`;
    } else {
      log += `Table "${t}": YES\n`;
    }
  }
  fs.writeFileSync('guess_results.txt', log);
  console.log('Results written to guess_results.txt');
}

listAllTables();
