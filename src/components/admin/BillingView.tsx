import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function BillingView() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Billing Management</h1>
      <Card>
        <CardHeader>
          <CardTitle>Billing & Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Billing management interface coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}
