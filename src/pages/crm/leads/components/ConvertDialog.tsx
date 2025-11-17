import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCRMStore } from '@/store/crmStore';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface ConvertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: any;
  convertType: 'customer' | 'opportunity';
  onSuccess: () => void;
}

const ConvertDialog = ({ open, onOpenChange, lead, convertType, onSuccess }: ConvertDialogProps) => {
  const { createCustomer, createOpportunity } = useCRMStore();
  const [converting, setConverting] = useState(false);
  const [formData, setFormData] = useState({
    name: lead?.title || '',
    amount: lead?.value || 0,
    closeDate: '',
    stage: 'qualification',
  });

  const handleConvert = async () => {
    setConverting(true);
    try {
      if (convertType === 'customer') {
        const customer = await createCustomer({
          name: lead.title,
          email: lead.email,
          phone: lead.phone,
          company: lead.company,
        });

        if (customer) {
          toast.success('Lead converted to customer successfully');
          onSuccess();
          onOpenChange(false);
        }
      } else {
        const opportunity = await createOpportunity({
          name: formData.name,
          amount: formData.amount,
          close_date: formData.closeDate,
          stage: formData.stage,
          lead_id: lead.id,
          probability: lead.probability || 50,
        });

        if (opportunity) {
          toast.success('Lead converted to opportunity successfully');
          onSuccess();
          onOpenChange(false);
        }
      }
    } catch (error) {
      toast.error(`Failed to convert lead to ${convertType}`);
      console.error('Error converting lead:', error);
    } finally {
      setConverting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Convert to {convertType === 'customer' ? 'Customer' : 'Opportunity'}
          </DialogTitle>
          <DialogDescription>
            {convertType === 'customer'
              ? 'This will create a new customer record with the lead information.'
              : 'This will create a new opportunity linked to this lead.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {convertType === 'opportunity' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="name">Opportunity Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter opportunity name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                  placeholder="Enter estimated amount"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="closeDate">Expected Close Date</Label>
                <Input
                  id="closeDate"
                  type="date"
                  value={formData.closeDate}
                  onChange={(e) => setFormData({ ...formData, closeDate: e.target.value })}
                />
              </div>
            </>
          )}

          {convertType === 'customer' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between py-2">
                <span className="text-sm font-medium">Name:</span>
                <span className="text-sm text-muted-foreground">{lead.title}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm font-medium">Email:</span>
                <span className="text-sm text-muted-foreground">{lead.email || '-'}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm font-medium">Phone:</span>
                <span className="text-sm text-muted-foreground">{lead.phone || '-'}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm font-medium">Company:</span>
                <span className="text-sm text-muted-foreground">{lead.company || '-'}</span>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={converting}>
            Cancel
          </Button>
          <Button onClick={handleConvert} disabled={converting}>
            {converting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Convert
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConvertDialog;
