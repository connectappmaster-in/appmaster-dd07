import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function WebhooksView() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Webhooks</h1>
      <Card>
        <CardHeader>
          <CardTitle>Webhook Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Webhooks interface coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}
