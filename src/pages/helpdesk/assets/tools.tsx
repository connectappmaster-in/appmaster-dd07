import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Upload, Download, FileImage, QrCode, Barcode, FileText, History, Wrench, TrendingUp, Package } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function ToolsPage() {
  const navigate = useNavigate();
  const [importing, setImporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<'csv' | 'excel'>('csv');

  // Fetch asset photos for gallery
  const { data: assetPhotos } = useQuery({
    queryKey: ['asset-photos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('asset_photos')
        .select('*, itam_assets(asset_id, brand, model)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // Fetch audit logs
  const { data: auditLogs } = useQuery({
    queryKey: ['asset-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('asset_events')
        .select('*, itam_assets(asset_id, brand, model)')
        .order('performed_at', { ascending: false })
        .limit(50);
      if (error) throw error;
      return data;
    },
  });

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    try {
      const text = await file.text();
      const lines = text.split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      
      // Parse CSV data
      const assets = [];
      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        const values = lines[i].split(',');
        const asset: any = {};
        headers.forEach((header, index) => {
          asset[header] = values[index]?.trim();
        });
        assets.push(asset);
      }

      // Insert assets (you would map CSV columns to database columns)
      toast.success(`Parsed ${assets.length} assets from CSV. Ready to import.`);
      console.log('Assets to import:', assets);
      
    } catch (error) {
      toast.error('Failed to import file');
      console.error(error);
    } finally {
      setImporting(false);
    }
  };

  const handleExport = async () => {
    try {
      const { data: assets, error } = await supabase
        .from('itam_assets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (exportFormat === 'csv') {
        // Generate CSV
        const headers = Object.keys(assets[0] || {});
        const csvContent = [
          headers.join(','),
          ...assets.map(asset => 
            headers.map(header => `"${asset[header] || ''}"`).join(',')
          )
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `assets-export-${format(new Date(), 'yyyy-MM-dd')}.csv`;
        a.click();
        toast.success('Assets exported as CSV');
      } else {
        toast.info('Excel export coming soon');
      }
    } catch (error) {
      toast.error('Failed to export assets');
      console.error(error);
    }
  };

  const generateQRCode = () => {
    toast.info('QR Code generator - Navigate to asset details to generate individual QR codes');
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Asset Management Tools</h2>
        <p className="text-sm text-muted-foreground">Import, export, and manage your IT assets efficiently</p>
      </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {/* Import / Export */}
          <Card className="border hover:border-primary/50 transition-all hover:shadow-md">
            <CardHeader className="pb-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <Upload className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-base">Import / Export</CardTitle>
              <CardDescription className="text-xs">
                Bulk import/export assets
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="import-file" className="text-xs">Import Assets</Label>
                <Input 
                  id="import-file"
                  type="file" 
                  accept=".csv,.xlsx,.xls" 
                  onChange={handleImport} 
                  disabled={importing}
                  className="cursor-pointer h-8 text-xs"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="export-format" className="text-xs">Export Format</Label>
                <Select value={exportFormat} onValueChange={(v: any) => setExportFormat(v)}>
                  <SelectTrigger id="export-format" className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="csv">CSV File</SelectItem>
                    <SelectItem value="excel">Excel File</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleExport} className="w-full h-8 text-xs">
                <Download className="h-3 w-3 mr-2" />
                Export Assets
              </Button>
            </CardContent>
          </Card>

          {/* Photo Gallery */}
          <Dialog>
            <DialogTrigger asChild>
              <Card className="border hover:border-primary/50 transition-all hover:shadow-md cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                    <FileImage className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-base">Photo Gallery</CardTitle>
                  <CardDescription className="text-xs">
                    Browse asset photos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground mb-3">
                    {assetPhotos?.length || 0} photos
                  </div>
                  <Button variant="outline" className="w-full h-8 text-xs">
                    Open Gallery
                  </Button>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent className="max-w-5xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Asset Photo Gallery</DialogTitle>
                <DialogDescription>
                  Browse all asset photos in your inventory
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                {assetPhotos?.map((photo: any) => (
                  <div key={photo.id} className="space-y-2">
                    <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                      <img 
                        src={photo.photo_url} 
                        alt="Asset" 
                        className="w-full h-full object-cover hover:scale-110 transition-transform"
                      />
                    </div>
                    <div className="text-xs">
                      <p className="font-medium truncate">
                        {photo.itam_assets?.brand} {photo.itam_assets?.model}
                      </p>
                      <p className="text-muted-foreground">
                        {photo.itam_assets?.asset_id}
                      </p>
                    </div>
                  </div>
                ))}
                {(!assetPhotos || assetPhotos.length === 0) && (
                  <div className="col-span-full text-center py-12 text-muted-foreground">
                    No photos available
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>

          {/* Audit Trail */}
          <Dialog>
            <DialogTrigger asChild>
              <Card className="border hover:border-primary/50 transition-all hover:shadow-md cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                    <History className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-base">Audit Trail</CardTitle>
                  <CardDescription className="text-xs">
                    Asset history logs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground mb-3">
                    {auditLogs?.length || 0} events
                  </div>
                  <Button variant="outline" className="w-full h-8 text-xs">
                    View Logs
                  </Button>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Asset Audit Trail</DialogTitle>
                <DialogDescription>
                  Complete history of asset events and changes
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date/Time</TableHead>
                      <TableHead>Asset</TableHead>
                      <TableHead>Event Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Performed By</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {auditLogs?.map((log: any) => (
                      <TableRow key={log.id}>
                        <TableCell className="text-xs">
                          {log.performed_at ? format(new Date(log.performed_at), 'MMM dd, yyyy HH:mm') : '—'}
                        </TableCell>
                        <TableCell className="text-xs font-medium">
                          {log.itam_assets?.asset_id || '—'}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {log.event_type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs">
                          {log.event_description || '—'}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {log.performed_by || '—'}
                        </TableCell>
                      </TableRow>
                    ))}
                    {(!auditLogs || auditLogs.length === 0) && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          No audit logs available
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </DialogContent>
          </Dialog>

          {/* QR Code Generator */}
          <Card className="border hover:border-primary/50 transition-all hover:shadow-md cursor-pointer" onClick={generateQRCode}>
            <CardHeader className="pb-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <QrCode className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-base">QR Codes</CardTitle>
              <CardDescription className="text-xs">
                Generate asset QR codes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full h-8 text-xs">
                Generate Codes
              </Button>
            </CardContent>
          </Card>

          {/* Barcode Scanner */}
          <Card className="border hover:border-primary/50 transition-all hover:shadow-md cursor-pointer" onClick={() => toast.info('Barcode scanner coming soon')}>
            <CardHeader className="pb-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <Barcode className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-base">Barcode Scanner</CardTitle>
              <CardDescription className="text-xs">
                Quick asset lookup
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full h-8 text-xs">
                Launch Scanner
              </Button>
            </CardContent>
          </Card>

          {/* Asset Reports */}
          <Card className="border hover:border-primary/50 transition-all hover:shadow-md cursor-pointer" onClick={() => navigate('/helpdesk/assets/reports')}>
            <CardHeader className="pb-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-base">Asset Reports</CardTitle>
              <CardDescription className="text-xs">
                Comprehensive reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full h-8 text-xs">
                View Reports
              </Button>
            </CardContent>
          </Card>

          {/* Depreciation */}
          <Card className="border hover:border-primary/50 transition-all hover:shadow-md cursor-pointer" onClick={() => navigate('/helpdesk/assets/depreciation')}>
            <CardHeader className="pb-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-base">Depreciation</CardTitle>
              <CardDescription className="text-xs">
                Track asset lifecycle
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full h-8 text-xs">
                Manage Lifecycle
              </Button>
            </CardContent>
          </Card>

          {/* Purchase Orders */}
          <Card className="border hover:border-primary/50 transition-all hover:shadow-md cursor-pointer" onClick={() => navigate('/helpdesk/assets/purchase-orders')}>
            <CardHeader className="pb-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-base">Purchase Orders</CardTitle>
              <CardDescription className="text-xs">
                Manage asset procurement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full h-8 text-xs">
                View Orders
              </Button>
            </CardContent>
          </Card>

          {/* Vendor Management */}
          <Card className="border hover:border-primary/50 transition-all hover:shadow-md cursor-pointer" onClick={() => navigate('/helpdesk/assets/vendors')}>
            <CardHeader className="pb-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-base">Vendors</CardTitle>
              <CardDescription className="text-xs">
                Manage asset vendors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full h-8 text-xs">
                View Vendors
              </Button>
            </CardContent>
          </Card>

          {/* License Management */}
          <Card className="border hover:border-primary/50 transition-all hover:shadow-md cursor-pointer" onClick={() => navigate('/helpdesk/assets/licenses')}>
            <CardHeader className="pb-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-base">Licenses</CardTitle>
              <CardDescription className="text-xs">
                Software license tracking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full h-8 text-xs">
                Manage Licenses
              </Button>
            </CardContent>
          </Card>

          {/* Repairs & Maintenance */}
          <Card className="border hover:border-primary/50 transition-all hover:shadow-md cursor-pointer" onClick={() => navigate('/helpdesk/assets/repairs')}>
            <CardHeader className="pb-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <Wrench className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-base">Repairs</CardTitle>
              <CardDescription className="text-xs">
                Track asset repairs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full h-8 text-xs">
                View Repairs
              </Button>
            </CardContent>
          </Card>
      </div>
    </div>
  );
}
