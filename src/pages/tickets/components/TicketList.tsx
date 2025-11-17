import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { formatDistanceToNow } from "date-fns";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Ticket {
  id: string;
  ticket_number: string;
  title: string;
  customer_name: string;
  priority: string;
  status: string;
  created_at: string;
  assigned_to?: string;
  profiles?: {
    full_name: string;
  };
}

interface TicketListProps {
  tickets: Ticket[];
  selectedTickets: string[];
  onSelectTicket: (ticketId: string) => void;
  onSelectAll: (checked: boolean) => void;
  onViewTicket: (ticketId: string) => void;
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'Critical': return 'bg-destructive text-destructive-foreground';
    case 'High': return 'bg-orange-500 text-white';
    case 'Medium': return 'bg-yellow-500 text-white';
    case 'Low': return 'bg-blue-500 text-white';
    default: return 'bg-secondary text-secondary-foreground';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Open': return 'bg-blue-500 text-white';
    case 'In Progress': return 'bg-yellow-500 text-white';
    case 'Pending': return 'bg-gray-500 text-white';
    case 'Resolved': return 'bg-green-500 text-white';
    case 'Closed': return 'bg-gray-500 text-white';
    default: return 'bg-secondary text-secondary-foreground';
  }
};

export const TicketList = ({ tickets, selectedTickets, onSelectTicket, onSelectAll, onViewTicket }: TicketListProps) => {
  const allSelected = tickets.length > 0 && selectedTickets.length === tickets.length;
  const someSelected = selectedTickets.length > 0 && selectedTickets.length < tickets.length;

  return (
    <div className="rounded-lg border border-border/50 shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30">
            <TableHead className="w-10 py-2">
              <Checkbox checked={allSelected} onCheckedChange={onSelectAll} className={someSelected ? "data-[state=checked]:bg-primary/50" : ""} />
            </TableHead>
            <TableHead className="py-2 text-[11px] font-semibold">Ticket #</TableHead>
            <TableHead className="py-2 text-[11px] font-semibold">Title</TableHead>
            <TableHead className="py-2 text-[11px] font-semibold">Customer</TableHead>
            <TableHead className="py-2 text-[11px] font-semibold">Priority</TableHead>
            <TableHead className="py-2 text-[11px] font-semibold">Status</TableHead>
            <TableHead className="py-2 text-[11px] font-semibold">Assigned To</TableHead>
            <TableHead className="py-2 text-[11px] font-semibold">Created</TableHead>
            <TableHead className="py-2 text-[11px] font-semibold text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center text-muted-foreground py-8 text-sm">No tickets found</TableCell>
            </TableRow>
          ) : (
            tickets.map((ticket) => {
              const isSelected = selectedTickets.includes(ticket.id);
              return (
                <TableRow key={ticket.id} className={`cursor-pointer transition-colors hover:bg-muted/40 ${isSelected ? 'bg-muted/30' : ''}`} onClick={() => onViewTicket(ticket.id)}>
                  <TableCell className="py-2" onClick={(e) => e.stopPropagation()}>
                    <Checkbox checked={isSelected} onCheckedChange={() => onSelectTicket(ticket.id)} />
                  </TableCell>
                  <TableCell className="font-mono text-[11px] py-2">{ticket.ticket_number}</TableCell>
                  <TableCell className="font-medium max-w-xs truncate text-sm py-2">{ticket.title}</TableCell>
                  <TableCell className="text-sm py-2">{ticket.customer_name}</TableCell>
                  <TableCell className="py-2">
                    <Badge className={`${getPriorityColor(ticket.priority)} text-[10px] px-1.5 py-0`}>{ticket.priority}</Badge>
                  </TableCell>
                  <TableCell className="py-2">
                    <Badge className={`${getStatusColor(ticket.status)} text-[10px] px-1.5 py-0`}>{ticket.status}</Badge>
                  </TableCell>
                  <TableCell className="py-2">
                    {ticket.assigned_to ? (
                      <div className="flex items-center gap-1.5">
                        <Avatar className="h-5 w-5">
                          <AvatarFallback className="text-[10px]">{ticket.profiles?.full_name?.split(' ').map(n => n[0]).join('') || 'NA'}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs">{ticket.profiles?.full_name || 'Unknown'}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">Unassigned</span>
                    )}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground py-2">{formatDistanceToNow(new Date(ticket.created_at), { addSuffix: true })}</TableCell>
                  <TableCell className="text-right py-2" onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onViewTicket(ticket.id)}>
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};
