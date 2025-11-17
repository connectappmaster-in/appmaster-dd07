import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AdminSidebar } from "./components/AdminSidebar";
import { DashboardStats } from "./components/DashboardStats";
import { UsersManagement } from "./components/UsersManagement";
import { SubscriptionsManagement } from "./components/SubscriptionsManagement";
import { BillingManagement } from "./components/BillingManagement";
import { ToolsAccess } from "./components/ToolsAccess";
import { AuditLogs } from "./components/AuditLogs";
import { InsightsDashboard } from "./components/InsightsDashboard";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Menu } from "lucide-react";
const Admin = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    toast
  } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const activeTab = searchParams.get("tab") || "dashboard";
  useEffect(() => {
    checkAuth();
  }, []);
  const checkAuth = async () => {
    try {
      const {
        data: {
          session
        }
      } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }

      // Check if user is admin
      const {
        data: roles,
        error
      } = await supabase
      // @ts-ignore - Types will be regenerated after migration
      .from('user_roles').select('role').eq('user_id', session.user.id);
      if (error) throw error;
      const hasAdminRole = roles?.some((r: any) => r.role === 'admin' || r.role === 'super_admin');
      if (!hasAdminRole) {
        toast({
          title: "Access Denied",
          description: "You don't have permission to access the admin panel",
          variant: "destructive"
        });
        navigate("/");
        return;
      }
      setIsAdmin(true);
    } catch (error) {
      console.error('Auth check error:', error);
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>;
  }
  if (!isAdmin) {
    return null;
  }
  return <div className="flex min-h-screen bg-background">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} activeTab={activeTab} onTabChange={tab => setSearchParams({
      tab
    })} />
      
      <main className="flex-1 w-full lg:w-auto min-w-0">
        {/* Mobile header */}
        <div className="lg:hidden sticky top-0 z-30 bg-card/95 backdrop-blur-sm border-b border-border px-3 py-2.5 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)} className="flex-shrink-0 h-8 w-8">
            <Menu className="h-4 w-4" />
          </Button>
          <h1 className="text-base font-semibold text-foreground">
            Admin Dashboard
          </h1>
        </div>

        <div className="p-3 sm:p-4 lg:p-6">
          <div className="max-w-[1400px] mx-auto">
            {/* Desktop header */}
            <div className="hidden lg:flex justify-between items-center mb-4">
              <h1 className="text-xl font-bold text-foreground">
                Users Management
              </h1>
            </div>

            <Tabs value={activeTab} className="space-y-3 lg:space-y-4">
              <TabsContent value="dashboard" className="mt-0 space-y-3">
                <DashboardStats />
              </TabsContent>

              <TabsContent value="users" className="mt-0">
                <UsersManagement />
              </TabsContent>

              <TabsContent value="subscriptions" className="mt-0">
                <SubscriptionsManagement />
              </TabsContent>

              <TabsContent value="billing" className="mt-0">
                <BillingManagement />
              </TabsContent>

              <TabsContent value="tools" className="mt-0">
                <ToolsAccess />
              </TabsContent>

              <TabsContent value="logs" className="mt-0">
                <AuditLogs />
              </TabsContent>

              <TabsContent value="insights" className="mt-0">
                <InsightsDashboard />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>;
};
export default Admin;