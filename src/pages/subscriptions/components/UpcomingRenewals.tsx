import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Calendar } from "lucide-react";

interface Subscription {
  id: string;
  subscription_name: string;
  renewal_date: string;
  cost: number;
}

interface UpcomingRenewalsProps {
  subscriptions: Subscription[];
  onManage?: (id: string) => void;
}

export const UpcomingRenewals = ({ subscriptions, onManage }: UpcomingRenewalsProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  if (subscriptions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Next 5 Renewals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            No upcoming renewals
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Next 5 Renewals
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {subscriptions.slice(0, 5).map((sub) => (
          <div key={sub.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
            <div className="flex-1">
              <p className="font-medium text-foreground">{sub.subscription_name}</p>
              <div className="flex items-center gap-4 mt-1">
                <p className="text-sm text-muted-foreground">
                  {format(new Date(sub.renewal_date), 'dd MMM')}
                </p>
                <p className="text-sm font-semibold text-foreground">
                  {formatCurrency(sub.cost)}
                </p>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onManage?.(sub.id)}
            >
              Manage
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
