import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function GlobalUsersView() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Global Users</h1>
      <Card>
        <CardHeader>
          <CardTitle>All Users Across Tenants</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">User management interface coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}
