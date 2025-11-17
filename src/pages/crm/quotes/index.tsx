import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { useCRMStore } from '@/store/crmStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, RefreshCw, Search } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

const QuotesListPage = () => {
  const navigate = useNavigate();
  const { quotes, loading, fetchQuotes, subscribeToQuotes } = useCRMStore();
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchQuotes();
    const unsubscribe = subscribeToQuotes();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchQuotes();
    setRefreshing(false);
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      draft: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
      sent: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      accepted: 'bg-green-500/10 text-green-500 border-green-500/20',
      rejected: 'bg-red-500/10 text-red-500 border-red-500/20',
      expired: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    };
    return colors[status] || 'bg-muted text-muted-foreground';
  };

  const filteredQuotes = search
    ? quotes.filter(q => 
        q.quote_number.toLowerCase().includes(search.toLowerCase())
      )
    : quotes;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Quotes</h1>
              <p className="text-muted-foreground mt-1">Manage sales quotes and proposals</p>
            </div>
            <Button onClick={() => navigate('/crm/quotes/new')} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Quote
            </Button>
          </div>

          {/* Filters Bar */}
          <div className="flex items-center gap-4 p-4 bg-card rounded-lg border border-border">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search quotes by number..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
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

          {/* Table */}
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            {loading ? (
              <div className="p-8 space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16" />
                ))}
              </div>
            ) : filteredQuotes.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground mb-4">No quotes found</p>
                <Button onClick={() => navigate('/crm/quotes/new')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Quote
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Quote #</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Valid Until</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredQuotes.map((quote) => (
                    <TableRow 
                      key={quote.id}
                      className="cursor-pointer hover:bg-accent/50 transition-colors"
                      onClick={() => navigate(`/crm/quotes/${quote.id}`)}
                    >
                      <TableCell className="font-medium">{quote.quote_number}</TableCell>
                      <TableCell className="font-semibold">
                        ${(quote.amount + quote.tax_amount).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(quote.status)}>
                          {quote.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {quote.valid_until ? format(new Date(quote.valid_until), 'MMM dd, yyyy') : '-'}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(quote.created_at), 'MMM dd, yyyy')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>

          {/* Stats */}
          {!loading && quotes.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 bg-card rounded-lg border border-border">
                <p className="text-sm text-muted-foreground">Total Quotes</p>
                <p className="text-2xl font-bold text-foreground">{quotes.length}</p>
              </div>
              <div className="p-4 bg-card rounded-lg border border-border">
                <p className="text-sm text-muted-foreground">Accepted</p>
                <p className="text-2xl font-bold text-green-500">
                  {quotes.filter(q => q.status === 'accepted').length}
                </p>
              </div>
              <div className="p-4 bg-card rounded-lg border border-border">
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-blue-500">
                  {quotes.filter(q => q.status === 'sent').length}
                </p>
              </div>
              <div className="p-4 bg-card rounded-lg border border-border">
                <p className="text-sm text-muted-foreground">Total Value</p>
                <p className="text-2xl font-bold text-foreground">
                  ${quotes.reduce((sum, q) => sum + q.amount + q.tax_amount, 0).toLocaleString()}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuotesListPage;