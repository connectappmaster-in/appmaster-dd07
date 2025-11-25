import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useTagSuggestions = () => {
  return useQuery({
    queryKey: ["tag-suggestions"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data: userData } = await supabase
        .from("users")
        .select("organisation_id")
        .eq("auth_user_id", user.id)
        .single();

      if (!userData?.organisation_id) return [];

      const { data, error } = await supabase.rpc("get_next_asset_tags", {
        p_organisation_id: userData.organisation_id,
        p_limit: 3,
      });

      if (error) throw error;
      return data || [];
    },
  });
};
