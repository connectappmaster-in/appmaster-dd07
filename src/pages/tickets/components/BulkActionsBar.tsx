import { Button } from "@/components/ui/button";
import { X, Trash2, UserPlus, Tag } from "lucide-react";

interface BulkActionsBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onBulkAssign: () => void;
  onBulkStatusChange: () => void;
  onBulkDelete: () => void;
}

export const BulkActionsBar = ({
  selectedCount,
  onClearSelection,
  onBulkAssign,
  onBulkStatusChange,
  onBulkDelete,
}: BulkActionsBarProps) => {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
      <div className="bg-card border shadow-lg rounded-lg px-4 py-3 flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm font-medium">
          <span className="bg-primary text-primary-foreground rounded-full h-6 w-6 flex items-center justify-center text-xs">
            {selectedCount}
          </span>
          <span>selected</span>
        </div>
        
        <div className="h-6 w-px bg-border" />
        
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={onBulkAssign}>
            <UserPlus className="h-4 w-4 mr-1" />
            Assign
          </Button>
          <Button variant="ghost" size="sm" onClick={onBulkStatusChange}>
            <Tag className="h-4 w-4 mr-1" />
            Status
          </Button>
          <Button variant="ghost" size="sm" onClick={onBulkDelete} className="text-destructive hover:text-destructive">
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
        
        <div className="h-6 w-px bg-border" />
        
        <Button variant="ghost" size="icon" onClick={onClearSelection} className="h-8 w-8">
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
