import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Briefcase } from 'lucide-react';
import { format } from 'date-fns';

interface RelatedOpportunitiesProps {
  customerId: string;
}

const RelatedOpportunities = ({ customerId }: RelatedOpportunitiesProps) => {
  const navigate = useNavigate();
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOpportunities();
  }, [customerId]);

  const fetchOpportunities = async () => {
    try {
      const { data, error } = await supabase
        .from('crm_opportunities')
        .select('*')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOpportunities(data || []);
    } catch (error) {
      console.error('Error fetching opportunities:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStageColor = (stage: string) => {
    const colors: any = {
      new: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      qualified: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      proposal: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
      won: 'bg-green-500/10 text-green-500 border-green-500/20',
      lost: 'bg-red-500/10 text-red-500 border-red-500/20',
    };
    return colors[stage] || 'bg-muted text-muted-foreground';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Related Opportunities</CardTitle>
          <Button size="sm" variant="outline" className="gap-2">
            <Plus className="h-4 w-4" />
            New Opportunity
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading opportunities...</p>
        ) : opportunities.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No opportunities yet
          </p>
        ) : (
          <div className="space-y-3">
            {opportunities.map((opp) => (
              <div
                key={opp.id}
                className="p-4 border border-border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
                onClick={() => navigate(`/crm/opportunities/${opp.id}`)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{opp.name}</span>
                  </div>
                  <Badge className={getStageColor(opp.stage)}>
                    {opp.stage}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {opp.close_date
                      ? format(new Date(opp.close_date), 'MMM dd, yyyy')
                      : 'No close date'}
                  </span>
                  <span className="font-semibold">
                    ${opp.amount?.toLocaleString() || 0}
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

export default RelatedOpportunities;
