import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft, User as UserIcon, Bell, Globe, Palette, Upload, Package } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { User } from "@supabase/supabase-js";

interface Preferences {
  email_notifications: boolean;
  push_notifications: boolean;
  marketing_emails: boolean;
  language: string;
  timezone: string;
  theme: string;
}

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [preferences, setPreferences] = useState<Preferences>({
    email_notifications: true,
    push_notifications: true,
    marketing_emails: false,
    language: "en",
    timezone: "UTC",
    theme: "system",
  });
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/login");
        return;
      }

      setUser(user);
      setEmail(user.email || "");

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, avatar_url")
        .eq("id", user.id)
        .single();

      if (profile) {
        setFullName(profile.full_name || "");
        setAvatarUrl(profile.avatar_url || "");
      }

      // @ts-ignore
      const { data: prefs } = await supabase
        .from("user_preferences")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (prefs) {
        setPreferences({
          // @ts-ignore
          email_notifications: prefs.email_notifications,
          // @ts-ignore
          push_notifications: prefs.push_notifications,
          // @ts-ignore
          marketing_emails: prefs.marketing_emails,
          // @ts-ignore
          language: prefs.language,
          // @ts-ignore
          timezone: prefs.timezone,
          // @ts-ignore
          theme: prefs.theme,
        });
      }

      // @ts-ignore
      const { data: subs } = await supabase
        .from("subscriptions")
        .select(`*,tools:tool_id(display_name,category)`)
        .eq("user_id", user.id);

      if (subs) {
        setSubscriptions(subs);
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ full_name: fullName, avatar_url: avatarUrl })
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0 || !user) return;

      setUploading(true);
      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const filePath = `${user.id}/${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      setAvatarUrl(publicUrl);

      await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", user.id);

      toast({
        title: "Success",
        description: "Avatar uploaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload avatar",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSavePreferences = async () => {
    if (!user) return;

    setSaving(true);
    try {
      // @ts-ignore
      const { error } = await supabase
        .from("user_preferences")
        .upsert({ user_id: user.id, ...preferences });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Settings saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const getInitials = (name: string, email: string) => {
    if (name) return name.substring(0, 2).toUpperCase();
    return email.substring(0, 2).toUpperCase();
  };

  const getStatusBadge = (subscription: any) => {
    const status = subscription.status;
    const trialDaysLeft = subscription.trial_days_remaining;
    
    if (status === "trial" && trialDaysLeft > 0) {
      return `Trial (${trialDaysLeft} days left)`;
    }
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto py-6 px-4">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <div className="space-y-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Settings</h1>
            <p className="text-sm text-muted-foreground">
              Manage your profile, preferences, and subscriptions
            </p>
          </div>

          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="space-y-4 pr-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <UserIcon className="h-4 w-4" />
                    Profile Information
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Manage your personal information and avatar
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={avatarUrl} alt={fullName} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getInitials(fullName, email)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <Label htmlFor="avatar-upload" className="cursor-pointer">
                        <Button type="button" variant="outline" size="sm" disabled={uploading} asChild>
                          <span>
                            {uploading ? <Loader2 className="mr-2 h-3 w-3 animate-spin" /> : <Upload className="mr-2 h-3 w-3" />}
                            Upload Avatar
                          </span>
                        </Button>
                      </Label>
                      <Input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={uploading} />
                    </div>
                  </div>

                  <form onSubmit={handleSaveProfile} className="space-y-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="fullName" className="text-xs">Full Name</Label>
                      <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Enter your full name" className="h-9" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="email" className="text-xs">Email</Label>
                      <Input id="email" type="email" value={email} disabled className="bg-muted h-9" />
                      <p className="text-[10px] text-muted-foreground">Email cannot be changed</p>
                    </div>
                    <Button type="submit" disabled={saving} size="sm" className="w-full">
                      {saving && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
                      Save Profile
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    General Preferences
                  </CardTitle>
                  <CardDescription className="text-xs">Customize your experience</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="language" className="text-xs">Language</Label>
                      <Select value={preferences.language} onValueChange={(value) => setPreferences({ ...preferences, language: value })}>
                        <SelectTrigger id="language" className="h-9"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                          <SelectItem value="de">German</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="timezone" className="text-xs">Timezone</Label>
                      <Select value={preferences.timezone} onValueChange={(value) => setPreferences({ ...preferences, timezone: value })}>
                        <SelectTrigger id="timezone" className="h-9"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="UTC">UTC</SelectItem>
                          <SelectItem value="America/New_York">Eastern Time</SelectItem>
                          <SelectItem value="America/Chicago">Central Time</SelectItem>
                          <SelectItem value="America/Denver">Mountain Time</SelectItem>
                          <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                          <SelectItem value="Europe/London">London</SelectItem>
                          <SelectItem value="Europe/Paris">Paris</SelectItem>
                          <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="theme" className="text-xs flex items-center gap-1.5">
                      <Palette className="h-3 w-3" />
                      Theme
                    </Label>
                    <Select value={preferences.theme} onValueChange={(value) => setPreferences({ ...preferences, theme: value })}>
                      <SelectTrigger id="theme" className="h-9"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    Notification Settings
                  </CardTitle>
                  <CardDescription className="text-xs">Manage how you receive updates</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications" className="text-xs font-medium">Email Notifications</Label>
                      <p className="text-[10px] text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch id="email-notifications" checked={preferences.email_notifications} onCheckedChange={(checked) => setPreferences({ ...preferences, email_notifications: checked })} />
                  </div>
                  <Separator className="my-2" />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="push-notifications" className="text-xs font-medium">Push Notifications</Label>
                      <p className="text-[10px] text-muted-foreground">Receive push notifications in your browser</p>
                    </div>
                    <Switch id="push-notifications" checked={preferences.push_notifications} onCheckedChange={(checked) => setPreferences({ ...preferences, push_notifications: checked })} />
                  </div>
                  <Separator className="my-2" />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="marketing-emails" className="text-xs font-medium">Marketing Emails</Label>
                      <p className="text-[10px] text-muted-foreground">Receive emails about new features and updates</p>
                    </div>
                    <Switch id="marketing-emails" checked={preferences.marketing_emails} onCheckedChange={(checked) => setPreferences({ ...preferences, marketing_emails: checked })} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Active Subscriptions
                  </CardTitle>
                  <CardDescription className="text-xs">View your active tool subscriptions</CardDescription>
                </CardHeader>
                <CardContent>
                  {subscriptions.length === 0 ? (
                    <p className="text-center text-xs text-muted-foreground py-6">No active subscriptions</p>
                  ) : (
                    <div className="space-y-2">
                      {subscriptions.map((sub) => (
                        <div key={sub.id} className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-accent/50 transition-colors">
                          <div>
                            <p className="text-sm font-medium">{/* @ts-ignore */}{sub.tools?.display_name || "Unknown Tool"}</p>
                            <p className="text-xs text-muted-foreground">{/* @ts-ignore */}{sub.tools?.category || "General"}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-medium">{getStatusBadge(sub)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="sticky bottom-0 bg-background/95 backdrop-blur pt-3 pb-1">
                <Button onClick={handleSavePreferences} disabled={saving} className="w-full">
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save All Settings
                </Button>
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default Profile;
