import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import RoleGuard from '@/components/auth/RoleGuard';
import AdminSidebar from '@/components/admin/AdminSidebar';
import DashboardView from '@/components/admin/DashboardView';
import UsersView from '@/components/admin/UsersView';
import RolesView from '@/components/admin/RolesView';
import SubscriptionsView from '@/components/admin/SubscriptionsView';
import BillingView from '@/components/admin/BillingView';
import ToolsAccessView from '@/components/admin/ToolsAccessView';
import AuditLogsView from '@/components/admin/AuditLogsView';
import InsightsView from '@/components/admin/InsightsView';
import OrganisationSettings from '@/components/admin/OrganisationSettings';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Admin = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
    <RoleGuard role="admin">
      <div className="flex min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
        <AdminSidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)}
          activeView={activeView}
          setActiveView={setActiveView}
        />
        
        <div className="flex-1 lg:ml-56">
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center justify-between p-4 border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-bold">Admin Panel</h1>
            <div className="w-10" />
          </div>

          {/* Main Content */}
          <div className="p-4 sm:p-6 lg:p-8">
            {renderView()}
          </div>
        </div>
      </div>
    </RoleGuard>
  );
};

export default Admin;
