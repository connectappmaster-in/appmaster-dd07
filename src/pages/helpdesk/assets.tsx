import { AssetTopBar } from "@/components/ITAM/AssetTopBar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Wrench } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { AssetsList } from "@/components/ITAM/AssetsList";
import { CreateAssetDialog } from "@/components/ITAM/CreateAssetDialog";
import { AssetAssignmentsList } from "@/components/ITAM/AssetAssignmentsList";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
export default function HelpdeskAssets() {

  // Fetch assets count for badges
  const {
    data: allAssets = []
  } = useQuery({
    queryKey: ["assets-count"],
    queryFn: async () => {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) return [];
      const {
        data: userData
      } = await supabase.from("users").select("organisation_id").eq("auth_user_id", user.id).single();
      const {
        data: profileData
      } = await supabase.from("profiles").select("tenant_id").eq("id", user.id).maybeSingle();
      const tenantId = profileData?.tenant_id || 1;
      const orgId = userData?.organisation_id;
      let query = supabase.from("itam_assets").select("*").eq("is_deleted", false);
      if (orgId) {
        query = query.eq("organisation_id", orgId);
      } else {
        query = query.eq("tenant_id", tenantId);
      }
      const {
        data
      } = await query;
      return data || [];
    }
  });
  const {
    data: assignments = []
  } = useQuery({
    queryKey: ["asset-assignments-count"],
    queryFn: async () => {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) return [];
      const {
        data: userData
      } = await supabase.from("users").select("organisation_id").eq("auth_user_id", user.id).single();
      const {
        data: profileData
      } = await supabase.from("profiles").select("tenant_id").eq("id", user.id).maybeSingle();
      const tenantId = profileData?.tenant_id || 1;
      const orgId = userData?.organisation_id;
      let query = supabase.from("asset_assignments").select("*").is("returned_at", null);
      if (orgId) {
        query = query.eq("organisation_id", orgId);
      } else {
        query = query.eq("tenant_id", tenantId);
      }
      const {
        data
      } = await query;
      return data || [];
    }
  });
  const availableAssets = allAssets.filter(a => a.status === 'available');
  const maintenanceAssets = allAssets.filter(a => a.status === 'in_repair');
  return (
    <div className="min-h-screen bg-background">
      <AssetTopBar />
      
      <div className="px-4 space-y-4 mt-2">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Number of Active Assets */}
          <div className="p-6 border rounded-lg bg-card hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Number of Active Assets</div>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
                <Package className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-3xl font-semibold text-foreground">{allAssets.filter(a => a.status !== 'retired' && a.status !== 'disposed').length}</h3>
            <p className="text-sm text-muted-foreground mt-1">Total Assets: {allAssets.length}</p>
          </div>

          {/* Available Assets */}
          <div className="p-6 border rounded-lg bg-card hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Available Assets</div>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-sm">
                <Package className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-3xl font-semibold text-foreground">{availableAssets.length}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              ₹{availableAssets.reduce((sum, a) => sum + (a.purchase_price || 0), 0).toLocaleString('en-IN')}
            </p>
          </div>

          {/* Value of Assets */}
          <div className="p-6 border rounded-lg bg-card hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Value of Assets</div>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-sm">
                <Package className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-3xl font-semibold text-foreground">
              ₹{allAssets.reduce((sum, a) => sum + (a.purchase_price || 0), 0).toLocaleString('en-IN')}
            </h3>
          </div>

          {/* In Repair */}
          <div className="p-6 border rounded-lg bg-card hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">In Repair</div>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-sm">
                <Wrench className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-3xl font-semibold text-foreground">{maintenanceAssets.length}</h3>
            <p className="text-sm text-muted-foreground mt-1">{maintenanceAssets.length} Assets</p>
          </div>
        </div>

        {/* Charts and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Asset Value by Category - Placeholder for chart */}
          <div className="p-6 border rounded-lg bg-card">
            <h3 className="text-lg font-semibold mb-4">Asset Value by Category</h3>
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              <div className="text-center">
                <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Chart visualization coming soon</p>
              </div>
            </div>
          </div>

          {/* Recent Activity Feed */}
          <div className="p-6 border rounded-lg bg-card">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <Tabs defaultValue="assigned" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="assigned">Checked In</TabsTrigger>
                <TabsTrigger value="repair">Under Repair</TabsTrigger>
              </TabsList>
              <TabsContent value="assigned" className="space-y-2">
                <div className="space-y-2 max-h-56 overflow-y-auto">
                  {assignments.slice(0, 5).map(assignment => {
                    const asset = allAssets.find(a => a.id === assignment.asset_id);
                    return (
                      <div key={assignment.id} className="flex items-center justify-between py-2 border-b last:border-0">
                        <div className="flex-1">
                          <p className="text-sm font-medium">{asset?.asset_tag || 'N/A'}</p>
                          <p className="text-xs text-muted-foreground">{asset?.name || 'Unknown'}</p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {new Date(assignment.assigned_at || '').toLocaleDateString()}
                        </p>
                      </div>
                    );
                  })}
                  {assignments.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">No recent assignments</p>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="repair" className="space-y-2">
                <div className="space-y-2 max-h-56 overflow-y-auto">
                  {maintenanceAssets.slice(0, 5).map(asset => (
                    <div key={asset.id} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{asset.asset_tag || 'N/A'}</p>
                        <p className="text-xs text-muted-foreground">{asset.name}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {asset.category || 'N/A'}
                      </p>
                    </div>
                  ))}
                  {maintenanceAssets.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">No assets under repair</p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}