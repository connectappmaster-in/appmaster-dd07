import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCRMStore } from '@/store/crmStore';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Plus, Phone, Mail, Calendar, MessageSquare, CheckCircle } from 'lucide-react';

interface ActivityTimelineProps {
  activities: any[];
  leadId: string;
  onActivityAdded: () => void;
}

const ActivityTimeline = ({ activities, leadId, onActivityAdded }: ActivityTimelineProps) => {
  const { createActivity, fetchActivities } = useCRMStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [activityType, setActivityType] = useState('note');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleAddActivity = async () => {
    if (!description.trim()) {
      toast.error('Please enter activity details');
      return;
    }

    setSubmitting(true);
    try {
      await createActivity({
        related_table: 'leads',
        related_id: leadId,
        activity_type: activityType,
        title: getTitleForActivityType(activityType),
        description: description.trim(),
      });
      
      toast.success('Activity added successfully');
      setDescription('');
      setShowAddForm(false);
      await fetchActivities('leads', leadId);
      onActivityAdded();
    } catch (error) {
      toast.error('Failed to add activity');
      console.error('Error adding activity:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const getTitleForActivityType = (type: string) => {
    const titles: any = {
      call: 'Phone Call',
      email: 'Email Sent',
      meeting: 'Meeting Scheduled',
      note: 'Note Added',
      task: 'Task Completed',
    };
    return titles[type] || 'Activity';
  };

  const getIconForActivityType = (type: string) => {
    const icons: any = {
      call: Phone,
      email: Mail,
      meeting: Calendar,
      note: MessageSquare,
      task: CheckCircle,
    };
    const Icon = icons[type] || MessageSquare;
    return <Icon className="h-4 w-4" />;
  };

  return (
    <div className="space-y-4">
      {/* Add Activity Button */}
      {!showAddForm && (
        <Button
          variant="outline"
          onClick={() => setShowAddForm(true)}
          className="w-full gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Activity
        </Button>
      )}

      {/* Add Activity Form */}
      {showAddForm && (
        <div className="p-4 border border-border rounded-lg space-y-3 bg-card">
          <Select value={activityType} onValueChange={setActivityType}>
            <SelectTrigger>
              <SelectValue placeholder="Select activity type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="call">Phone Call</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="meeting">Meeting</SelectItem>
              <SelectItem value="note">Note</SelectItem>
              <SelectItem value="task">Task</SelectItem>
            </SelectContent>
          </Select>

          <Textarea
            placeholder="Enter activity details..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />

          <div className="flex gap-2">
            <Button
              onClick={handleAddActivity}
              disabled={submitting}
              className="flex-1"
            >
              {submitting ? 'Adding...' : 'Add Activity'}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setShowAddForm(false);
                setDescription('');
              }}
              disabled={submitting}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="space-y-4">
        {activities.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No activities yet. Add your first activity to track interactions.
          </div>
        ) : (
          activities.map((activity, index) => (
            <div key={activity.id} className="flex gap-4">
              {/* Timeline Line */}
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center text-primary">
                  {getIconForActivityType(activity.activity_type)}
                </div>
                {index < activities.length - 1 && (
                  <div className="w-0.5 h-full bg-border mt-2" />
                )}
              </div>

              {/* Activity Content */}
              <div className="flex-1 pb-6">
                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-foreground">{activity.title}</h4>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(activity.created_at), 'MMM dd, yyyy HH:mm')}
                    </span>
                  </div>
                  {activity.description && (
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ActivityTimeline;
