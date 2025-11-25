import { AssetTopBar } from "@/components/ITAM/AssetTopBar";
import { Button } from "@/components/ui/button";
import { Settings, Package } from "lucide-react";

export default function AssetSetup() {
  return (
    <div className="min-h-screen bg-background">
      <AssetTopBar />
      
      <div className="px-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <Button variant="outline" className="h-auto py-4 flex-col gap-2">
            <Settings className="h-5 w-5" />
            <div className="text-center">
              <div className="font-semibold">Fields Setup</div>
              <div className="text-xs text-muted-foreground">Company, Sites, Categories</div>
            </div>
          </Button>
          <Button variant="outline" className="h-auto py-4 flex-col gap-2">
            <Package className="h-5 w-5" />
            <div className="text-center">
              <div className="font-semibold">Tag Format</div>
              <div className="text-xs text-muted-foreground">Configure asset tags</div>
            </div>
          </Button>
          <Button variant="outline" className="h-auto py-4 flex-col gap-2">
            <Package className="h-5 w-5" />
            <div className="text-center">
              <div className="font-semibold">Advanced</div>
              <div className="text-xs text-muted-foreground">Employees, Users</div>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}
