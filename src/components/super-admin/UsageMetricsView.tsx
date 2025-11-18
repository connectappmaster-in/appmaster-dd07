import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function UsageMetricsView() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Usage Metrics</h1>
      <Card>
        <CardHeader>
          <CardTitle>Platform Usage Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Usage metrics dashboard coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}
