import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Pause, X, MoreVertical } from "lucide-react";
import { format, differenceInDays } from "date-fns";

interface Subscription {
  id: string;
  subscription_name: string;
  provider_name: string;
  category: string;
  cost: number;
  billing_cycle: string;
  renewal_date: string;
  status: string;
}

interface SubscriptionTableProps {
  subscriptions: Subscription[];
  onEdit?: (id: string) => void;
  onPause?: (id: string) => void;
  onCancel?: (id: string) => void;
}

export const SubscriptionTable = ({ subscriptions, onEdit, onPause, onCancel }: SubscriptionTableProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getDaysUntilRenewal = (renewalDate: string) => {
    return differenceInDays(new Date(renewalDate), new Date());
  };

  const getRenewalDateColor = (days: number) => {
    if (days > 90) return "text-green-600 dark:text-green-400";
    if (days >= 30) return "text-amber-600 dark:text-amber-400";
    return "text-red-600 dark:text-red-400";
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'default';
      case 'paused':
        return 'secondary';
      case 'expired':
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'SaaS': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      'Streaming': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      'Cloud Storage': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      'Productivity': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
      'Entertainment': 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
      'Development': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
    };
    return colors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
  };

  if (subscriptions.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-lg mb-2">No subscriptions found</p>
        <p className="text-sm">Add your first subscription to get started</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="font-semibold">Subscription Name</TableHead>
            <TableHead className="font-semibold">Category</TableHead>
            <TableHead className="font-semibold text-right">Cost</TableHead>
            <TableHead className="font-semibold">Billing Cycle</TableHead>
            <TableHead className="font-semibold">Renewal Date</TableHead>
            <TableHead className="font-semibold">Days Until Renewal</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subscriptions.map((sub) => {
            const daysUntil = getDaysUntilRenewal(sub.renewal_date);
            const renewalColor = getRenewalDateColor(daysUntil);

            return (
              <TableRow key={sub.id} className="hover:bg-muted/30 cursor-pointer transition-colors">
                <TableCell>
                  <div>
                    <p className="font-medium text-foreground">{sub.subscription_name}</p>
                    <p className="text-sm text-muted-foreground">{sub.provider_name}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getCategoryColor(sub.category)} variant="outline">
                    {sub.category}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-semibold">{formatCurrency(sub.cost)}</TableCell>
                <TableCell className="capitalize">{sub.billing_cycle}</TableCell>
                <TableCell className={renewalColor}>
                  {format(new Date(sub.renewal_date), 'dd MMM yyyy')}
                </TableCell>
                <TableCell className={renewalColor}>
                  {daysUntil} days
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(sub.status)} className="capitalize">
                    {sub.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => onEdit?.(sub.id)}
                      className="h-8 w-8"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => onPause?.(sub.id)}
                      className="h-8 w-8"
                    >
                      <Pause className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => onCancel?.(sub.id)}
                      className="h-8 w-8"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
