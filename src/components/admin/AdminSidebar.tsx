import {
  LayoutDashboard,
  Users,
  Shield,
  CreditCard,
  DollarSign,
  Wrench,
  FileText,
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
  { title: "Users", icon: Users, id: "users" },
  { title: "Roles", icon: Shield, id: "roles" },
  { title: "Subscriptions", icon: CreditCard, id: "subscriptions" },
  { title: "Billing", icon: DollarSign, id: "billing" },
  { title: "Tools Access", icon: Wrench, id: "tools" },
  { title: "Audit Logs", icon: FileText, id: "logs" },
  { title: "Insights", icon: BarChart3, id: "insights" },
  { title: "Settings", icon: Settings, id: "settings" },
];

interface AdminSidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export function AdminSidebar({ activeView, onViewChange }: AdminSidebarProps) {
  const { state } = useSidebar();

  return (
    <Sidebar className={state === "collapsed" ? "w-14" : "w-60"}>
      <SidebarTrigger className="m-2 self-end" />
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Admin Panel</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => onViewChange(item.id)}
                    className={activeView === item.id ? "bg-muted text-primary font-medium" : ""}
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
