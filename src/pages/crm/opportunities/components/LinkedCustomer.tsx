import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Mail, Phone, Globe, ExternalLink } from 'lucide-react';

interface LinkedCustomerProps {
  customer: any;
}

const LinkedCustomer = ({ customer }: LinkedCustomerProps) => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Linked Customer</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/crm/customers/${customer.id}`)}
            className="gap-2"
          >
            View Details
            <ExternalLink className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-3">
          <Building2 className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="font-semibold">{customer.name}</p>
            {customer.company && (
              <p className="text-sm text-muted-foreground">{customer.company}</p>
            )}
          </div>
        </div>

        {customer.email && (
          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <a
              href={`mailto:${customer.email}`}
              className="text-sm text-primary hover:underline"
            >
              {customer.email}
            </a>
          </div>
        )}

        {customer.phone && (
          <div className="flex items-center gap-3">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <a
              href={`tel:${customer.phone}`}
              className="text-sm text-primary hover:underline"
            >
              {customer.phone}
            </a>
          </div>
        )}

        {customer.website && (
          <div className="flex items-center gap-3">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <a
              href={customer.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline"
            >
              {customer.website}
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LinkedCustomer;
