import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { useCRMStore } from '@/store/crmStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Target, FileText, TrendingUp, Plus } from 'lucide-react';

const CRMDashboard = () => {
  const navigate = useNavigate();
  const { leads, customers, opportunities, quotes, fetchLeads, fetchCustomers, fetchOpportunities, fetchQuotes } = useCRMStore();

  useEffect(() => {
    fetchLeads();
    fetchCustomers();
    fetchOpportunities();
    fetchQuotes();
  }, []);

  const stats = [
    {
      title: 'Leads',
      value: leads.length,
      icon: Users,
      color: 'bg-blue-500',
      path: '/crm/leads',
      description: 'Manage your sales leads'
    },
    {
      title: 'Customers',
      value: customers.length,
      icon: Users,
      color: 'bg-green-500',
      path: '/crm/customers',
      description: 'Your customer base'
    },
    {
      title: 'Opportunities',
      value: opportunities.length,
      icon: Target,
      color: 'bg-purple-500',
      path: '/crm/opportunities',
      description: 'Active sales pipeline'
    },
    {
      title: 'Quotes',
      value: quotes.length,
      icon: FileText,
      color: 'bg-orange-500',
      path: '/crm/quotes',
      description: 'Proposals & quotes'
    },
  ];

  const hotLeads = leads.filter(l => (l.score || 0) >= 70);
  const pipelineValue = opportunities.reduce((sum, opp) => sum + (opp.amount || 0), 0);
  const acceptedQuotes = quotes.filter(q => q.status === 'accepted');

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground">CRM Dashboard</h1>
              <p className="text-lg text-muted-foreground mt-2">
                Customer Relationship Management
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <Card 
                key={stat.title}
                className="cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1"
                onClick={() => navigate(stat.path)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 ${stat.color} rounded-lg`}>
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                      <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">{stat.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🔥 Hot Leads
                </CardTitle>
                <CardDescription>Leads with score &gt;= 70</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-red-500">{hotLeads.length}</span>
                  <Button onClick={() => navigate('/crm/leads')} variant="outline" size="sm">
                    View All
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" /> Pipeline Value
                </CardTitle>
                <CardDescription>Total opportunity value</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-green-500">
                    ${pipelineValue.toLocaleString()}
                  </span>
                  <Button onClick={() => navigate('/crm/opportunities')} variant="outline" size="sm">
                    View Pipeline
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" /> Accepted Quotes
                </CardTitle>
                <CardDescription>Quotes accepted this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-blue-500">{acceptedQuotes.length}</span>
                  <Button onClick={() => navigate('/crm/quotes')} variant="outline" size="sm">
                    View Quotes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Create new CRM records</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button onClick={() => navigate('/crm/leads/new')} className="gap-2" variant="outline">
                  <Plus className="h-4 w-4" />
                  Add Lead
                </Button>
                <Button onClick={() => navigate('/crm/customers/new')} className="gap-2" variant="outline">
                  <Plus className="h-4 w-4" />
                  Add Customer
                </Button>
                <Button onClick={() => navigate('/crm/opportunities/new')} className="gap-2" variant="outline">
                  <Plus className="h-4 w-4" />
                  Create Opportunity
                </Button>
                <Button onClick={() => navigate('/crm/quotes/new')} className="gap-2" variant="outline">
                  <Plus className="h-4 w-4" />
                  Create Quote
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Module Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/crm/leads')}>
              <CardHeader>
                <CardTitle>Lead Management</CardTitle>
                <CardDescription>Track and nurture your sales leads with scoring</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>✓ Lead scoring and qualification</li>
                  <li>✓ Activity tracking and notes</li>
                  <li>✓ Convert to customers</li>
                  <li>✓ Real-time updates</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/crm/opportunities')}>
              <CardHeader>
                <CardTitle>Sales Pipeline</CardTitle>
                <CardDescription>Visual kanban board for managing deals</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>✓ Drag-and-drop stage management</li>
                  <li>✓ Probability tracking</li>
                  <li>✓ Revenue forecasting</li>
                  <li>✓ Win/loss analysis</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CRMDashboard;