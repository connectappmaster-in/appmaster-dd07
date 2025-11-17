import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { TicketStats } from "./components/TicketStats";
import { TicketFilters } from "./components/TicketFilters";
import { TicketList } from "./components/TicketList";
import { CreateTicketDialog } from "./components/CreateTicketDialog";
import { TicketDetailsDrawer } from "./components/TicketDetailsDrawer";
import { BulkActionsBar } from "./components/BulkActionsBar";
const Tickets = () => {
  const [tickets, setTickets] = useState<any[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Stats
  const [stats, setStats] = useState({
    totalOpen: 0,
    overdue: 0,
    resolved: 0,
    avgResponseTime: "N/A"
  });
  const fetchTickets = async () => {
    try {
      setLoading(true);

      // First check if user is authenticated
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to view tickets",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      // Fetch tickets
      const {
        data: ticketsData,
        error: ticketsError
      } = await supabase.from('tickets').select('*').order('created_at', {
        ascending: false
      });
      if (ticketsError) throw ticketsError;

      // Fetch profiles for assigned users
      const assignedUserIds = ticketsData?.filter(t => t.assigned_to).map(t => t.assigned_to) || [];
      let profilesMap: Record<string, any> = {};
      if (assignedUserIds.length > 0) {
        const {
          data: profilesData
        } = await supabase.from('profiles').select('id, full_name').in('id', assignedUserIds);
        if (profilesData) {
          profilesMap = profilesData.reduce((acc, profile) => {
            acc[profile.id] = profile;
            return acc;
          }, {} as Record<string, any>);
        }
      }

      // Merge profiles into tickets
      const enrichedTickets = ticketsData?.map(ticket => ({
        ...ticket,
        profiles: ticket.assigned_to ? profilesMap[ticket.assigned_to] : null
      })) || [];
      setTickets(enrichedTickets);
      calculateStats(enrichedTickets);
    } catch (error: any) {
      toast({
        title: "Error fetching tickets",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const calculateStats = (ticketData: any[]) => {
    const now = new Date();
    const totalOpen = ticketData.filter(t => t.status === 'Open' || t.status === 'In Progress').length;
    const overdue = ticketData.filter(t => t.due_date && new Date(t.due_date) < now && t.status !== 'Closed').length;
    const resolved = ticketData.filter(t => t.status === 'Resolved' || t.status === 'Closed').length;
    setStats({
      totalOpen,
      overdue,
      resolved,
      avgResponseTime: "2.5h" // Placeholder - would need comment data to calculate
    });
  };
  useEffect(() => {
    fetchTickets();

    // Subscribe to real-time updates
    const channel = supabase.channel('tickets-changes').on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'tickets'
    }, () => {
      fetchTickets();
    }).subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  useEffect(() => {
    let filtered = [...tickets];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(ticket => ticket.ticket_number.toLowerCase().includes(searchQuery.toLowerCase()) || ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) || ticket.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) || ticket.customer_email.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(ticket => ticket.status === statusFilter);
    }

    // Apply priority filter
    if (priorityFilter !== "all") {
      filtered = filtered.filter(ticket => ticket.priority === priorityFilter);
    }
    setFilteredTickets(filtered);
  }, [tickets, searchQuery, statusFilter, priorityFilter]);
  const handleViewTicket = (ticketId: string) => {
    const ticket = filteredTickets.find(t => t.id === ticketId);
    if (ticket) {
      setSelectedTicket(ticket);
      setDrawerOpen(true);
    }
  };
  const handleSelectTicket = (ticketId: string) => {
    setSelectedTickets(prev => prev.includes(ticketId) ? prev.filter(id => id !== ticketId) : [...prev, ticketId]);
  };
  const handleSelectAll = (checked: boolean) => {
    setSelectedTickets(checked ? filteredTickets.map(t => t.id) : []);
  };
  const handleBulkAssign = () => {
    toast({
      title: "Bulk Assign",
      description: `Assign ${selectedTickets.length} tickets`
    });
  };
  const handleBulkStatusChange = () => {
    toast({
      title: "Bulk Status Change",
      description: `Change status for ${selectedTickets.length} tickets`
    });
  };
  const handleBulkDelete = () => {
    toast({
      title: "Bulk Delete",
      description: `Delete ${selectedTickets.length} tickets`,
      variant: "destructive"
    });
  };
  return <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-16 pb-8">
        <div className="max-w-full mx-auto space-y-3">
          {/* Compact Header */}
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-foreground">Ticket Management</h1>
            <CreateTicketDialog onTicketCreated={fetchTickets} />
          </div>

          {/* Compact Stats */}
          <TicketStats totalOpen={stats.totalOpen} overdue={stats.overdue} resolved={stats.resolved} avgResponseTime={stats.avgResponseTime} />

          {/* Main Content Card */}
          <div className="bg-card rounded-lg border border-border/50 shadow-sm overflow-hidden">
            <div className="border-b border-border/50 px-3 py-2">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-semibold">All Tickets</h2>
              </div>
              
              <TicketFilters searchQuery={searchQuery} onSearchChange={setSearchQuery} statusFilter={statusFilter} onStatusChange={setStatusFilter} priorityFilter={priorityFilter} onPriorityChange={setPriorityFilter} />
            </div>

            <div className="p-0">
              {loading ? <div className="flex items-center justify-center h-40 text-sm text-muted-foreground">
                  Loading tickets...
                </div> : <TicketList tickets={filteredTickets} selectedTickets={selectedTickets} onSelectTicket={handleSelectTicket} onSelectAll={handleSelectAll} onViewTicket={handleViewTicket} />}
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      <BulkActionsBar selectedCount={selectedTickets.length} onClearSelection={() => setSelectedTickets([])} onBulkAssign={handleBulkAssign} onBulkStatusChange={handleBulkStatusChange} onBulkDelete={handleBulkDelete} />

      {/* Details Drawer */}
      <TicketDetailsDrawer 
        ticket={selectedTicket} 
        open={drawerOpen} 
        onClose={() => setDrawerOpen(false)}
        onTicketUpdated={fetchTickets}
      />
    </div>;
};
export default Tickets;