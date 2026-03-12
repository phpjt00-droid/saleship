import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testInsert() {
  console.log('--- Testing Manual Insert ---');
  const testData = {
    title: 'Test Post',
    link: 'https://example.com/test-' + Date.now(),
    date: new Date().toISOString()
  };
  
  const { data, error } = await supabase
    .from('posts')
    .insert([testData]);
    
  if (error) {
    console.log('Insert Error:', error.message);
    if (error.hint) console.log('Hint:', error.hint);
  } else {
    console.log('Successfully inserted test row!');
  }
}

testInsert();
