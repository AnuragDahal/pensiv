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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect, useRef } from "react";
import ImageUpload from "@/components/ui/image-upload";
import apiClient from "@/lib/api/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { SettingsBreadcrumb } from "@/app/(protected)/settings/_components/SettingsBreadcrumb";
import { AvatarCropper } from "@/components/ui/avatar-cropper";
import {
  User,
  Loader2,
  Github,
  Linkedin,
  Twitter,
  Globe,
  ExternalLink,
  UserCircle,
  Link as LinkIcon,
  Upload,
} from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const { user, refetchUser } = useAuth();
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(""); // For blob preview
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const [tempImageForCrop, setTempImageForCrop] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Social Links state
  const [githubUrl, setGithubUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [twitterUrl, setTwitterUrl] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [urlErrors, setUrlErrors] = useState<Record<string, string>>({});

  // Initial values for change detection
  const [initialValues, setInitialValues] = useState({
    name: "",
    bio: "",
    avatar: "",
    githubUrl: "",
    linkedinUrl: "",
    twitterUrl: "",
    portfolioUrl: "",
  });

  useEffect(() => {
    if (user) {
      const initialName = user.name || "";
      const initialBio = user.bio || "";
      const initialAvatar = user.avatar || "";
      const initialGithub = user.socialLinks?.github || "";
      const initialLinkedin = user.socialLinks?.linkedin || "";
      const initialTwitter = user.socialLinks?.twitter || "";
      const initialPortfolio = user.socialLinks?.portfolio || "";

      setName(initialName);
      setBio(initialBio);
      setAvatar(initialAvatar);
      setAvatarPreview(initialAvatar); // Initialize preview with current avatar

      // Initialize social links
      setGithubUrl(initialGithub);
      setLinkedinUrl(initialLinkedin);
      setTwitterUrl(initialTwitter);
      setPortfolioUrl(initialPortfolio);

      // Set initial values for change detection
      setInitialValues({
        name: initialName,
        bio: initialBio,
        avatar: initialAvatar,
        githubUrl: initialGithub,
        linkedinUrl: initialLinkedin,
        twitterUrl: initialTwitter,
        portfolioUrl: initialPortfolio,
      });
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
        return `Please enter a valid ${
          platform.charAt(0).toUpperCase() + platform.slice(1)
        } URL`;
      }

      return null; // Valid
    } catch {
      return "Please enter a valid URL (including https://)";
    }
  };

  // Check if any changes have been made
  const hasChanges = (): boolean => {
    return (
      name !== initialValues.name ||
      bio !== initialValues.bio ||
      avatarFile !== null ||
      githubUrl !== initialValues.githubUrl ||
      linkedinUrl !== initialValues.linkedinUrl ||
      twitterUrl !== initialValues.twitterUrl ||
      portfolioUrl !== initialValues.portfolioUrl
    );
  };

  // Reset form to initial values
  const handleCancel = () => {
    setName(initialValues.name);
    setBio(initialValues.bio);
    setAvatar(initialValues.avatar);
    setAvatarPreview(initialValues.avatar);
    setAvatarFile(null);
    setGithubUrl(initialValues.githubUrl);
    setLinkedinUrl(initialValues.linkedinUrl);
    setTwitterUrl(initialValues.twitterUrl);
    setPortfolioUrl(initialValues.portfolioUrl);
    setUrlErrors({});
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Create temporary preview for cropper
    const reader = new FileReader();
    reader.onload = (e) => {
      setTempImageForCrop(e.target?.result as string);
      setShowCropper(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = (croppedFile: File) => {
    setAvatarFile(croppedFile);
    // Create preview URL for display
    const reader = new FileReader();
    reader.onload = (e) => {
      setAvatarPreview(e.target?.result as string);
    };
    reader.readAsDataURL(croppedFile);
    setShowCropper(false);
    setTempImageForCrop("");
  };

  const handleCropCancel = () => {
    setShowCropper(false);
    setTempImageForCrop("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarPreview(initialValues.avatar);
    setAvatarFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
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
        const { uploadImage, deleteImage } = await import(
          "@/lib/supabase/client"
        );

        // Delete old avatar if exists and it's a valid Supabase URL (not a base64 blob)
        if (avatar && avatar.startsWith("http")) {
          await deleteImage(avatar);
        }

        const url = await uploadImage(avatarFile, "avatars"); // Uses coverimages bucket with avatars/ prefix
        if (!url) {
          toast.error("Failed to upload profile picture", {
            id: "avatar-upload",
          });
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
      await apiClient.patch(
        `/api/auth/update`,
        {
          name,
          bio,
          avatar: avatarUrl,
          socialLinks:
            Object.keys(socialLinks).length > 0 ? socialLinks : undefined,
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
    <>
      {/* Breadcrumb */}
      <SettingsBreadcrumb currentPage="Profile" />
      {/* Profile Settings Content */}
      <div className="space-y-6">
        <Card className="rounded-2xl md:rounded-3xl border-border/50 shadow-sm overflow-hidden">
          <CardHeader className="bg-muted/30 pb-4 md:pb-6">
            <CardTitle className="text-lg md:text-xl">Profile Settings</CardTitle>
            <CardDescription className="text-sm">
              Manage your public profile and social links.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 md:pt-8">
            <form
              onSubmit={handleUpdateProfile}
              className="space-y-6 md:space-y-8"
            >
              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="profile" className="gap-2">
                    <UserCircle size={16} />
                    Profile Info
                  </TabsTrigger>
                  <TabsTrigger value="social" className="gap-2">
                    <LinkIcon size={16} />
                    Social Links
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="space-y-6 md:space-y-8 mt-0">
              {/* Avatar Upload */}
              <div className="space-y-4">
                <Label className="text-sm md:text-base">Profile Picture</Label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                  <div className="relative group">
                    <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full overflow-hidden border-2 border-border/50 bg-muted">
                      {avatarPreview ? (
                        <img
                          src={avatarPreview}
                          alt="Avatar"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                          <User size={36} className="sm:w-10 sm:h-10" />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex-1 w-full space-y-2">
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="gap-2"
                      >
                        <Upload size={16} />
                        Choose Image
                      </Button>
                      {avatarFile && (
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={handleRemoveAvatar}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Upload a square image. You'll be able to crop it before saving.
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>

              <Separator className="bg-border/50" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm">
                    Full Name
                  </Label>
                  <Input
                    id="username"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="rounded-lg border-border/50 bg-background h-10 md:h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm">
                    Email Address
                  </Label>
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
                <Label htmlFor="bio" className="text-sm">
                  Bio
                </Label>
                <Textarea
                  id="bio"
                  className="min-h-[100px] md:min-h-[120px] rounded-lg border-border/50"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Share a bit about yourself..."
                />
              </div>
                </TabsContent>

                <TabsContent value="social" className="space-y-5 md:space-y-6 mt-0">
              {/* GitHub */}
              <div className="space-y-2">
                <Label
                  htmlFor="github"
                  className="text-sm flex items-center gap-2"
                >
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
                  <p className="text-xs text-destructive mt-1">
                    {urlErrors.github}
                  </p>
                )}
              </div>

              <Separator className="bg-border/50" />

              {/* LinkedIn */}
              <div className="space-y-2">
                <Label
                  htmlFor="linkedin"
                  className="text-sm flex items-center gap-2"
                >
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
                  <p className="text-xs text-destructive mt-1">
                    {urlErrors.linkedin}
                  </p>
                )}
              </div>

              <Separator className="bg-border/50" />

              {/* Twitter */}
              <div className="space-y-2">
                <Label
                  htmlFor="twitter"
                  className="text-sm flex items-center gap-2"
                >
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
                  <p className="text-xs text-destructive mt-1">
                    {urlErrors.twitter}
                  </p>
                )}
              </div>

              <Separator className="bg-border/50" />

              {/* Portfolio */}
              <div className="space-y-2">
                <Label
                  htmlFor="portfolio"
                  className="text-sm flex items-center gap-2"
                >
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
                  <p className="text-xs text-destructive mt-1">
                    {urlErrors.portfolio}
                  </p>
                )}
              </div>

              <p className="text-xs text-muted-foreground mt-6 flex items-center gap-1.5">
                <ExternalLink size={12} />
                All links are optional. Leave blank to hide from your profile.
              </p>
                </TabsContent>
              </Tabs>

              {/* Action Buttons - Outside tabs but inside form */}
              <Separator className="bg-border/50" />
              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2 md:pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={!hasChanges() || isUpdating}
                  className="rounded-lg sm:rounded-full px-6 h-11 font-medium"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isUpdating || !hasChanges()}
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

        {/* Avatar Cropper Dialog */}
        {showCropper && tempImageForCrop && (
          <AvatarCropper
            image={tempImageForCrop}
            onCropComplete={handleCropComplete}
            onCancel={handleCropCancel}
            open={showCropper}
          />
        )}
      </div>
    </>
  );
}
