
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function checkSchema() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .limit(1)
  
  if (error) {
    console.error('Error fetching profile:', error)
    return
  }
  
  if (data && data.length > 0) {
    console.log('Available columns in profiles:', Object.keys(data[0]))
  } else {
    console.log('Profiles table is empty or inaccessible.')
  }
}

checkSchema()
