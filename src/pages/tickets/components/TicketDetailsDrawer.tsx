import { useState } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDistanceToNow, format } from "date-fns";
import { X, Clock, User, Calendar, Tag, AlertCircle } from "lucide-react";
import { EditTicketDialog } from "./EditTicketDialog";
import { AddCommentDialog } from "./AddCommentDialog";

interface Ticket {
  id: string;
  ticket_number: string;
  title: string;
  customer_name: string;
  customer_email: string;
  priority: string;
  status: string;
  created_at: string;
  updated_at: string;
  description: string;
  assigned_to?: string;
  due_date?: string;
  profiles?: {
    full_name: string;
  };
}

interface TicketDetailsDrawerProps {
  ticket: Ticket | null;
  open: boolean;
  onClose: () => void;
  onTicketUpdated: () => void;
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

export const TicketDetailsDrawer = ({ ticket, open, onClose, onTicketUpdated }: TicketDetailsDrawerProps) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);

  if (!ticket) return null;

  return (
    <Drawer open={open} onOpenChange={onClose}>
      <DrawerContent className="h-[90vh] max-w-2xl ml-auto">
        <DrawerHeader className="border-b px-6 py-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <DrawerTitle className="text-xl">{ticket.title}</DrawerTitle>
              </div>
              <DrawerDescription className="text-xs font-mono">
                {ticket.ticket_number}
              </DrawerDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="shrink-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex gap-2 mt-3">
            <Badge className={getPriorityColor(ticket.priority)}>
              {ticket.priority}
            </Badge>
            <Badge className={getStatusColor(ticket.status)}>
              {ticket.status}
            </Badge>
          </div>
        </DrawerHeader>

        <ScrollArea className="flex-1 px-6 py-4">
          <div className="space-y-6">
            {/* Customer Info */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <User className="h-4 w-4" />
                Customer Information
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name:</span>
                  <span className="font-medium">{ticket.customer_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="font-medium">{ticket.customer_email}</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Assignment Info */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Assignment
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Assigned To:</span>
                  {ticket.assigned_to ? (
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          {ticket.profiles?.full_name?.split(' ').map(n => n[0]).join('') || 'NA'}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{ticket.profiles?.full_name || 'Unknown'}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground italic">Unassigned</span>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* Timeline Info */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Timeline
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created:</span>
                  <span className="font-medium">
                    {format(new Date(ticket.created_at), 'MMM dd, yyyy HH:mm')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Updated:</span>
                  <span className="font-medium">
                    {formatDistanceToNow(new Date(ticket.updated_at), { addSuffix: true })}
                  </span>
                </div>
                {ticket.due_date && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Due Date:</span>
                    <span className="font-medium flex items-center gap-1">
                      {new Date(ticket.due_date) < new Date() && (
                        <AlertCircle className="h-3 w-3 text-destructive" />
                      )}
                      {format(new Date(ticket.due_date), 'MMM dd, yyyy')}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Description */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Description</h3>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {ticket.description}
              </p>
            </div>
          </div>
        </ScrollArea>

        <div className="border-t px-6 py-4 flex gap-2">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => setEditDialogOpen(true)}
          >
            Edit Ticket
          </Button>
          <Button 
            className="flex-1"
            onClick={() => setCommentDialogOpen(true)}
          >
            Add Comment
          </Button>
        </div>
      </DrawerContent>

      <EditTicketDialog
        ticket={ticket}
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        onTicketUpdated={onTicketUpdated}
      />

      <AddCommentDialog
        ticketId={ticket.id}
        ticketNumber={ticket.ticket_number}
        open={commentDialogOpen}
        onClose={() => setCommentDialogOpen(false)}
        onCommentAdded={onTicketUpdated}
      />
    </Drawer>
  );
};
