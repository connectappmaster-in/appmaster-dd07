import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { useCRMStore } from '@/store/crmStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, RefreshCw, Search, Grid, List } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';

const CustomersListPage = () => {
  const navigate = useNavigate();
  const { customers, loading, fetchCustomers, subscribeToCustomers } = useCRMStore();
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchCustomers();
    const unsubscribe = subscribeToCustomers();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchCustomers({ search: search || undefined });
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchCustomers({ search: search || undefined });
    setRefreshing(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Customers</h1>
              <p className="text-muted-foreground mt-1">Manage your customer relationships</p>
            </div>
            <Button onClick={() => navigate('/crm/customers/new')} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Customer
            </Button>
          </div>

          {/* Filters Bar */}
          <div className="flex items-center gap-4 p-4 bg-card rounded-lg border border-border">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search customers by name, company, email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'table' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('table')}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
            </div>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>

          {/* Content */}
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16" />
              ))}
            </div>
          ) : customers.length === 0 ? (
            <div className="text-center py-16 bg-card rounded-lg border border-border">
              <p className="text-muted-foreground mb-4">No customers found</p>
              <Button onClick={() => navigate('/crm/customers/new')}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Customer
              </Button>
            </div>
          ) : viewMode === 'table' ? (
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Industry</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((customer) => (
                    <TableRow 
                      key={customer.id}
                      className="cursor-pointer hover:bg-accent/50 transition-colors"
                      onClick={() => navigate(`/crm/customers/${customer.id}`)}
                    >
                      <TableCell className="font-medium">{customer.name}</TableCell>
                      <TableCell>{customer.company || '-'}</TableCell>
                      <TableCell>{customer.email || '-'}</TableCell>
                      <TableCell>{customer.phone || '-'}</TableCell>
                      <TableCell>{customer.industry || '-'}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(customer.created_at), 'MMM dd, yyyy')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {customers.map((customer) => (
                <Card 
                  key={customer.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => navigate(`/crm/customers/${customer.id}`)}
                >
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold text-lg text-foreground">{customer.name}</h3>
                        <p className="text-sm text-muted-foreground">{customer.company}</p>
                      </div>
                      <div className="space-y-1 text-sm">
                        <p className="text-muted-foreground">{customer.email}</p>
                        <p className="text-muted-foreground">{customer.phone}</p>
                      </div>
                      {customer.industry && (
                        <div className="pt-2 border-t border-border">
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                            {customer.industry}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Stats */}
          {!loading && customers.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-card rounded-lg border border-border">
                <p className="text-sm text-muted-foreground">Total Customers</p>
                <p className="text-2xl font-bold text-foreground">{customers.length}</p>
              </div>
              <div className="p-4 bg-card rounded-lg border border-border">
                <p className="text-sm text-muted-foreground">Industries</p>
                <p className="text-2xl font-bold text-foreground">
                  {new Set(customers.map(c => c.industry).filter(Boolean)).size}
                </p>
              </div>
              <div className="p-4 bg-card rounded-lg border border-border">
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold text-green-500">
                  {customers.filter(c => {
                    const created = new Date(c.created_at);
                    const now = new Date();
                    return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
                  }).length}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomersListPage;