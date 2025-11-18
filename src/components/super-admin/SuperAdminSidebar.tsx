import {
  LayoutDashboard,
  Building2,
  Users,
  CreditCard,
  DollarSign,
  Flag,
  Cog,
  FileText,
  Key,
  Webhook,
  BarChart3,
  Settings,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Dashboard", icon: LayoutDashboard, id: "dashboard" },
  { title: "Organisations", icon: Building2, id: "organisations" },
  { title: "Global Users", icon: Users, id: "users" },
  { title: "Subscription Plans", icon: CreditCard, id: "plans" },
  { title: "Billing History", icon: DollarSign, id: "billing" },
  { title: "Feature Flags", icon: Flag, id: "feature-flags" },
  { title: "Worker Jobs", icon: Cog, id: "worker-jobs" },
  { title: "System Logs", icon: FileText, id: "logs" },
  { title: "API Keys", icon: Key, id: "api-keys" },
  { title: "Webhooks", icon: Webhook, id: "webhooks" },
  { title: "Usage Metrics", icon: BarChart3, id: "usage" },
  { title: "System Settings", icon: Settings, id: "settings" },
];

interface SuperAdminSidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export function SuperAdminSidebar({ activeView, onViewChange }: SuperAdminSidebarProps) {
  const { state } = useSidebar();

  return (
    <Sidebar className={state === "collapsed" ? "w-14" : "w-60"}>
      <SidebarTrigger className="m-2 self-end" />
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Super Admin</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => onViewChange(item.id)}
                    className={activeView === item.id ? "bg-primary/10 text-primary font-medium" : ""}
                  >
                    <item.icon className="h-4 w-4" />
                    {state !== "collapsed" && <span>{item.title}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
