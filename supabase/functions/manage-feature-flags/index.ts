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

    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user } } = await supabaseClient.auth.getUser(token);

    if (!user) {
      throw new Error('Not authenticated');
    }

    // Check if user is super admin
    const { data: superAdmin } = await supabaseClient
      .from('super_admin_users')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single();

    if (!superAdmin) {
      throw new Error('Unauthorized: Super Admin access required');
    }

    const { action, flag } = await req.json();

    let result;

    switch (action) {
      case 'create':
        const { data: newFlag, error: createError } = await supabaseClient
          .from('saas_feature_flags')
          .insert({
            feature_key: flag.feature_key,
            feature_name: flag.feature_name,
            description: flag.description,
            enabled_for_plans: flag.enabled_for_plans || [],
            enabled_for_orgs: flag.enabled_for_orgs || [],
            rollout_percentage: flag.rollout_percentage || 0,
            is_global_enabled: flag.is_global_enabled || false,
          })
          .select()
          .single();

        if (createError) throw createError;

        await supabaseClient.from('saas_system_logs').insert({
          event_type: 'feature_flag_created',
          entity_type: 'feature_flag',
          entity_id: newFlag.id,
          description: `Feature flag ${flag.feature_name} created`,
          performed_by: user.id,
        });

        result = { success: true, data: newFlag };
        break;

      case 'update':
        const { data: updatedFlag, error: updateError } = await supabaseClient
          .from('saas_feature_flags')
          .update(flag)
          .eq('id', flag.id)
          .select()
          .single();

        if (updateError) throw updateError;

        await supabaseClient.from('saas_system_logs').insert({
          event_type: 'feature_flag_updated',
          entity_type: 'feature_flag',
          entity_id: flag.id,
          description: `Feature flag updated`,
          performed_by: user.id,
        });

        result = { success: true, data: updatedFlag };
        break;

      case 'toggle':
        const { data: currentFlag } = await supabaseClient
          .from('saas_feature_flags')
          .select('is_global_enabled')
          .eq('id', flag.id)
          .single();

        const { error: toggleError } = await supabaseClient
          .from('saas_feature_flags')
          .update({ is_global_enabled: !currentFlag?.is_global_enabled })
          .eq('id', flag.id);

        if (toggleError) throw toggleError;

        await supabaseClient.from('saas_system_logs').insert({
          event_type: 'feature_flag_toggled',
          entity_type: 'feature_flag',
          entity_id: flag.id,
          description: `Feature flag toggled to ${!currentFlag?.is_global_enabled}`,
          performed_by: user.id,
        });

        result = { success: true, message: 'Feature flag toggled' };
        break;

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
