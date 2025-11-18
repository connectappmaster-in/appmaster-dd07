import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function RolesView() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Role Management</h1>
      <Card>
        <CardHeader>
          <CardTitle>Roles & Permissions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Role management interface coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}
