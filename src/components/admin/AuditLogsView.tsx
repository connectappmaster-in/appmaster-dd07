import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AuditLogsView() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Audit Logs</h1>
      <Card>
        <CardHeader>
          <CardTitle>System Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Audit logs interface coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}
