import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Plus, FileText } from 'lucide-react';
import { format } from 'date-fns';

interface OpportunityQuotesProps {
  opportunityId: string;
}

const OpportunityQuotes = ({ opportunityId }: OpportunityQuotesProps) => {
  const navigate = useNavigate();
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuotes();
  }, [opportunityId]);

  const fetchQuotes = async () => {
    try {
      const { data, error } = await supabase
        .from('crm_quotes')
        .select('*')
        .eq('opportunity_id', opportunityId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuotes(data || []);
    } catch (error) {
      console.error('Error fetching quotes:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      draft: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
      sent: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      accepted: 'bg-green-500/10 text-green-500 border-green-500/20',
      rejected: 'bg-red-500/10 text-red-500 border-red-500/20',
    };
    return colors[status] || 'bg-muted text-muted-foreground';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Related Quotes</CardTitle>
          <Button size="sm" variant="outline" className="gap-2">
            <Plus className="h-4 w-4" />
            New Quote
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading quotes...</p>
        ) : quotes.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No quotes yet
          </p>
        ) : (
          <div className="space-y-3">
            {quotes.map((quote) => (
              <div
                key={quote.id}
                className="p-4 border border-border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
                onClick={() => navigate(`/crm/quotes/${quote.id}`)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{quote.quote_number}</span>
                  </div>
                  <Badge className={getStatusColor(quote.status)}>
                    {quote.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {format(new Date(quote.created_at), 'MMM dd, yyyy')}
                  </span>
                  <span className="font-semibold">
                    ${quote.amount?.toLocaleString() || 0}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OpportunityQuotes;
