import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function APIKeysView() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">API Keys</h1>
      <Card>
        <CardHeader>
          <CardTitle>API Key Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">API keys interface coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}
