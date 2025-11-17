import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { KPICards } from "./components/KPICards";
import { SubscriptionTable } from "./components/SubscriptionTable";
import { UpcomingRenewals } from "./components/UpcomingRenewals";
import { AddSubscriptionDialog } from "./components/AddSubscriptionDialog";
import { Button } from "@/components/ui/button";
import { List, FileDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const Subscriptions = () => {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserId(user?.id || null);
    });
  }, []);

  const { data: subscriptions = [], isLoading, refetch } = useQuery({
    queryKey: ['subscriptions', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .order('renewal_date', { ascending: true });
      
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  // Calculate KPI metrics
  const activeSubscriptions = subscriptions.filter(s => s.status === 'active').length;
  
  const monthlyRecurringRevenue = subscriptions
    .filter(s => s.status === 'active' && s.billing_cycle === 'monthly')
    .reduce((sum, s) => sum + (s.cost || 0), 0);
  
  const annualExpectedCost = subscriptions
    .filter(s => s.status === 'active')
    .reduce((sum, s) => {
      const cost = s.cost || 0;
      switch (s.billing_cycle) {
        case 'monthly': return sum + (cost * 12);
        case 'quarterly': return sum + (cost * 4);
        case 'semi-annual': return sum + (cost * 2);
        case 'annual': return sum + cost;
        default: return sum;
      }
    }, 0);

  const today = new Date();
  const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
  const sevenDaysFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

  const upcomingRenewals30Days = subscriptions.filter(s => {
    if (s.status !== 'active' || !s.renewal_date) return false;
    const renewalDate = new Date(s.renewal_date);
    return renewalDate >= today && renewalDate <= thirtyDaysFromNow;
  }).length;

  const expiringSoon7Days = subscriptions.filter(s => {
    if (s.status !== 'active' || !s.renewal_date) return false;
    const renewalDate = new Date(s.renewal_date);
    return renewalDate >= today && renewalDate <= sevenDaysFromNow;
  }).length;

  const activeAlerts = expiringSoon7Days; // Simplified for now

  const upcomingSubscriptions = subscriptions
    .filter(s => s.status === 'active' && s.renewal_date)
    .sort((a, b) => new Date(a.renewal_date).getTime() - new Date(b.renewal_date).getTime());

  const recentActiveSubscriptions = subscriptions
    .filter(s => s.status === 'active')
    .slice(0, 7);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 pb-16">
          <Skeleton className="h-12 w-64 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground">Subscriptions Dashboard</h1>
              <p className="text-lg text-muted-foreground mt-2">
                Track and manage all your recurring subscriptions
              </p>
            </div>
          </div>

          {/* KPI Cards */}
          <KPICards
            activeSubscriptions={activeSubscriptions}
            monthlyRecurringRevenue={monthlyRecurringRevenue}
            annualExpectedCost={annualExpectedCost}
            upcomingRenewals30Days={upcomingRenewals30Days}
            expiringSoon7Days={expiringSoon7Days}
            activeAlerts={activeAlerts}
          />

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-4">
            <AddSubscriptionDialog onSuccess={refetch} />
            <Button variant="outline" className="gap-2">
              <List className="h-4 w-4" />
              View All Subscriptions
            </Button>
            <Button variant="outline" className="gap-2">
              <FileDown className="h-4 w-4" />
              Import Subscriptions
            </Button>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Subscription Table */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">Recent Active Subscriptions</h2>
              <SubscriptionTable subscriptions={recentActiveSubscriptions} />
            </div>

            {/* Upcoming Renewals Sidebar */}
            <div className="lg:col-span-1">
              <UpcomingRenewals subscriptions={upcomingSubscriptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscriptions;
