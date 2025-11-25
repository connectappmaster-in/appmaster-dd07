import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useAssetSetupConfig = () => {
  const { data: sites = [], isLoading: sitesLoading } = useQuery({
    queryKey: ["itam-sites"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("itam_sites")
        .select("*")
        .eq("is_active", true)
        .order("name");
      
      if (error) throw error;
      return data || [];
    },
  });

  const { data: locations = [], isLoading: locationsLoading } = useQuery({
    queryKey: ["itam-locations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("itam_locations")
        .select("*, itam_sites(name)")
        .eq("is_active", true)
        .order("name");
      
      if (error) throw error;
      return data || [];
    },
  });

  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ["itam-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("itam_categories")
        .select("*")
        .eq("is_active", true)
        .order("name");
      
      if (error) throw error;
      return data || [];
    },
  });

  const { data: departments = [], isLoading: departmentsLoading } = useQuery({
    queryKey: ["itam-departments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("itam_departments")
        .select("*")
        .eq("is_active", true)
        .order("name");
      
      if (error) throw error;
      return data || [];
    },
  });

  const { data: tagSeries = [], isLoading: tagSeriesLoading } = useQuery({
    queryKey: ["itam-tag-series"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("itam_tag_series")
        .select("*")
        .eq("is_active", true)
        .order("category_name");
      
      if (error && error.code !== "PGRST116") throw error;
      return data || [];
    },
  });

  return {
    sites,
    locations,
    categories,
    departments,
    tagSeries,
    isLoading: sitesLoading || locationsLoading || categoriesLoading || departmentsLoading || tagSeriesLoading,
  };
};
