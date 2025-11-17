import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, Calendar, DollarSign, Target, Tag } from 'lucide-react';
import { format } from 'date-fns';

interface LeadInfoSectionProps {
  lead: any;
  onUpdate: () => void;
}

const LeadInfoSection = ({ lead }: LeadInfoSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Lead Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Email */}
          {lead.email && (
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{lead.email}</p>
              </div>
            </div>
          )}

          {/* Phone */}
          {lead.phone && (
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{lead.phone}</p>
              </div>
            </div>
          )}

          {/* Source */}
          {lead.source && (
            <div className="flex items-start gap-3">
              <Tag className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Source</p>
                <Badge variant="secondary">{lead.source}</Badge>
              </div>
            </div>
          )}

          {/* Expected Close Date */}
          {lead.expected_close_date && (
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Expected Close Date</p>
                <p className="font-medium">
                  {format(new Date(lead.expected_close_date), 'MMM dd, yyyy')}
                </p>
              </div>
            </div>
          )}

          {/* Value */}
          {lead.value && (
            <div className="flex items-start gap-3">
              <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Estimated Value</p>
                <p className="font-medium">
                  {lead.currency || '$'} {lead.value.toLocaleString()}
                </p>
              </div>
            </div>
          )}

          {/* Probability */}
          {lead.probability !== null && lead.probability !== undefined && (
            <div className="flex items-start gap-3">
              <Target className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Probability</p>
                <p className="font-medium">{lead.probability}%</p>
              </div>
            </div>
          )}
        </div>

        {/* Tags */}
        {lead.tags && Array.isArray(lead.tags) && lead.tags.length > 0 && (
          <div className="pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground mb-2">Tags</p>
            <div className="flex flex-wrap gap-2">
              {lead.tags.map((tag: string, index: number) => (
                <Badge key={index} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Created Date */}
        <div className="pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Created on {format(new Date(lead.created_at), 'MMM dd, yyyy')} • 
            Last updated {format(new Date(lead.updated_at), 'MMM dd, yyyy')}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LeadInfoSection;
