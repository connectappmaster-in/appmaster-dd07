import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { job_id, action } = await req.json();

    if (action === 'retry') {
      // Get the job
      const { data: job, error: jobError } = await supabaseClient
        .from('saas_worker_jobs')
        .select('*')
        .eq('id', job_id)
        .single();

      if (jobError) throw jobError;

      if (job.retries >= job.max_retries) {
        throw new Error('Maximum retries exceeded');
      }

      // Update job status to pending for retry
      const { error: updateError } = await supabaseClient
        .from('saas_worker_jobs')
        .update({
          status: 'pending',
          retries: job.retries + 1,
          last_error: null,
        })
        .eq('id', job_id);

      if (updateError) throw updateError;

      return new Response(
        JSON.stringify({ success: true, message: 'Job queued for retry' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'cancel') {
      // Mark job as failed
      const { error: cancelError } = await supabaseClient
        .from('saas_worker_jobs')
        .update({
          status: 'failed',
          last_error: 'Cancelled by admin',
        })
        .eq('id', job_id);

      if (cancelError) throw cancelError;

      return new Response(
        JSON.stringify({ success: true, message: 'Job cancelled' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    throw new Error(`Unknown action: ${action}`);

  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
