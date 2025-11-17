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
import CustomerInfoSection from './components/CustomerInfoSection';
import RelatedOpportunities from './components/RelatedOpportunities';
import RelatedQuotes from './components/RelatedQuotes';
import ActivityTimeline from '../leads/components/ActivityTimeline';
import CustomerNotes from './components/CustomerNotes';
import DeleteDialog from '../opportunities/components/DeleteDialog';

const CustomerDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { fetchActivities, activities, deleteCustomer } = useCRMStore();
  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (id) {
      fetchCustomer();
      fetchActivities('crm_customers', id);
    }
  }, [id]);

  const fetchCustomer = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('crm_customers')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setCustomer(data);
    } catch (error: any) {
      toast.error('Failed to load customer details');
      console.error('Error fetching customer:', error);
    } finally {
      setLoading(false);
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
      await deleteCustomer(id);
      toast.success('Customer deleted successfully');
      navigate('/crm/customers');
    } catch (error) {
      toast.error('Failed to delete customer');
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

  if (!customer) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 pb-16">
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-4">Customer not found</p>
            <Button onClick={() => navigate('/crm/customers')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Customers
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
              onClick={() => navigate('/crm/customers')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">{customer.name}</h1>
              <p className="text-muted-foreground">{customer.company}</p>
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
            {/* Customer Info */}
            <CustomerInfoSection customer={customer} onUpdate={fetchCustomer} />

            {/* Related Opportunities */}
            <RelatedOpportunities customerId={customer.id} />

            {/* Related Quotes */}
            <RelatedQuotes customerId={customer.id} />

            {/* Activity Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Activity Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <ActivityTimeline 
                  activities={activities} 
                  leadId={customer.id} 
                  onActivityAdded={fetchCustomer} 
                />
              </CardContent>
            </Card>

            {/* Notes */}
            <CustomerNotes notes={customer.notes || ''} onUpdate={handleNotesUpdate} />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Customer Since</p>
                  <p className="text-lg font-semibold">
                    {new Date(customer.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    Last updated {new Date(customer.updated_at).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Delete Dialog */}
      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Customer"
        description={`Are you sure you want to delete "${customer.name}"? This will also delete all related opportunities and quotes. This action cannot be undone.`}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default CustomerDetailPage;
