import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ToolsAccessView() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Tools Access Control</h1>
      <Card>
        <CardHeader>
          <CardTitle>Tool Permissions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Tools access management interface coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}
