import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, DollarSign, Percent } from 'lucide-react';
import { format } from 'date-fns';

interface OpportunityInfoSectionProps {
  opportunity: any;
  onUpdate: () => void;
}

const OpportunityInfoSection = ({ opportunity }: OpportunityInfoSectionProps) => {
  const getStageColor = (stage: string) => {
    const colors: any = {
      new: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      contacted: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
      qualified: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      proposal: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
      negotiation: 'bg-pink-500/10 text-pink-500 border-pink-500/20',
      won: 'bg-green-500/10 text-green-500 border-green-500/20',
      lost: 'bg-red-500/10 text-red-500 border-red-500/20',
    };
    return colors[stage] || 'bg-muted text-muted-foreground';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Opportunity Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Amount */}
          <div className="flex items-start gap-3">
            <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm text-muted-foreground">Deal Value</p>
              <p className="text-xl font-bold text-foreground">
                ${opportunity.amount?.toLocaleString() || 0}
              </p>
            </div>
          </div>

          {/* Probability */}
          <div className="flex items-start gap-3">
            <Percent className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm text-muted-foreground">Win Probability</p>
              <p className="text-xl font-bold text-foreground">
                {opportunity.probability || 0}%
              </p>
            </div>
          </div>

          {/* Stage */}
          <div className="flex items-start gap-3">
            <div className="h-5 w-5 mt-0.5" />
            <div>
              <p className="text-sm text-muted-foreground">Current Stage</p>
              <Badge className={getStageColor(opportunity.stage)}>
                {opportunity.stage}
              </Badge>
            </div>
          </div>

          {/* Expected Close Date */}
          {opportunity.close_date && (
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Expected Close Date</p>
                <p className="font-medium">
                  {format(new Date(opportunity.close_date), 'MMM dd, yyyy')}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Weighted Revenue */}
        <div className="pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Weighted Revenue</span>
            <span className="text-lg font-bold text-green-500">
              ${((opportunity.amount || 0) * (opportunity.probability || 0) / 100).toLocaleString()}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Based on deal value × win probability
          </p>
        </div>

        {/* Created Date */}
        <div className="pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Created on {format(new Date(opportunity.created_at), 'MMM dd, yyyy')} • 
            Last updated {format(new Date(opportunity.updated_at), 'MMM dd, yyyy')}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default OpportunityInfoSection;
