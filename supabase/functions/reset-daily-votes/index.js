// supabase/functions/reset-daily-votes/index.js
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// This function will be triggered by a cron job at midnight EST
Deno.serve(async (req) => {
  try {
    // Create a Supabase client with the service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Reset all users' votes_used_today to 0
    const { error, count } = await supabase
      .from('profiles')
      .update({ votes_used_today: 0 })
      .not('votes_used_today', 'eq', 0); // Only update profiles that need resetting
    
    if (error) {
      throw error;
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Reset votes for all users`, 
        timestamp: new Date().toISOString() 
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
});