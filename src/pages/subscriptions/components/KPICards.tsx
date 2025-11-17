import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Calendar, DollarSign, CalendarClock, AlertCircle, Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface KPICardProps {
  title: string;
  value: string | number;
  subtext: string;
  icon: React.ReactNode;
  bgColor: string;
  alertCount?: number;
}

const KPICard = ({ title, value, subtext, icon, bgColor, alertCount }: KPICardProps) => (
  <Card className={`${bgColor} border-border relative overflow-hidden`}>
    <CardContent className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-2">{title}</p>
          <p className="text-3xl font-bold text-foreground mb-1">{value}</p>
          <p className="text-xs text-muted-foreground">{subtext}</p>
        </div>
        <div className="text-primary opacity-80">
          {icon}
        </div>
      </div>
      {alertCount !== undefined && alertCount > 0 && (
        <Badge variant="destructive" className="absolute top-2 right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center">
          {alertCount}
        </Badge>
      )}
    </CardContent>
  </Card>
);

interface KPICardsProps {
  activeSubscriptions: number;
  monthlyRecurringRevenue: number;
  annualExpectedCost: number;
  upcomingRenewals30Days: number;
  expiringSoon7Days: number;
  activeAlerts: number;
}

export const KPICards = ({
  activeSubscriptions,
  monthlyRecurringRevenue,
  annualExpectedCost,
  upcomingRenewals30Days,
  expiringSoon7Days,
  activeAlerts,
}: KPICardsProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <KPICard
        title="Total Active Subscriptions"
        value={activeSubscriptions}
        subtext="Active Subscriptions"
        icon={<CheckCircle className="h-10 w-10" />}
        bgColor="bg-blue-50 dark:bg-blue-950/20"
      />
      <KPICard
        title="Monthly Recurring Revenue"
        value={formatCurrency(monthlyRecurringRevenue)}
        subtext="Monthly Recurring Revenue"
        icon={<Calendar className="h-10 w-10" />}
        bgColor="bg-green-50 dark:bg-green-950/20"
      />
      <KPICard
        title="Annual Expected Cost"
        value={formatCurrency(annualExpectedCost)}
        subtext="Annual Expected Cost"
        icon={<DollarSign className="h-10 w-10" />}
        bgColor="bg-orange-50 dark:bg-orange-950/20"
      />
      <KPICard
        title="Upcoming Renewals"
        value={`${upcomingRenewals30Days} in next 30 days`}
        subtext="Upcoming Renewals"
        icon={<CalendarClock className="h-10 w-10" />}
        bgColor="bg-amber-50 dark:bg-amber-950/20"
      />
      <KPICard
        title="Expiring Soon"
        value={expiringSoon7Days}
        subtext="Expiring This Week"
        icon={<AlertCircle className="h-10 w-10" />}
        bgColor="bg-red-50 dark:bg-red-950/20"
      />
      <KPICard
        title="Subscription Alerts"
        value={activeAlerts}
        subtext="Active Alerts"
        icon={<Bell className="h-10 w-10" />}
        bgColor="bg-red-50 dark:bg-red-950/20"
        alertCount={activeAlerts}
      />
    </div>
  );
};
