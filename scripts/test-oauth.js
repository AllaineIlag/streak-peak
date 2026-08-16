const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function checkGoogleOAuth() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing environment variables.");
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  console.log("Testing Google OAuth configuration...");
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
  });

  if (error) {
    console.error("Error checking Google OAuth:");
    console.error(error.message);
    process.exit(1);
  }

  console.log("Success! Supabase returned a valid OAuth URL:");
  console.log(data.url);
  console.log("This means Google OAuth is successfully enabled on your Supabase project!");
}

checkGoogleOAuth();
