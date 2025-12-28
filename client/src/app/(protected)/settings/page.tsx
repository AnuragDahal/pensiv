"use client";

import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { User, Lock, Bell, Trash2, Shield, Globe, Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";
import ImageUpload from "@/components/ui/image-upload";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const { user, refetchUser, accessToken } = useAuth();
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(""); // For blob preview
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setBio(user.bio || "");
      setAvatar(user.avatar || "");
      setAvatarPreview(user.avatar || ""); // Initialize preview with current avatar
    }
  }, [user]);

  if (!user) return null;

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      let avatarUrl = avatar; // Keep the original Supabase URL

      // Upload new avatar if selected
      if (avatarFile) {
        toast.loading("Uploading profile picture...", { id: "avatar-upload" });
        const { uploadImage, deleteImage } = await import("@/lib/supabase/client");

        // Delete old avatar if exists and it's a valid Supabase URL (not a base64 blob)
        if (avatar && avatar.startsWith("http")) {
          await deleteImage(avatar);
        }

        const url = await uploadImage(avatarFile, "avatars"); // Uses coverimages bucket with avatars/ prefix
        if (!url) {
          toast.error("Failed to upload profile picture", { id: "avatar-upload" });
          setIsUpdating(false);
          return;
        }

        avatarUrl = url;
        toast.success("Profile picture uploaded", { id: "avatar-upload" });
      }

      // Update backend with the avatar URL
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/update`,
        { name, bio, avatar: avatarUrl },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );

      await refetchUser();
      toast.success("Profile updated successfully!");
      router.push("/profile");
    } catch (error) {
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto mt-8">
        <div className="flex flex-col gap-1 mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight">
            Settings
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage your account settings and preferences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-12">
          {/* Sidebar Navigation */}
          <aside className="space-y-1">
            <nav className="flex flex-col gap-1">
              {[
                { icon: User, label: "Profile", active: true },
                { icon: Lock, label: "Security", active: false },
                { icon: Globe, label: "General", active: false },
                { icon: Bell, label: "Notifications", active: false },
                { icon: Shield, label: "Privacy", active: false },
              ].map((item) => (
                <button
                  key={item.label}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    item.active
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                      : "hover:bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <item.icon size={18} />
                  {item.label}
                </button>
              ))}
            </nav>
            <div className="pt-8 px-4">
              <Button
                variant="ghost"
                className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive gap-3 rounded-xl"
              >
                <Trash2 size={18} />
                Delete Account
              </Button>
            </div>
          </aside>

          {/* Main Settings Content */}
          <div className="space-y-8">
            {/* Profile Section */}
            <Card className="rounded-3xl border-border/50 shadow-sm overflow-hidden">
              <CardHeader className="bg-muted/30 pb-6">
                <CardTitle>Public Profile</CardTitle>
                <CardDescription>
                  This information will be displayed publicly.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-8">
                <form onSubmit={handleUpdateProfile} className="space-y-8">
                  {/* Avatar Upload */}
                  <div className="space-y-4">
                    <Label>Profile Picture</Label>
                    <div className="flex items-center gap-8">
                      <div className="relative group">
                        <div className="h-24 w-24 rounded-2xl overflow-hidden border-2 border-border/50 bg-muted">
                          {avatarPreview ? (
                            <img src={avatarPreview} alt="Avatar" className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                              <User size={40} />
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex-1 max-w-sm">
                        <ImageUpload
                          mode="deferred"
                          onImageSelect={(file) => {
                            setAvatarFile(file);
                            if (file) {
                              // Create preview URL for display (separate from actual avatar URL)
                              const reader = new FileReader();
                              reader.onload = (e) => {
                                setAvatarPreview(e.target?.result as string);
                              };
                              reader.readAsDataURL(file);
                            } else {
                              // If file is null (removed), reset to original avatar
                              setAvatarPreview(avatar);
                            }
                          }}
                          onImageUpload={() => {}} // Required but unused in deferred mode
                          currentImage={avatarPreview}
                          label=""
                          className="w-full"
                        />
                        <p className="text-[10px] text-muted-foreground mt-2 italic px-2">
                          Use a square image for best results.
                        </p>
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-border/50" />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="username">Full Name</Label>
                      <Input
                        id="username"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                        className="rounded-xl border-border/50 bg-background h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        defaultValue={user.email}
                        disabled
                        className="rounded-xl border-border/50 bg-muted h-11"
                      />
                      <p className="text-[10px] text-muted-foreground ml-1 italic">
                        * Email cannot be changed
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 text-foreground">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      className="min-h-[120px] rounded-xl border-border/50"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Share a bit about yourself..."
                    />
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button 
                      type="submit" 
                      disabled={isUpdating}
                      className="rounded-full px-8 h-12 font-bold shadow-xl shadow-primary/20 gap-2 min-w-[140px]"
                    >
                      {isUpdating ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Account Preferences */}
            <Card className="rounded-3xl border-border/50 shadow-sm overflow-hidden font-medium">
              <CardHeader className="bg-muted/30 pb-6 font-medium">
                <CardTitle>Internal Notifications</CardTitle>
                <CardDescription>
                  Manage how you receive updates and alerts.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-8 space-y-0">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="font-semibold text-foreground">
                        Email Notifications
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Receive weekly digest and top stories.
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator className="bg-border/50" />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="font-semibold text-foreground">
                        Comment Alerts
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Notify me when someone comments on my posts.
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator className="bg-border/50" />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="font-semibold text-foreground">
                        Marketing Communications
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Stay updated with our latest features and news.
                      </p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
