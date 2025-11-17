import { Users, CreditCard, DollarSign, Wrench, Activity, FileText, Plug, X, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface NavItem {
  name: string;
  tab: string;
  icon: React.ElementType;
}

const navigation: NavItem[] = [
  { name: "Dashboard", tab: "dashboard", icon: Activity },
  { name: "Users", tab: "users", icon: Users },
  { name: "Subscriptions", tab: "subscriptions", icon: CreditCard },
  { name: "Billing", tab: "billing", icon: DollarSign },
  { name: "Tools Access", tab: "tools", icon: Wrench },
  { name: "Audit Logs", tab: "logs", icon: FileText },
  { name: "Insights", tab: "insights", icon: Plug },
];

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const AdminSidebar = ({ isOpen, onClose, activeTab, onTabChange }: AdminSidebarProps) => {
  const navigate = useNavigate();

  const handleTabClick = (tab: string) => {
    onTabChange(tab);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden" 
          onClick={onClose} 
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed lg:sticky top-0 left-0 h-screen bg-card border-r border-border z-50 transition-all duration-300 ease-in-out flex flex-col",
          "w-48 lg:w-44",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Header */}
        <div className="p-3 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Admin Panel</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="lg:hidden h-7 w-7"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Navigation */}
        <nav className="p-2 flex-1 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.tab;
            
            return (
              <button
                key={item.name}
                onClick={() => handleTabClick(item.tab)}
                className={cn(
                  "flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm font-medium transition-all duration-200 mb-0.5 group w-full",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <Icon className={cn("h-4 w-4 flex-shrink-0", isActive && "text-primary")} />
                <span className="truncate">{item.name}</span>
              </button>
            );
          })}
        </nav>
        
        {/* Back to App button */}
        <div className="p-2 border-t border-border">
          <Button 
            variant="outline" 
            onClick={() => navigate("/")} 
            className="w-full hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all text-sm h-8"
          >
            <ArrowLeft className="h-3.5 w-3.5 mr-2" />
            Back to App
          </Button>
        </div>
      </aside>
    </>
  );
};
