import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, Building2, Globe, MapPin } from 'lucide-react';
import { format } from 'date-fns';

interface CustomerInfoSectionProps {
  customer: any;
  onUpdate: () => void;
}

const CustomerInfoSection = ({ customer }: CustomerInfoSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Email */}
          {customer.email && (
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <a
                  href={`mailto:${customer.email}`}
                  className="font-medium text-primary hover:underline"
                >
                  {customer.email}
                </a>
              </div>
            </div>
          )}

          {/* Phone */}
          {customer.phone && (
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <a
                  href={`tel:${customer.phone}`}
                  className="font-medium text-primary hover:underline"
                >
                  {customer.phone}
                </a>
              </div>
            </div>
          )}

          {/* Company */}
          {customer.company && (
            <div className="flex items-start gap-3">
              <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Company</p>
                <p className="font-medium">{customer.company}</p>
              </div>
            </div>
          )}

          {/* Website */}
          {customer.website && (
            <div className="flex items-start gap-3">
              <Globe className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Website</p>
                <a
                  href={customer.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary hover:underline"
                >
                  {customer.website}
                </a>
              </div>
            </div>
          )}

          {/* Location */}
          {(customer.city || customer.country) && (
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="font-medium">
                  {[customer.city, customer.country].filter(Boolean).join(', ')}
                </p>
              </div>
            </div>
          )}

          {/* Industry */}
          {customer.industry && (
            <div className="flex items-start gap-3">
              <div className="h-5 w-5 mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Industry</p>
                <p className="font-medium">{customer.industry}</p>
              </div>
            </div>
          )}
        </div>

        {/* Created Date */}
        <div className="pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Customer since {format(new Date(customer.created_at), 'MMM dd, yyyy')} • 
            Last updated {format(new Date(customer.updated_at), 'MMM dd, yyyy')}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerInfoSection;
