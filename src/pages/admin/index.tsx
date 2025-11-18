import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { DashboardView } from '@/components/admin/DashboardView';
import { UsersView } from '@/components/admin/UsersView';
import { RolesView } from '@/components/admin/RolesView';
import { SubscriptionsView } from '@/components/admin/SubscriptionsView';
import { BillingView } from '@/components/admin/BillingView';
import { ToolsAccessView } from '@/components/admin/ToolsAccessView';
import { AuditLogsView } from '@/components/admin/AuditLogsView';
import { InsightsView } from '@/components/admin/InsightsView';
import { OrganisationSettings } from '@/components/admin/OrganisationSettings';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

const Admin = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
      }
    };
    checkAuth();
  }, [navigate]);

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView />;
      case 'users':
        return <UsersView />;
      case 'roles':
        return <RolesView />;
      case 'subscriptions':
        return <SubscriptionsView />;
      case 'billing':
        return <BillingView />;
      case 'tools':
        return <ToolsAccessView />;
      case 'logs':
        return <AuditLogsView />;
      case 'insights':
        return <InsightsView />;
      case 'settings':
        return <OrganisationSettings />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <RoleGuard allowedRoles={['admin', 'super_admin']}>
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-background">
          <AdminSidebar activeView={activeView} onViewChange={setActiveView} />
          
          <div className="flex-1">
            <header className="h-14 flex items-center border-b px-4 bg-card/50 backdrop-blur-sm sticky top-0 z-40">
              <SidebarTrigger />
              <h1 className="ml-4 text-lg font-semibold">Admin Panel</h1>
            </header>

            <main className="p-6">
              {renderView()}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </RoleGuard>
  );
};

export default Admin;
