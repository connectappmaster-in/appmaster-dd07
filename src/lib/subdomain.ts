/**
 * Subdomain detection and routing utilities for multi-tenant architecture
 */

export interface SubdomainInfo {
  subdomain: string | null;
  isRootDomain: boolean;
  toolName: string | null;
}

/**
 * Extract subdomain from current hostname
 * Examples:
 * - appmaster.in → { subdomain: null, isRootDomain: true, toolName: null }
 * - crm.appmaster.in → { subdomain: 'crm', isRootDomain: false, toolName: 'crm' }
 * - localhost:5173 → { subdomain: null, isRootDomain: true, toolName: null }
 */
export function getSubdomainInfo(): SubdomainInfo {
  const hostname = window.location.hostname;
  
  // Handle localhost and IP addresses
  if (hostname === 'localhost' || hostname.match(/^\d+\.\d+\.\d+\.\d+$/)) {
    return {
      subdomain: null,
      isRootDomain: true,
      toolName: null
    };
  }

  // Handle Lovable preview domains (*.lovable.app)
  if (hostname.endsWith('.lovable.app')) {
    return {
      subdomain: null,
      isRootDomain: true,
      toolName: null
    };
  }

  const parts = hostname.split('.');
  
  // If only 2 parts (e.g., appmaster.in), it's the root domain
  if (parts.length === 2) {
    return {
      subdomain: null,
      isRootDomain: true,
      toolName: null
    };
  }

  // If 3+ parts (e.g., crm.appmaster.in), first part is the subdomain
  const subdomain = parts[0];
  
  return {
    subdomain,
    isRootDomain: false,
    toolName: subdomain
  };
}

/**
 * Build URL for a specific tool and tenant
 */
export function buildToolUrl(toolSubdomain: string, tenantSlug: string, path: string = 'home'): string {
  const { hostname, protocol } = window.location;
  const isLocalhost = hostname === 'localhost' || hostname.match(/^\d+\.\d+\.\d+\.\d+$/);
  const isLovablePreview = hostname.endsWith('.lovable.app');
  
  // For local development and Lovable preview, use path-based routing
  if (isLocalhost || isLovablePreview) {
    return `${protocol}//${hostname}${window.location.port ? ':' + window.location.port : ''}/tools/${toolSubdomain}/${tenantSlug}/${path}`;
  }
  
  // For production, use subdomain routing
  const baseDomain = hostname.split('.').slice(-2).join('.');
  return `${protocol}//${toolSubdomain}.${baseDomain}/${tenantSlug}/${path}`;
}

/**
 * Extract tenant slug from URL path
 * Pattern: /tenantSlug/... or /tools/crm/tenantSlug/...
 */
export function getTenantSlugFromPath(): string | null {
  const pathname = window.location.pathname;
  const pathParts = pathname.split('/').filter(Boolean);
  
  // Pattern 1: /tools/crm/tenantSlug/...
  if (pathParts[0] === 'tools' && pathParts.length >= 3) {
    return pathParts[2];
  }
  
  // Pattern 2: /tenantSlug/... (when on subdomain)
  if (pathParts.length >= 1 && !['tools', 'admin', 'login', 'profile', 'settings'].includes(pathParts[0])) {
    return pathParts[0];
  }
  
  return null;
}

/**
 * Navigate to root launcher
 */
export function navigateToLauncher(): void {
  const { hostname, protocol } = window.location;
  const isLocalhost = hostname === 'localhost' || hostname.match(/^\d+\.\d+\.\d+\.\d+$/);
  const isLovablePreview = hostname.endsWith('.lovable.app');
  
  if (isLocalhost || isLovablePreview) {
    window.location.href = `${protocol}//${hostname}${window.location.port ? ':' + window.location.port : ''}/`;
  } else {
    const baseDomain = hostname.split('.').slice(-2).join('.');
    window.location.href = `${protocol}//${baseDomain}/`;
  }
}
