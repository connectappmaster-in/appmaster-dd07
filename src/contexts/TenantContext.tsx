import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getSubdomainInfo, getTenantSlugFromPath } from '@/lib/subdomain';

interface Tenant {
  id: string;
  slug: string;
  name: string;
  domain: string | null;
  settings: any;
  is_active: boolean;
}

interface TenantContextType {
  tenant: Tenant | null;
  tenantSlug: string | null;
  toolName: string | null;
  isLoading: boolean;
  setTenant: (tenant: Tenant | null) => void;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [tenantSlug, setTenantSlug] = useState<string | null>(null);
  const [toolName, setToolName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTenantContext = async () => {
      setIsLoading(true);
      
      // Get subdomain info
      const subdomainInfo = getSubdomainInfo();
      setToolName(subdomainInfo.toolName);
      
      // Get tenant slug from URL
      const slug = getTenantSlugFromPath();
      setTenantSlug(slug);
      
      // If we have a tenant slug, load tenant data
      if (slug) {
        try {
          const { data, error } = await supabase
            .from('tenants')
            .select('*')
            .eq('slug', slug)
            .eq('is_active', true)
            .single();
          
          if (error) throw error;
          setTenant(data);
        } catch (error) {
          console.error('Error loading tenant:', error);
          setTenant(null);
        }
      } else {
        setTenant(null);
      }
      
      setIsLoading(false);
    };

    loadTenantContext();
  }, []);

  return (
    <TenantContext.Provider value={{ tenant, tenantSlug, toolName, isLoading, setTenant }}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
}
