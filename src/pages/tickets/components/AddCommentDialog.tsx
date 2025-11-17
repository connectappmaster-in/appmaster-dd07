import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface AddCommentDialogProps {
  ticketId: string | null;
  ticketNumber: string;
  open: boolean;
  onClose: () => void;
  onCommentAdded: () => void;
}

export const AddCommentDialog = ({ ticketId, ticketNumber, open, onClose, onCommentAdded }: AddCommentDialogProps) => {
  const [comment, setComment] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketId || !comment.trim()) return;

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("ticket_comments")
        .insert({
          ticket_id: ticketId,
          author_id: user.id,
          comment_text: comment,
          is_public: isPublic,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Comment added successfully",
      });

      setComment("");
      onCommentAdded();
      onClose();
    } catch (error: any) {
      toast({
        title: "Error adding comment",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Comment</DialogTitle>
          <DialogDescription>
            Add a comment to ticket {ticketNumber}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="comment">Comment</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={6}
              placeholder="Write your comment here..."
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isPublic"
              checked={isPublic}
              onCheckedChange={setIsPublic}
            />
            <Label htmlFor="isPublic" className="cursor-pointer">
              Public comment (visible to customer)
            </Label>
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !comment.trim()}>
              {loading ? "Adding..." : "Add Comment"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
