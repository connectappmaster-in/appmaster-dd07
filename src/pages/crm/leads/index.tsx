import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { useCRMStore } from '@/store/crmStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, RefreshCw, Search, Filter } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

const LeadsListPage = () => {
  const navigate = useNavigate();
  const { leads, loading, fetchLeads, subscribeToLeads } = useCRMStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchLeads();
    const unsubscribe = subscribeToLeads();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchLeads({ 
        search: search || undefined, 
        status: statusFilter !== 'all' ? statusFilter : undefined 
      });
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search, statusFilter]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchLeads({ 
      search: search || undefined, 
      status: statusFilter !== 'all' ? statusFilter : undefined 
    });
    setRefreshing(false);
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      new: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      contacted: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      qualified: 'bg-green-500/10 text-green-500 border-green-500/20',
      unqualified: 'bg-red-500/10 text-red-500 border-red-500/20',
    };
    return colors[status] || 'bg-muted text-muted-foreground';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 70) return <Badge className="bg-red-500/10 text-red-500 border-red-500/20">🔥 Hot</Badge>;
    if (score >= 40) return <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Warm</Badge>;
    return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">Cold</Badge>;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">CRM Leads</h1>
              <p className="text-muted-foreground mt-1">Manage and track your sales leads</p>
            </div>
            <Button onClick={() => navigate('/crm/leads/new')} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Lead
            </Button>
          </div>

          {/* Filters Bar */}
          <div className="flex items-center gap-4 p-4 bg-card rounded-lg border border-border">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search leads by name, company, email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="qualified">Qualified</SelectItem>
                <SelectItem value="unqualified">Unqualified</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>

          {/* Table */}
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            {loading ? (
              <div className="p-8 space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex gap-4">
                    <Skeleton className="h-12 flex-1" />
                    <Skeleton className="h-12 w-32" />
                    <Skeleton className="h-12 w-24" />
                  </div>
                ))}
              </div>
            ) : leads.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground mb-4">No leads found</p>
                <Button onClick={() => navigate('/crm/leads/new')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Lead
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leads.map((lead) => (
                    <TableRow 
                      key={lead.id}
                      className="cursor-pointer hover:bg-accent/50 transition-colors"
                      onClick={() => navigate(`/crm/leads/${lead.id}`)}
                    >
                      <TableCell className="font-medium">{lead.title}</TableCell>
                      <TableCell>{lead.company || '-'}</TableCell>
                      <TableCell>{lead.email || '-'}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(lead.status)}>{lead.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{lead.score || 0}</span>
                          {getScoreBadge(lead.score || 0)}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(lead.created_at), 'MMM dd, yyyy')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>

          {/* Stats */}
          {!loading && leads.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 bg-card rounded-lg border border-border">
                <p className="text-sm text-muted-foreground">Total Leads</p>
                <p className="text-2xl font-bold text-foreground">{leads.length}</p>
              </div>
              <div className="p-4 bg-card rounded-lg border border-border">
                <p className="text-sm text-muted-foreground">Hot Leads</p>
                <p className="text-2xl font-bold text-red-500">
                  {leads.filter(l => (l.score || 0) >= 70).length}
                </p>
              </div>
              <div className="p-4 bg-card rounded-lg border border-border">
                <p className="text-sm text-muted-foreground">Qualified</p>
                <p className="text-2xl font-bold text-green-500">
                  {leads.filter(l => l.status === 'qualified').length}
                </p>
              </div>
              <div className="p-4 bg-card rounded-lg border border-border">
                <p className="text-sm text-muted-foreground">Avg Score</p>
                <p className="text-2xl font-bold text-foreground">
                  {Math.round(leads.reduce((acc, l) => acc + (l.score || 0), 0) / leads.length)}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeadsListPage;