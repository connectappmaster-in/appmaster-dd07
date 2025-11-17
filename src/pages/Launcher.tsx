import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, LogOut, Settings } from 'lucide-react';
import { buildToolUrl } from '@/lib/subdomain';
import { toast } from 'sonner';

interface Tool {
  id: string;
  category: string;
  display_name: string;
  description: string | null;
  icon: string | null;
  subdomain: string | null;
  route_prefix: string | null;
  is_active: boolean;
  created_at: string;
}

interface Tenant {
  id: string;
  slug: string;
  name: string;
}

export default function Launcher() {
  const navigate = useNavigate();
  const [tools, setTools] = useState<Tool[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [selectedTenant, setSelectedTenant] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkAuth();
    loadData();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user || null);
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Load tools
      const { data: toolsData, error: toolsError } = await supabase
        .from('tools')
        .select('*')
        .eq('is_active', true)
        .order('display_name');
      
      if (toolsError) throw toolsError;
      setTools(toolsData || []);

      // Load user's tenants
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: tenantUsersData, error: tenantUsersError } = await supabase
          .from('tenant_users')
          .select('tenant_id, tenants(id, slug, name)')
          .eq('user_id', session.user.id);
        
        if (tenantUsersError) throw tenantUsersError;
        
        const userTenants = tenantUsersData?.map((tu: any) => tu.tenants).filter(Boolean) || [];
        setTenants(userTenants);
        
        if (userTenants.length > 0) {
          setSelectedTenant(userTenants[0].slug);
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load tools and tenants');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToolClick = (tool: Tool) => {
    if (!selectedTenant) {
      toast.error('Please select a tenant first');
      return;
    }
    
    const url = buildToolUrl(tool.subdomain, selectedTenant, 'home');
    window.location.href = url;
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Welcome to AppMaster</CardTitle>
            <CardDescription>Please sign in to access your tools</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={() => navigate('/login')} className="w-full">
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
              <span className="text-xl font-bold text-primary-foreground">AM</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">AppMaster</h1>
              <p className="text-sm text-muted-foreground">Tool Launcher</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => navigate('/profile')}>
              <Settings className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Tenant Selector */}
        {tenants.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Select Tenant</CardTitle>
              <CardDescription>Choose which organization to access</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {tenants.map((tenant) => (
                  <Button
                    key={tenant.id}
                    variant={selectedTenant === tenant.slug ? 'default' : 'outline'}
                    onClick={() => setSelectedTenant(tenant.slug)}
                  >
                    {tenant.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {tenants.length === 0 && (
          <Card className="mb-8 border-destructive/50">
            <CardHeader>
              <CardTitle>No Tenants Found</CardTitle>
              <CardDescription>
                You don't have access to any tenants yet. Contact your administrator to get access.
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        {/* Tools Grid */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-foreground">Available Tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {tools.map((tool) => (
              <Card 
                key={tool.id}
                className="hover:shadow-lg transition-all cursor-pointer group"
                onClick={() => handleToolClick(tool)}
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="text-4xl">{tool.icon || '🔧'}</div>
                    <div className="flex-1">
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {tool.display_name}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">
                    {tool.description || 'No description available'}
                  </CardDescription>
                  <Button 
                    className="w-full mt-4"
                    variant="secondary"
                    disabled={!selectedTenant}
                  >
                    Open Tool
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
