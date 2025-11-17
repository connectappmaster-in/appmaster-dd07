import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { useCRMStore } from '@/store/crmStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

const STAGES = [
  { id: 'new', label: 'New', probability: 10, color: 'bg-blue-500' },
  { id: 'contacted', label: 'Contacted', probability: 20, color: 'bg-purple-500' },
  { id: 'qualified', label: 'Qualified', probability: 40, color: 'bg-yellow-500' },
  { id: 'proposal', label: 'Proposal', probability: 60, color: 'bg-orange-500' },
  { id: 'negotiation', label: 'Negotiation', probability: 80, color: 'bg-pink-500' },
  { id: 'won', label: 'Won', probability: 100, color: 'bg-green-500' },
  { id: 'lost', label: 'Lost', probability: 0, color: 'bg-red-500' },
];

const OpportunitiesPage = () => {
  const navigate = useNavigate();
  const { opportunities, loading, fetchOpportunities, updateOpportunity, subscribeToOpportunities } = useCRMStore();

  useEffect(() => {
    fetchOpportunities();
    const unsubscribe = subscribeToOpportunities();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const handleStageChange = async (opportunityId: string, newStage: string) => {
    const stage = STAGES.find(s => s.id === newStage);
    await updateOpportunity(opportunityId, { 
      stage: newStage,
      probability: stage?.probability || 0
    });
  };

  const getStageOpportunities = (stageId: string) => {
    return opportunities.filter(opp => opp.stage === stageId);
  };

  const getTotalPipelineValue = () => {
    return opportunities.reduce((sum, opp) => sum + (opp.amount || 0), 0);
  };

  const getWeightedRevenue = () => {
    return opportunities.reduce((sum, opp) => sum + ((opp.amount || 0) * (opp.probability || 0)) / 100, 0);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Sales Pipeline</h1>
              <p className="text-muted-foreground mt-1">Track opportunities through your sales stages</p>
            </div>
            <Button onClick={() => navigate('/crm/opportunities/new')} className="gap-2">
              <Plus className="h-4 w-4" />
              New Opportunity
            </Button>
          </div>

          {/* Pipeline Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Pipeline</p>
                    <p className="text-2xl font-bold text-foreground">
                      ${getTotalPipelineValue().toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div>
                  <p className="text-sm text-muted-foreground">Weighted Revenue</p>
                  <p className="text-2xl font-bold text-green-500">
                    ${getWeightedRevenue().toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div>
                  <p className="text-sm text-muted-foreground">Total Deals</p>
                  <p className="text-2xl font-bold text-foreground">{opportunities.length}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Kanban Board */}
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-4" style={{ minWidth: 'max-content' }}>
              {STAGES.map((stage) => {
                const stageOpps = getStageOpportunities(stage.id);
                const stageTotal = stageOpps.reduce((sum, opp) => sum + (opp.amount || 0), 0);

                return (
                  <div key={stage.id} className="flex-shrink-0 w-80">
                    <Card className="h-full">
                      <CardHeader className="p-4">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm font-semibold flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${stage.color}`} />
                            {stage.label}
                          </CardTitle>
                          <Badge variant="secondary">{stageOpps.length}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          ${stageTotal.toLocaleString()}
                        </p>
                      </CardHeader>
                      <CardContent className="p-4 pt-0 space-y-3 max-h-[600px] overflow-y-auto">
                        {stageOpps.map((opp) => (
                          <Card
                            key={opp.id}
                            className="cursor-pointer hover:shadow-md transition-shadow"
                            onClick={() => navigate(`/crm/opportunities/${opp.id}`)}
                          >
                            <CardContent className="p-4 space-y-2">
                              <h4 className="font-semibold text-sm">{opp.name}</h4>
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground">Amount</span>
                                <span className="font-semibold">${opp.amount?.toLocaleString()}</span>
                              </div>
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground">Probability</span>
                                <Badge variant="secondary" className="text-xs">
                                  {opp.probability}%
                                </Badge>
                              </div>
                              {opp.close_date && (
                                <div className="text-xs text-muted-foreground pt-2 border-t border-border">
                                  Close: {format(new Date(opp.close_date), 'MMM dd, yyyy')}
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))}

                        {stageOpps.length === 0 && (
                          <div className="text-center py-8 text-muted-foreground text-sm">
                            No opportunities
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpportunitiesPage;