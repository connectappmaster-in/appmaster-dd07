import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function OrganisationSettings() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Organization Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Organization settings interface coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}
