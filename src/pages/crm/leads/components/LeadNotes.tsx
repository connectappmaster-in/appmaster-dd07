import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Edit2, Save, X } from 'lucide-react';

interface LeadNotesProps {
  notes: string;
  onUpdate: (notes: string) => void;
}

const LeadNotes = ({ notes, onUpdate }: LeadNotesProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedNotes, setEditedNotes] = useState(notes);

  const handleSave = () => {
    onUpdate(editedNotes);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedNotes(notes);
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Notes</CardTitle>
          {!isEditing && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="gap-2"
            >
              <Edit2 className="h-4 w-4" />
              Edit
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <Textarea
              value={editedNotes}
              onChange={(e) => setEditedNotes(e.target.value)}
              placeholder="Add notes about this lead..."
              rows={6}
              className="resize-none"
            />
            <div className="flex gap-2">
              <Button onClick={handleSave} className="gap-2">
                <Save className="h-4 w-4" />
                Save
              </Button>
              <Button variant="outline" onClick={handleCancel} className="gap-2">
                <X className="h-4 w-4" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="min-h-[100px]">
            {notes ? (
              <p className="text-sm text-foreground whitespace-pre-wrap">{notes}</p>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                No notes yet. Click Edit to add notes.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LeadNotes;
