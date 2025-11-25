import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BackButton } from "@/components/BackButton";
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
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <BackButton />
          <div>
            <h1 className="text-3xl font-bold">Asset Management Tools</h1>
            <p className="text-muted-foreground">Import, export, and manage your IT assets efficiently</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Import / Export */}
          <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Import / Export</CardTitle>
              <CardDescription>
                Import and export assets in CSV or Excel format
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="import-file">Import Assets</Label>
                <Input 
                  id="import-file"
                  type="file" 
                  accept=".csv,.xlsx,.xls" 
                  onChange={handleImport} 
                  disabled={importing}
                  className="cursor-pointer"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="export-format">Export Format</Label>
                <Select value={exportFormat} onValueChange={(v: any) => setExportFormat(v)}>
                  <SelectTrigger id="export-format">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="csv">CSV File</SelectItem>
                    <SelectItem value="excel">Excel File</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleExport} className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Export All Assets
              </Button>
            </CardContent>
          </Card>

          {/* Galleries */}
          <Dialog>
            <DialogTrigger asChild>
              <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg cursor-pointer">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                    <FileImage className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Galleries</CardTitle>
                  <CardDescription>
                    Asset photo galleries and documents
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    {assetPhotos?.length || 0} photos available
                  </div>
                  <Button variant="outline" className="w-full mt-4">
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
              <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg cursor-pointer">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                    <History className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Audit Trail</CardTitle>
                  <CardDescription>
                    View asset audit logs and history
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    {auditLogs?.length || 0} events recorded
                  </div>
                  <Button variant="outline" className="w-full mt-4">
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
          <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <QrCode className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>QR Code Generator</CardTitle>
              <CardDescription>
                Generate QR codes for asset tracking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" onClick={generateQRCode}>
                Generate QR Codes
              </Button>
            </CardContent>
          </Card>

          {/* Barcode Scanner */}
          <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <Barcode className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Barcode Scanner</CardTitle>
              <CardDescription>
                Scan barcodes for quick asset lookup
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" onClick={() => toast.info('Barcode scanner - Coming soon')}>
                Launch Scanner
              </Button>
            </CardContent>
          </Card>

          {/* Asset Reports */}
          <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Asset Reports</CardTitle>
              <CardDescription>
                Generate comprehensive asset reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate('/helpdesk/assets/reports')}
              >
                View Reports
              </Button>
            </CardContent>
          </Card>

          {/* Maintenance Scheduler */}
          <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <Wrench className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Maintenance Scheduler</CardTitle>
              <CardDescription>
                Schedule and track asset maintenance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => toast.info('Maintenance scheduler - Coming soon')}
              >
                Manage Maintenance
              </Button>
            </CardContent>
          </Card>

          {/* Asset Lifecycle */}
          <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Asset Lifecycle</CardTitle>
              <CardDescription>
                Track asset lifecycle and depreciation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate('/helpdesk/assets/depreciation')}
              >
                View Lifecycle
              </Button>
            </CardContent>
          </Card>

          {/* Inventory Management */}
          <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Inventory Management</CardTitle>
              <CardDescription>
                Stock levels and reorder management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => toast.info('Inventory management - Coming soon')}
              >
                Manage Inventory
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
