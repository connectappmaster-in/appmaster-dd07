import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function FeatureFlagsView() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Feature Flags</h1>
      <Card>
        <CardHeader>
          <CardTitle>Feature Rollout Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Feature flags interface coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}
