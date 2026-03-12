import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function finalCheck() {
  let log = '--- Final Table Check ---\n';
  const targets = ['posts', 'post', 'post_likes', 'post_bookmarks', 'comments'];
  
  for (const t of targets) {
    const { count, error } = await supabase.from(t).select('*', { count: 'exact', head: true });
    if (error) {
      log += `Table "${t}": ERROR - ${error.message}\n`;
    } else {
      log += `Table "${t}": EXISTS (${count} records)\n`;
    }
  }
  fs.writeFileSync('final_check.txt', log);
  console.log('Results written to final_check.txt');
}

finalCheck();
