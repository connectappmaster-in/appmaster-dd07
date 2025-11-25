import { AssetTopBar } from "@/components/ITAM/AssetTopBar";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Hash, Box, Activity, Wrench, TrendingDown, Building2, MapPin } from "lucide-react";

export default function AssetSetup() {
  const navigate = useNavigate();

  const setupCards = [
    {
      title: "Fields Setup",
      description: "Company, Sites, Categories, Departments",
      icon: Settings,
      onClick: () => navigate("/helpdesk/assets/setup/fields-setup"),
    },
    {
      title: "Tag Format",
      description: "Configure asset tag generation",
      icon: Hash,
      onClick: () => navigate("/helpdesk/assets/setup/fields-setup"),
    },
    {
      title: "Asset Types",
      description: "Manage hardware and software types",
      icon: Box,
      onClick: () => navigate("/helpdesk/assets/setup/fields-setup"),
    },
    {
      title: "Status Configuration",
      description: "Available, Assigned, In Repair, Retired",
      icon: Activity,
      onClick: () => navigate("/helpdesk/assets/setup/fields-setup"),
    },
    {
      title: "Condition Types",
      description: "New, Good, Fair, Poor conditions",
      icon: Wrench,
      onClick: () => navigate("/helpdesk/assets/setup/fields-setup"),
    },
    {
      title: "Depreciation Methods",
      description: "Straight-line, declining balance",
      icon: TrendingDown,
      onClick: () => navigate("/helpdesk/assets/depreciation"),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <AssetTopBar />
      
      <div className="p-6 space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Asset Setup</h2>
          <p className="text-muted-foreground">Configure asset management system settings</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {setupCards.map((card, index) => (
            <Card 
              key={index} 
              className="cursor-pointer hover:border-primary transition-colors"
              onClick={card.onClick}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <card.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{card.title}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">{card.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
