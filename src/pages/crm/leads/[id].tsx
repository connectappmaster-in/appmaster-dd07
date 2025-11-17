import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { useCRMStore } from '@/store/crmStore';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, UserPlus, Briefcase, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import LeadInfoSection from './components/LeadInfoSection';
import LeadStatusSelector from './components/LeadStatusSelector';
import LeadScoreMeter from './components/LeadScoreMeter';
import ActivityTimeline from './components/ActivityTimeline';
import LeadNotes from './components/LeadNotes';
import ConvertDialog from './components/ConvertDialog';
import DeleteDialog from '../opportunities/components/DeleteDialog';

const LeadDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { fetchActivities, activities, updateLead, deleteLead } = useCRMStore();
  const [lead, setLead] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [convertDialogOpen, setConvertDialogOpen] = useState(false);
  const [convertType, setConvertType] = useState<'customer' | 'opportunity'>('customer');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (id) {
      fetchLead();
      fetchActivities('leads', id);
    }
  }, [id]);

  const fetchLead = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setLead(data);
    } catch (error: any) {
      toast.error('Failed to load lead details');
      console.error('Error fetching lead:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!id) return;
    try {
      await updateLead(id, { status: newStatus });
      setLead({ ...lead, status: newStatus });
      toast.success('Status updated successfully');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleNotesUpdate = async (notes: string) => {
    if (!id) return;
    try {
      await updateLead(id, { notes });
      setLead({ ...lead, notes });
      toast.success('Notes updated successfully');
    } catch (error) {
      toast.error('Failed to update notes');
    }
  };

  const handleConvert = (type: 'customer' | 'opportunity') => {
    setConvertType(type);
    setConvertDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      await deleteLead(id);
      toast.success('Lead deleted successfully');
      navigate('/crm/leads');
    } catch (error) {
      toast.error('Failed to delete lead');
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

  if (!lead) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 pb-16">
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-4">Lead not found</p>
            <Button onClick={() => navigate('/crm/leads')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Leads
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
              onClick={() => navigate('/crm/leads')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">{lead.title}</h1>
              <p className="text-muted-foreground">{lead.company}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => handleConvert('customer')}
              className="gap-2"
            >
              <UserPlus className="h-4 w-4" />
              Convert to Customer
            </Button>
            <Button
              variant="outline"
              onClick={() => handleConvert('opportunity')}
              className="gap-2"
            >
              <Briefcase className="h-4 w-4" />
              Convert to Opportunity
            </Button>
            <Button
              variant="destructive"
              onClick={() => setDeleteDialogOpen(true)}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Lead Info */}
            <LeadInfoSection lead={lead} onUpdate={fetchLead} />

            {/* Activity Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Activity Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <ActivityTimeline activities={activities} leadId={lead.id} onActivityAdded={fetchLead} />
              </CardContent>
            </Card>

            {/* Notes */}
            <LeadNotes notes={lead.notes || ''} onUpdate={handleNotesUpdate} />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Status Selector */}
            <LeadStatusSelector 
              currentStatus={lead.status} 
              onStatusChange={handleStatusChange} 
            />

            {/* Score Meter */}
            <LeadScoreMeter score={lead.score || 0} />
          </div>
        </div>
      </div>

      {/* Convert Dialog */}
      <ConvertDialog
        open={convertDialogOpen}
        onOpenChange={setConvertDialogOpen}
        lead={lead}
        convertType={convertType}
        onSuccess={() => {
          navigate(convertType === 'customer' ? '/crm/customers' : '/crm/opportunities');
        }}
      />

      {/* Delete Dialog */}
      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Lead"
        description={`Are you sure you want to delete "${lead.title}"? This action cannot be undone.`}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default LeadDetailPage;
