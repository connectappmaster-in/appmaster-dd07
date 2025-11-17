import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getSubdomainInfo, getTenantSlugFromPath } from "@/lib/subdomain";
import { Loader2 } from "lucide-react";
import Launcher from "./Launcher";

const Index = () => {
  const navigate = useNavigate();
  const subdomainInfo = getSubdomainInfo();
  const tenantSlug = getTenantSlugFromPath();

  useEffect(() => {
    // If we're on a tool subdomain with a tenant, redirect to the tool
    if (subdomainInfo.toolName && tenantSlug) {
      const toolRoute = `/${subdomainInfo.toolName}`;
      navigate(toolRoute);
    }
  }, [subdomainInfo.toolName, tenantSlug, navigate]);

  // If we're on root domain or localhost, show the launcher
  if (subdomainInfo.isRootDomain) {
    return <Launcher />;
  }

  // While redirecting, show loading
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
};

export default Index;