import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { useCRMStore } from '@/store/crmStore';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import OpportunityInfoSection from './components/OpportunityInfoSection';
import DealStagePipeline from './components/DealStagePipeline';
import ProbabilityMeter from './components/ProbabilityMeter';
import ActivityTimeline from '../leads/components/ActivityTimeline';
import OpportunityNotes from './components/OpportunityNotes';
import OpportunityQuotes from './components/OpportunityQuotes';
import LinkedCustomer from './components/LinkedCustomer';
import DeleteDialog from './components/DeleteDialog';

const OpportunityDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { fetchActivities, activities, updateOpportunity, deleteOpportunity } = useCRMStore();
  const [opportunity, setOpportunity] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (id) {
      fetchOpportunity();
      fetchActivities('crm_opportunities', id);
    }
  }, [id]);

  const fetchOpportunity = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('crm_opportunities')
        .select('*, crm_customers(*)')
        .eq('id', id)
        .single();

      if (error) throw error;
      setOpportunity(data);
    } catch (error: any) {
      toast.error('Failed to load opportunity details');
      console.error('Error fetching opportunity:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStageChange = async (newStage: string, probability: number) => {
    if (!id) return;
    try {
      await updateOpportunity(id, { stage: newStage, probability });
      setOpportunity({ ...opportunity, stage: newStage, probability });
      toast.success('Stage updated successfully');
    } catch (error) {
      toast.error('Failed to update stage');
    }
  };

  const handleNotesUpdate = async (notes: string) => {
    if (!id) return;
    try {
      // Notes functionality can be added via activities/comments
      toast.info('Notes feature coming soon - use activities for now');
    } catch (error) {
      toast.error('Failed to update notes');
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      await deleteOpportunity(id);
      toast.success('Opportunity deleted successfully');
      navigate('/crm/opportunities');
    } catch (error) {
      toast.error('Failed to delete opportunity');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 pb-16">
          <Skeleton className="h-8 w-64 mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-64" />
              <Skeleton className="h-96" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-32" />
              <Skeleton className="h-48" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 pb-16">
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-4">Opportunity not found</p>
            <Button onClick={() => navigate('/crm/opportunities')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Opportunities
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/crm/opportunities')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">{opportunity.name}</h1>
              <p className="text-muted-foreground">
                ${opportunity.amount?.toLocaleString() || 0}
              </p>
            </div>
          </div>
          <Button
            variant="destructive"
            onClick={() => setDeleteDialogOpen(true)}
            className="gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Opportunity Info */}
            <OpportunityInfoSection opportunity={opportunity} onUpdate={fetchOpportunity} />

            {/* Linked Customer */}
            {opportunity.crm_customers && (
              <LinkedCustomer customer={opportunity.crm_customers} />
            )}

            {/* Quotes */}
            <OpportunityQuotes opportunityId={opportunity.id} />

            {/* Activity Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Activity Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <ActivityTimeline 
                  activities={activities} 
                  leadId={opportunity.id} 
                  onActivityAdded={fetchOpportunity} 
                />
              </CardContent>
            </Card>

            {/* Notes */}
            <OpportunityNotes notes={opportunity.notes || ''} onUpdate={handleNotesUpdate} />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Deal Stage Pipeline */}
            <DealStagePipeline 
              currentStage={opportunity.stage} 
              onStageChange={handleStageChange} 
            />

            {/* Probability Meter */}
            <ProbabilityMeter probability={opportunity.probability || 0} />
          </div>
        </div>
      </div>

      {/* Delete Dialog */}
      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Opportunity"
        description={`Are you sure you want to delete "${opportunity.name}"? This action cannot be undone.`}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default OpportunityDetailPage;
