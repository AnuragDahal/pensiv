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
import { User, Lock, Trash2, Shield, Globe, Loader2, Github, Linkedin, Twitter, ExternalLink } from "lucide-react";
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

  // Social Links state
  const [githubUrl, setGithubUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [twitterUrl, setTwitterUrl] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [urlErrors, setUrlErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setBio(user.bio || "");
      setAvatar(user.avatar || "");
      setAvatarPreview(user.avatar || ""); // Initialize preview with current avatar

      // Initialize social links
      setGithubUrl(user.socialLinks?.github || "");
      setLinkedinUrl(user.socialLinks?.linkedin || "");
      setTwitterUrl(user.socialLinks?.twitter || "");
      setPortfolioUrl(user.socialLinks?.portfolio || "");
    }
  }, [user]);

  if (!user) return null;

  // URL Validation Function
  const validateUrl = (url: string, platform: string): string | null => {
    if (!url) return null; // Empty is valid (optional field)

    try {
      new URL(url);

      // Platform-specific validation
      const platformChecks: Record<string, RegExp> = {
        github: /github\.com/i,
        linkedin: /linkedin\.com/i,
        twitter: /(twitter\.com|x\.com)/i,
      };

      if (platformChecks[platform] && !platformChecks[platform].test(url)) {
        return `Please enter a valid ${platform.charAt(0).toUpperCase() + platform.slice(1)} URL`;
      }

      return null; // Valid
    } catch {
      return "Please enter a valid URL (including https://)";
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate URLs
    const errors: Record<string, string> = {};
    const githubError = validateUrl(githubUrl, "github");
    const linkedinError = validateUrl(linkedinUrl, "linkedin");
    const twitterError = validateUrl(twitterUrl, "twitter");
    const portfolioError = validateUrl(portfolioUrl, "portfolio");

    if (githubError) errors.github = githubError;
    if (linkedinError) errors.linkedin = linkedinError;
    if (twitterError) errors.twitter = twitterError;
    if (portfolioError) errors.portfolio = portfolioError;

    if (Object.keys(errors).length > 0) {
      setUrlErrors(errors);
      toast.error("Please fix URL errors before saving");
      return;
    }

    setUrlErrors({});
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

      // Prepare social links object (only include non-empty URLs)
      const socialLinks: Record<string, string> = {};
      if (githubUrl) socialLinks.github = githubUrl;
      if (linkedinUrl) socialLinks.linkedin = linkedinUrl;
      if (twitterUrl) socialLinks.twitter = twitterUrl;
      if (portfolioUrl) socialLinks.portfolio = portfolioUrl;

      // Update backend with the avatar URL AND social links
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/update`,
        {
          name,
          bio,
          avatar: avatarUrl,
          socialLinks: Object.keys(socialLinks).length > 0 ? socialLinks : undefined
        },
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
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col gap-2 mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Settings
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Manage your account settings and preferences.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-6 md:gap-8">
          {/* Sidebar Navigation - Hidden on mobile, shown as tabs */}
          <aside className="hidden lg:block space-y-1">
            <nav className="flex flex-col gap-1 sticky top-6">
              {[
                { icon: User, label: "Profile", active: true },
                { icon: Lock, label: "Security", active: false },
                { icon: Globe, label: "General", active: false },
                { icon: Shield, label: "Privacy", active: false },
              ].map((item) => (
                <button
                  key={item.label}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    item.active
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "hover:bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <item.icon size={16} />
                  {item.label}
                </button>
              ))}
              <Separator className="my-4" />
              <Button
                variant="ghost"
                className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive gap-3 rounded-lg text-sm"
              >
                <Trash2 size={16} />
                Delete Account
              </Button>
            </nav>
          </aside>

          {/* Main Settings Content */}
          <div className="space-y-6">
            {/* Profile Section */}
            <Card className="rounded-2xl md:rounded-3xl border-border/50 shadow-sm overflow-hidden">
              <CardHeader className="bg-muted/30 pb-4 md:pb-6">
                <CardTitle className="text-lg md:text-xl">Public Profile</CardTitle>
                <CardDescription className="text-sm">
                  This information will be displayed publicly.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 md:pt-8">
                <form onSubmit={handleUpdateProfile} className="space-y-6 md:space-y-8">
                  {/* Avatar Upload */}
                  <div className="space-y-4">
                    <Label className="text-sm md:text-base">Profile Picture</Label>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                      <div className="relative group">
                        <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-xl sm:rounded-2xl overflow-hidden border-2 border-border/50 bg-muted">
                          {avatarPreview ? (
                            <img src={avatarPreview} alt="Avatar" className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                              <User size={36} className="sm:w-10 sm:h-10" />
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex-1 w-full">
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
                        <p className="text-xs text-muted-foreground mt-2">
                          Use a square image for best results.
                        </p>
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-border/50" />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="username" className="text-sm">Full Name</Label>
                      <Input
                        id="username"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                        className="rounded-lg border-border/50 bg-background h-10 md:h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm">Email Address</Label>
                      <Input
                        id="email"
                        defaultValue={user.email}
                        disabled
                        className="rounded-lg border-border/50 bg-muted h-10 md:h-11"
                      />
                      <p className="text-xs text-muted-foreground">
                        * Email cannot be changed
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 text-foreground">
                    <Label htmlFor="bio" className="text-sm">Bio</Label>
                    <Textarea
                      id="bio"
                      className="min-h-[100px] md:min-h-[120px] rounded-lg border-border/50"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Share a bit about yourself..."
                    />
                  </div>

                  <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2 md:pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.push("/profile")}
                      className="rounded-lg sm:rounded-full px-6 h-11 font-medium"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isUpdating}
                      className="rounded-lg sm:rounded-full px-6 md:px-8 h-11 md:h-12 font-bold shadow-lg shadow-primary/20 gap-2"
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

            {/* Social Links Section */}
            <Card className="rounded-2xl md:rounded-3xl border-border/50 shadow-sm overflow-hidden">
              <CardHeader className="bg-muted/30 pb-4 md:pb-6">
                <CardTitle className="text-lg md:text-xl">Social Links</CardTitle>
                <CardDescription className="text-sm">
                  Add your social media profiles to appear on your public profile.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 md:pt-8">
                <div className="space-y-5 md:space-y-6">
                  {/* GitHub */}
                  <div className="space-y-2">
                    <Label htmlFor="github" className="text-sm flex items-center gap-2">
                      <Github size={16} className="text-muted-foreground" />
                      GitHub
                    </Label>
                    <Input
                      id="github"
                      type="url"
                      value={githubUrl}
                      onChange={(e) => {
                        setGithubUrl(e.target.value);
                        setUrlErrors((prev) => ({ ...prev, github: "" }));
                      }}
                      placeholder="https://github.com/username"
                      className={`rounded-lg border-border/50 bg-background h-10 md:h-11 ${
                        urlErrors.github ? "border-destructive" : ""
                      }`}
                    />
                    {urlErrors.github && (
                      <p className="text-xs text-destructive mt-1">{urlErrors.github}</p>
                    )}
                  </div>

                  <Separator className="bg-border/50" />

                  {/* LinkedIn */}
                  <div className="space-y-2">
                    <Label htmlFor="linkedin" className="text-sm flex items-center gap-2">
                      <Linkedin size={16} className="text-muted-foreground" />
                      LinkedIn
                    </Label>
                    <Input
                      id="linkedin"
                      type="url"
                      value={linkedinUrl}
                      onChange={(e) => {
                        setLinkedinUrl(e.target.value);
                        setUrlErrors((prev) => ({ ...prev, linkedin: "" }));
                      }}
                      placeholder="https://linkedin.com/in/username"
                      className={`rounded-lg border-border/50 bg-background h-10 md:h-11 ${
                        urlErrors.linkedin ? "border-destructive" : ""
                      }`}
                    />
                    {urlErrors.linkedin && (
                      <p className="text-xs text-destructive mt-1">{urlErrors.linkedin}</p>
                    )}
                  </div>

                  <Separator className="bg-border/50" />

                  {/* Twitter */}
                  <div className="space-y-2">
                    <Label htmlFor="twitter" className="text-sm flex items-center gap-2">
                      <Twitter size={16} className="text-muted-foreground" />
                      Twitter / X
                    </Label>
                    <Input
                      id="twitter"
                      type="url"
                      value={twitterUrl}
                      onChange={(e) => {
                        setTwitterUrl(e.target.value);
                        setUrlErrors((prev) => ({ ...prev, twitter: "" }));
                      }}
                      placeholder="https://twitter.com/username"
                      className={`rounded-lg border-border/50 bg-background h-10 md:h-11 ${
                        urlErrors.twitter ? "border-destructive" : ""
                      }`}
                    />
                    {urlErrors.twitter && (
                      <p className="text-xs text-destructive mt-1">{urlErrors.twitter}</p>
                    )}
                  </div>

                  <Separator className="bg-border/50" />

                  {/* Portfolio */}
                  <div className="space-y-2">
                    <Label htmlFor="portfolio" className="text-sm flex items-center gap-2">
                      <Globe size={16} className="text-muted-foreground" />
                      Portfolio / Website
                    </Label>
                    <Input
                      id="portfolio"
                      type="url"
                      value={portfolioUrl}
                      onChange={(e) => {
                        setPortfolioUrl(e.target.value);
                        setUrlErrors((prev) => ({ ...prev, portfolio: "" }));
                      }}
                      placeholder="https://yourportfolio.com"
                      className={`rounded-lg border-border/50 bg-background h-10 md:h-11 ${
                        urlErrors.portfolio ? "border-destructive" : ""
                      }`}
                    />
                    {urlErrors.portfolio && (
                      <p className="text-xs text-destructive mt-1">{urlErrors.portfolio}</p>
                    )}
                  </div>
                </div>

                <p className="text-xs text-muted-foreground mt-6 flex items-center gap-1.5">
                  <ExternalLink size={12} />
                  All links are optional. Leave blank to hide from your profile.
                </p>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
}
