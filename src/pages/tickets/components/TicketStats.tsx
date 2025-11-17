import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Ticket, Clock, AlertCircle, CheckCircle } from "lucide-react";
interface TicketStatsProps {
  totalOpen: number;
  overdue: number;
  resolved: number;
  avgResponseTime: string;
}
export const TicketStats = ({
  totalOpen,
  overdue,
  resolved,
  avgResponseTime
}: TicketStatsProps) => {
  return <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
      <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5 px-3 pt-3">
          <CardTitle className="text-[11px] font-medium text-muted-foreground">Open Tickets</CardTitle>
          <Ticket className="h-3.5 w-3.5 text-muted-foreground" />
        </CardHeader>
        <CardContent className="px-3 pb-3">
          <div className="text-xl font-bold">{totalOpen}</div>
          <p className="text-[10px] text-muted-foreground mt-0.5">Active support requests</p>
        </CardContent>
      </Card>
      
      <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5 px-3 pt-3">
          <CardTitle className="text-[11px] font-medium text-muted-foreground">Overdue</CardTitle>
          <AlertCircle className="h-3.5 w-3.5 text-destructive" />
        </CardHeader>
        <CardContent className="px-3 pb-3">
          <div className="text-xl font-bold text-destructive">{overdue}</div>
          <p className="text-[10px] text-muted-foreground mt-0.5">Past due date</p>
        </CardContent>
      </Card>
      
      <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5 px-3 pt-3">
          <CardTitle className="text-[11px] font-medium text-muted-foreground">Resolved</CardTitle>
          <CheckCircle className="h-3.5 w-3.5 text-green-600" />
        </CardHeader>
        <CardContent className="px-3 pb-3">
          <div className="text-xl font-bold">{resolved}</div>
          <p className="text-[10px] text-muted-foreground mt-0.5">Successfully closed</p>
        </CardContent>
      </Card>
      
      
    </div>;
};