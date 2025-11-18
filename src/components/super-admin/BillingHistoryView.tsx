import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function BillingHistoryView() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Billing History</h1>
      <Card>
        <CardHeader>
          <CardTitle>Payment & Invoice Records</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Billing history interface coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}
