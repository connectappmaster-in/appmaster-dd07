import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface LeadStatusSelectorProps {
  currentStatus: string;
  onStatusChange: (status: string) => void;
}

const LeadStatusSelector = ({ currentStatus, onStatusChange }: LeadStatusSelectorProps) => {
  const getStatusColor = (status: string) => {
    const colors: any = {
      new: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      contacted: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      qualified: 'bg-green-500/10 text-green-500 border-green-500/20',
      unqualified: 'bg-red-500/10 text-red-500 border-red-500/20',
    };
    return colors[status] || 'bg-muted text-muted-foreground';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Current Status</span>
          <Badge className={getStatusColor(currentStatus)}>
            {currentStatus}
          </Badge>
        </div>
        
        <Select value={currentStatus} onValueChange={onStatusChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="contacted">Contacted</SelectItem>
            <SelectItem value="qualified">Qualified</SelectItem>
            <SelectItem value="unqualified">Unqualified</SelectItem>
          </SelectContent>
        </Select>

        <div className="pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Status changes are tracked in the activity timeline
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LeadStatusSelector;
