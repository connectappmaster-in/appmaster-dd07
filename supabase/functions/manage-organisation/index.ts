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

    const { action, organisation } = await req.json();

    let result;

    switch (action) {
      case 'create':
        // Create new organisation
        const { data: newOrg, error: createError } = await supabaseClient
          .from('saas_organisations')
          .insert({
            name: organisation.name,
            plan_name: organisation.plan_name || 'free',
            status: organisation.status || 'trial',
            max_users_allowed: organisation.max_users_allowed || 3,
          })
          .select()
          .single();

        if (createError) throw createError;

        // Log the action
        await supabaseClient.from('saas_system_logs').insert({
          event_type: 'organisation_created',
          entity_type: 'organisation',
          entity_id: newOrg.id,
          description: `Organisation ${organisation.name} created`,
          performed_by: user.id,
        });

        result = { success: true, data: newOrg };
        break;

      case 'update':
        // Update organisation
        const { data: updatedOrg, error: updateError } = await supabaseClient
          .from('saas_organisations')
          .update(organisation)
          .eq('id', organisation.id)
          .select()
          .single();

        if (updateError) throw updateError;

        await supabaseClient.from('saas_system_logs').insert({
          event_type: 'organisation_updated',
          entity_type: 'organisation',
          entity_id: organisation.id,
          description: `Organisation updated`,
          performed_by: user.id,
        });

        result = { success: true, data: updatedOrg };
        break;

      case 'suspend':
        // Suspend organisation
        const { error: suspendError } = await supabaseClient
          .from('saas_organisations')
          .update({ status: 'suspended' })
          .eq('id', organisation.id);

        if (suspendError) throw suspendError;

        await supabaseClient.from('saas_system_logs').insert({
          event_type: 'organisation_suspended',
          entity_type: 'organisation',
          entity_id: organisation.id,
          description: `Organisation suspended`,
          performed_by: user.id,
        });

        result = { success: true, message: 'Organisation suspended' };
        break;

      case 'activate':
        // Activate organisation
        const { error: activateError } = await supabaseClient
          .from('saas_organisations')
          .update({ status: 'active' })
          .eq('id', organisation.id);

        if (activateError) throw activateError;

        await supabaseClient.from('saas_system_logs').insert({
          event_type: 'organisation_activated',
          entity_type: 'organisation',
          entity_id: organisation.id,
          description: `Organisation activated`,
          performed_by: user.id,
        });

        result = { success: true, message: 'Organisation activated' };
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
