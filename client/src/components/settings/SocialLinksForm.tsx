"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Github, Linkedin, Twitter, Globe, ExternalLink } from "lucide-react";
import { validateSocialUrl } from "@/lib/utils/validators";
import { useState, useEffect } from "react";

interface SocialLink {
  platform: string;
  value: string;
  icon: React.ReactNode;
  placeholder: string;
}

interface SocialLinksFormProps {
  githubUrl: string;
  linkedinUrl: string;
  twitterUrl: string;
  portfolioUrl: string;
  onGithubChange: (value: string) => void;
  onLinkedinChange: (value: string) => void;
  onTwitterChange: (value: string) => void;
  onPortfolioChange: (value: string) => void;
}

export function SocialLinksForm({
  githubUrl,
  linkedinUrl,
  twitterUrl,
  portfolioUrl,
  onGithubChange,
  onLinkedinChange,
  onTwitterChange,
  onPortfolioChange,
}: SocialLinksFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const socialLinks: SocialLink[] = [
    {
      platform: "github",
      value: githubUrl,
      icon: <Github className="h-4 w-4" />,
      placeholder: "https://github.com/username",
    },
    {
      platform: "linkedin",
      value: linkedinUrl,
      icon: <Linkedin className="h-4 w-4" />,
      placeholder: "https://linkedin.com/in/username",
    },
    {
      platform: "twitter",
      value: twitterUrl,
      icon: <Twitter className="h-4 w-4" />,
      placeholder: "https://twitter.com/username",
    },
    {
      platform: "portfolio",
      value: portfolioUrl,
      icon: <Globe className="h-4 w-4" />,
      placeholder: "https://yourportfolio.com",
    },
  ];

  const handleChange = (platform: string, value: string) => {
    // Validate URL
    const error = validateSocialUrl(value, platform);
    setErrors((prev) => ({
      ...prev,
      [platform]: error || "",
    }));

    // Call appropriate handler
    switch (platform) {
      case "github":
        onGithubChange(value);
        break;
      case "linkedin":
        onLinkedinChange(value);
        break;
      case "twitter":
        onTwitterChange(value);
        break;
      case "portfolio":
        onPortfolioChange(value);
        break;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <ExternalLink className="h-5 w-5" />
          <CardTitle>Social Links</CardTitle>
        </div>
        <CardDescription>Connect your social media profiles</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {socialLinks.map((link) => (
          <div key={link.platform} className="space-y-2">
            <Label htmlFor={link.platform} className="flex items-center gap-2 capitalize">
              {link.icon}
              {link.platform}
            </Label>
            <Input
              id={link.platform}
              value={link.value}
              onChange={(e) => handleChange(link.platform, e.target.value)}
              placeholder={link.placeholder}
              className={errors[link.platform] ? "border-red-500" : ""}
            />
            {errors[link.platform] && (
              <p className="text-sm text-red-500">{errors[link.platform]}</p>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
