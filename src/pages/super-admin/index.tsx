import { useState } from 'react';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { SuperAdminSidebar } from '@/components/super-admin/SuperAdminSidebar';
import { SuperAdminDashboard } from '@/components/super-admin/SuperAdminDashboard';
import { OrganisationsView } from '@/components/super-admin/OrganisationsView';
import { GlobalUsersView } from '@/components/super-admin/GlobalUsersView';
import { SubscriptionPlansView } from '@/components/super-admin/SubscriptionPlansView';
import { FeatureFlagsView } from '@/components/super-admin/FeatureFlagsView';
import { WorkerJobsView } from '@/components/super-admin/WorkerJobsView';
import { SystemLogsView } from '@/components/super-admin/SystemLogsView';
import { BillingHistoryView } from '@/components/super-admin/BillingHistoryView';
import { APIKeysView } from '@/components/super-admin/APIKeysView';
import { WebhooksView } from '@/components/super-admin/WebhooksView';
import { UsageMetricsView } from '@/components/super-admin/UsageMetricsView';
import { SystemSettingsView } from '@/components/super-admin/SystemSettingsView';

const SuperAdmin = () => {
  const [activeView, setActiveView] = useState('dashboard');

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <SuperAdminDashboard />;
      case 'organisations':
        return <OrganisationsView />;
      case 'users':
        return <GlobalUsersView />;
      case 'plans':
        return <SubscriptionPlansView />;
      case 'billing':
        return <BillingHistoryView />;
      case 'feature-flags':
        return <FeatureFlagsView />;
      case 'worker-jobs':
        return <WorkerJobsView />;
      case 'logs':
        return <SystemLogsView />;
      case 'api-keys':
        return <APIKeysView />;
      case 'webhooks':
        return <WebhooksView />;
      case 'usage':
        return <UsageMetricsView />;
      case 'settings':
        return <SystemSettingsView />;
      default:
        return <SuperAdminDashboard />;
    }
  };

  return (
    <RoleGuard allowedRoles={[]} requireSuperAdmin={true}>
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-background">
          <SuperAdminSidebar activeView={activeView} onViewChange={setActiveView} />
          
          <div className="flex-1">
            <header className="h-14 flex items-center border-b px-4 bg-card/50 backdrop-blur-sm sticky top-0 z-40">
              <SidebarTrigger />
              <h1 className="ml-4 text-lg font-semibold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                AppMaster Super Admin Suite
              </h1>
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

export default SuperAdmin;
