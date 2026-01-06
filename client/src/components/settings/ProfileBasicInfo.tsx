"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ImageUpload from "@/components/ui/image-upload";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";

interface ProfileBasicInfoProps {
  name: string;
  bio: string;
  avatarPreview: string;
  onNameChange: (value: string) => void;
  onBioChange: (value: string) => void;
  onAvatarUpload: (url: string) => void;
  onAvatarSelect: (file: File | null) => void;
}

export function ProfileBasicInfo({
  name,
  bio,
  avatarPreview,
  onNameChange,
  onBioChange,
  onAvatarUpload,
  onAvatarSelect,
}: ProfileBasicInfoProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <User className="h-5 w-5" />
          <CardTitle>Profile Information</CardTitle>
        </div>
        <CardDescription>Update your public profile information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Avatar Upload */}
        <div className="space-y-2">
          <Label htmlFor="avatar">Profile Picture</Label>
          <ImageUpload
            mode="immediate"
            currentImage={avatarPreview}
            onImageUpload={onAvatarUpload}
            onImageSelect={onAvatarSelect}
            label="Upload Avatar"
          />
        </div>

        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Your name"
          />
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={bio}
            onChange={(e) => onBioChange(e.target.value)}
            placeholder="Tell us about yourself"
            rows={4}
            maxLength={500}
          />
          <p className="text-sm text-muted-foreground">{bio.length}/500 characters</p>
        </div>
      </CardContent>
    </Card>
  );
}
