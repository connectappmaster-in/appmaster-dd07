import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SystemLogsView() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">System Logs</h1>
      <Card>
        <CardHeader>
          <CardTitle>Audit Trail & System Events</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">System logs viewer coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}
