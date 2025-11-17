import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Lead {
  id: string;
  title: string;
  company: string | null;
  email: string | null;
  phone: string | null;
  source: string | null;
  status: string;
  score: number | null;
  assigned_to: string | null;
  notes: string | null;
  value: number | null;
  probability: number | null;
  expected_close_date: string | null;
  currency: string | null;
  tags: any;
  created_by: string;
  created_at: string;
  updated_at: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  city: string;
  country: string;
  website: string;
  industry: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

interface Opportunity {
  id: string;
  name: string;
  customer_id: string;
  amount: number;
  probability: number;
  stage: string;
  close_date: string;
  owner_id: string;
  lead_id?: string;
  created_at: string;
  updated_at: string;
}

interface Quote {
  id: string;
  quote_number: string;
  customer_id: string;
  opportunity_id?: string;
  amount: number;
  tax_amount: number;
  status: string;
  valid_until: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

interface Activity {
  id: string;
  related_table: string;
  related_id: string;
  activity_type: string;
  title: string;
  description?: string;
  user_id: string;
  created_at: string;
}

interface CRMStore {
  leads: Lead[];
  customers: Customer[];
  opportunities: Opportunity[];
  quotes: Quote[];
  activities: Activity[];
  loading: boolean;
  
  // Leads
  fetchLeads: (filters?: any) => Promise<void>;
  createLead: (data: Partial<Lead>) => Promise<Lead | null>;
  updateLead: (id: string, data: Partial<Lead>) => Promise<void>;
  deleteLead: (id: string) => Promise<void>;
  
  // Customers
  fetchCustomers: (filters?: any) => Promise<void>;
  createCustomer: (data: Partial<Customer>) => Promise<Customer | null>;
  updateCustomer: (id: string, data: Partial<Customer>) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;
  
  // Opportunities
  fetchOpportunities: (filters?: any) => Promise<void>;
  createOpportunity: (data: Partial<Opportunity>) => Promise<Opportunity | null>;
  updateOpportunity: (id: string, data: Partial<Opportunity>) => Promise<void>;
  deleteOpportunity: (id: string) => Promise<void>;
  
  // Quotes
  fetchQuotes: (filters?: any) => Promise<void>;
  createQuote: (data: Partial<Quote>) => Promise<Quote | null>;
  updateQuote: (id: string, data: Partial<Quote>) => Promise<void>;
  deleteQuote: (id: string) => Promise<void>;
  
  // Activities
  fetchActivities: (relatedTable: string, relatedId: string) => Promise<void>;
  createActivity: (data: Partial<Activity>) => Promise<void>;
  
  // Realtime subscriptions
  subscribeToLeads: () => () => void;
  subscribeToCustomers: () => () => void;
  subscribeToOpportunities: () => () => void;
  subscribeToQuotes: () => () => void;
}

export const useCRMStore = create<CRMStore>((set, get) => ({
  leads: [],
  customers: [],
  opportunities: [],
  quotes: [],
  activities: [],
  loading: false,

  // Leads
  fetchLeads: async (filters: { status?: string; owner?: string; search?: string } = {}) => {
    set({ loading: true });
    try {
      let query = supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.owner) {
        query = query.eq('assigned_to', filters.owner);
      }
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,company.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      set({ leads: data || [] });
    } catch (error: any) {
      toast.error('Failed to fetch leads: ' + error.message);
    } finally {
      set({ loading: false });
    }
  },

  createLead: async (data) => {
    try {
      const { data: newLead, error } = await supabase
        .from('leads')
        .insert([{ ...data, created_by: (await supabase.auth.getUser()).data.user?.id }] as any)
        .select()
        .single();

      if (error) throw error;

      // Create activity
      await get().createActivity({
        related_table: 'leads',
        related_id: newLead.id,
        activity_type: 'created',
        title: 'Lead Created',
        description: `Lead "${data.title}" was created`
      });

      set((state) => ({ leads: [newLead, ...state.leads] }));
      toast.success('Lead created successfully');
      return newLead;
    } catch (error: any) {
      toast.error('Failed to create lead: ' + error.message);
      return null;
    }
  },

  updateLead: async (id, data) => {
    try {
      const { error } = await supabase
        .from('leads')
        .update(data)
        .eq('id', id);

      if (error) throw error;

      set((state) => ({
        leads: state.leads.map((lead) =>
          lead.id === id ? { ...lead, ...data } : lead
        )
      }));
      toast.success('Lead updated successfully');
    } catch (error: any) {
      toast.error('Failed to update lead: ' + error.message);
    }
  },

  deleteLead: async (id) => {
    try {
      const { error } = await supabase.from('leads').delete().eq('id', id);
      if (error) throw error;

      set((state) => ({
        leads: state.leads.filter((lead) => lead.id !== id)
      }));
      toast.success('Lead deleted successfully');
    } catch (error: any) {
      toast.error('Failed to delete lead: ' + error.message);
    }
  },

  // Customers
  fetchCustomers: async (filters: { industry?: string; owner?: string; search?: string } = {}) => {
    set({ loading: true });
    try {
      let query = supabase
        .from('crm_customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters.industry) {
        query = query.eq('industry', filters.industry);
      }
      if (filters.owner) {
        query = query.eq('owner_id', filters.owner);
      }
      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,company.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      set({ customers: data || [] });
    } catch (error: any) {
      toast.error('Failed to fetch customers: ' + error.message);
    } finally {
      set({ loading: false });
    }
  },

  createCustomer: async (data) => {
    try {
      const { data: newCustomer, error } = await supabase
        .from('crm_customers')
        .insert([data] as any)
        .select()
        .single();

      if (error) throw error;

      await get().createActivity({
        related_table: 'customers',
        related_id: newCustomer.id,
        activity_type: 'created',
        title: 'Customer Created',
        description: `Customer "${data.name}" was created`
      });

      set((state) => ({ customers: [newCustomer, ...state.customers] }));
      toast.success('Customer created successfully');
      return newCustomer;
    } catch (error: any) {
      toast.error('Failed to create customer: ' + error.message);
      return null;
    }
  },

  updateCustomer: async (id, data) => {
    try {
      const { error } = await supabase
        .from('crm_customers')
        .update(data)
        .eq('id', id);

      if (error) throw error;

      set((state) => ({
        customers: state.customers.map((customer) =>
          customer.id === id ? { ...customer, ...data } : customer
        )
      }));
      toast.success('Customer updated successfully');
    } catch (error: any) {
      toast.error('Failed to update customer: ' + error.message);
    }
  },

  deleteCustomer: async (id) => {
    try {
      const { error } = await supabase.from('crm_customers').delete().eq('id', id);
      if (error) throw error;

      set((state) => ({
        customers: state.customers.filter((customer) => customer.id !== id)
      }));
      toast.success('Customer deleted successfully');
    } catch (error: any) {
      toast.error('Failed to delete customer: ' + error.message);
    }
  },

  // Opportunities
  fetchOpportunities: async (filters: { stage?: string; owner?: string } = {}) => {
    set({ loading: true });
    try {
      let query = supabase
        .from('crm_opportunities')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters.stage) {
        query = query.eq('stage', filters.stage);
      }
      if (filters.owner) {
        query = query.eq('owner_id', filters.owner);
      }

      const { data, error } = await query;
      if (error) throw error;
      set({ opportunities: data || [] });
    } catch (error: any) {
      toast.error('Failed to fetch opportunities: ' + error.message);
    } finally {
      set({ loading: false });
    }
  },

  createOpportunity: async (data) => {
    try {
      const { data: newOpp, error } = await supabase
        .from('crm_opportunities')
        .insert([data] as any)
        .select()
        .single();

      if (error) throw error;

      await get().createActivity({
        related_table: 'opportunities',
        related_id: newOpp.id,
        activity_type: 'created',
        title: 'Opportunity Created',
        description: `Opportunity "${data.name}" was created`
      });

      set((state) => ({ opportunities: [newOpp, ...state.opportunities] }));
      toast.success('Opportunity created successfully');
      return newOpp;
    } catch (error: any) {
      toast.error('Failed to create opportunity: ' + error.message);
      return null;
    }
  },

  updateOpportunity: async (id, data) => {
    try {
      const { error } = await supabase
        .from('crm_opportunities')
        .update(data)
        .eq('id', id);

      if (error) throw error;

      set((state) => ({
        opportunities: state.opportunities.map((opp) =>
          opp.id === id ? { ...opp, ...data } : opp
        )
      }));
      toast.success('Opportunity updated successfully');
    } catch (error: any) {
      toast.error('Failed to update opportunity: ' + error.message);
    }
  },

  deleteOpportunity: async (id) => {
    try {
      const { error } = await supabase.from('crm_opportunities').delete().eq('id', id);
      if (error) throw error;

      set((state) => ({
        opportunities: state.opportunities.filter((opp) => opp.id !== id)
      }));
      toast.success('Opportunity deleted successfully');
    } catch (error: any) {
      toast.error('Failed to delete opportunity: ' + error.message);
    }
  },

  // Quotes
  fetchQuotes: async (filters: { status?: string } = {}) => {
    set({ loading: true });
    try {
      let query = supabase
        .from('crm_quotes')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters.status) {
        query = query.eq('status', filters.status);
      }

      const { data, error } = await query;
      if (error) throw error;
      set({ quotes: data || [] });
    } catch (error: any) {
      toast.error('Failed to fetch quotes: ' + error.message);
    } finally {
      set({ loading: false });
    }
  },

  createQuote: async (data) => {
    try {
      const { data: newQuote, error } = await supabase
        .from('crm_quotes')
        .insert([data] as any)
        .select()
        .single();

      if (error) throw error;

      await get().createActivity({
        related_table: 'quotes',
        related_id: newQuote.id,
        activity_type: 'created',
        title: 'Quote Created',
        description: `Quote "${data.quote_number}" was created`
      });

      set((state) => ({ quotes: [newQuote, ...state.quotes] }));
      toast.success('Quote created successfully');
      return newQuote;
    } catch (error: any) {
      toast.error('Failed to create quote: ' + error.message);
      return null;
    }
  },

  updateQuote: async (id, data) => {
    try {
      const { error } = await supabase
        .from('crm_quotes')
        .update(data)
        .eq('id', id);

      if (error) throw error;

      set((state) => ({
        quotes: state.quotes.map((quote) =>
          quote.id === id ? { ...quote, ...data } : quote
        )
      }));
      toast.success('Quote updated successfully');
    } catch (error: any) {
      toast.error('Failed to update quote: ' + error.message);
    }
  },

  deleteQuote: async (id) => {
    try {
      const { error } = await supabase.from('crm_quotes').delete().eq('id', id);
      if (error) throw error;

      set((state) => ({
        quotes: state.quotes.filter((quote) => quote.id !== id)
      }));
      toast.success('Quote deleted successfully');
    } catch (error: any) {
      toast.error('Failed to delete quote: ' + error.message);
    }
  },

  // Activities
  fetchActivities: async (relatedTable, relatedId) => {
    try {
      const { data, error } = await supabase
        .from('crm_activities')
        .select('*')
        .eq('related_table', relatedTable)
        .eq('related_id', relatedId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ activities: data || [] });
    } catch (error: any) {
      toast.error('Failed to fetch activities: ' + error.message);
    }
  },

  createActivity: async (data) => {
    try {
      const { error } = await supabase
        .from('crm_activities')
        .insert([data] as any);

      if (error) throw error;
    } catch (error: any) {
      console.error('Failed to create activity:', error.message);
    }
  },

  // Realtime subscriptions
  subscribeToLeads: () => {
    const channel = supabase
      .channel('leads-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          set((state) => ({ leads: [payload.new as Lead, ...state.leads] }));
          toast.success('New lead added');
        } else if (payload.eventType === 'UPDATE') {
          set((state) => ({
            leads: state.leads.map((lead) =>
              lead.id === payload.new.id ? (payload.new as Lead) : lead
            )
          }));
        } else if (payload.eventType === 'DELETE') {
          set((state) => ({
            leads: state.leads.filter((lead) => lead.id !== payload.old.id)
          }));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  subscribeToCustomers: () => {
    const channel = supabase
      .channel('customers-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'crm_customers' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          set((state) => ({ customers: [payload.new as Customer, ...state.customers] }));
          toast.success('New customer added');
        } else if (payload.eventType === 'UPDATE') {
          set((state) => ({
            customers: state.customers.map((customer) =>
              customer.id === payload.new.id ? (payload.new as Customer) : customer
            )
          }));
        } else if (payload.eventType === 'DELETE') {
          set((state) => ({
            customers: state.customers.filter((customer) => customer.id !== payload.old.id)
          }));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  subscribeToOpportunities: () => {
    const channel = supabase
      .channel('opportunities-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'crm_opportunities' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          set((state) => ({ opportunities: [payload.new as Opportunity, ...state.opportunities] }));
          toast.success('New opportunity added');
        } else if (payload.eventType === 'UPDATE') {
          set((state) => ({
            opportunities: state.opportunities.map((opp) =>
              opp.id === payload.new.id ? (payload.new as Opportunity) : opp
            )
          }));
        } else if (payload.eventType === 'DELETE') {
          set((state) => ({
            opportunities: state.opportunities.filter((opp) => opp.id !== payload.old.id)
          }));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  subscribeToQuotes: () => {
    const channel = supabase
      .channel('quotes-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'crm_quotes' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          set((state) => ({ quotes: [payload.new as Quote, ...state.quotes] }));
          toast.success('New quote added');
        } else if (payload.eventType === 'UPDATE') {
          set((state) => ({
            quotes: state.quotes.map((quote) =>
              quote.id === payload.new.id ? (payload.new as Quote) : quote
            )
          }));
          if (payload.new.status === 'accepted') {
            toast.success('Quote accepted!');
          }
        } else if (payload.eventType === 'DELETE') {
          set((state) => ({
            quotes: state.quotes.filter((quote) => quote.id !== payload.old.id)
          }));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }
}));