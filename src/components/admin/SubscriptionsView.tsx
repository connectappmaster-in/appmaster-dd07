import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SubscriptionsView() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Subscription Plans</h1>
      <Card>
        <CardHeader>
          <CardTitle>Plans Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Subscription management interface coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}
