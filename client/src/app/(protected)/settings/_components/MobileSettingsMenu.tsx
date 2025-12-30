"use client";

import { Card } from "@/components/ui/card";
import { User, Lock, Globe, Shield, ChevronRight } from "lucide-react";
import Link from "next/link";

export function MobileSettingsMenu() {
  const menuItems = [
    {
      icon: User,
      label: "Profile",
      href: "/settings/profile",
      description: "Manage your public profile and personal information",
    },
    {
      icon: Lock,
      label: "Security",
      href: "/settings/security",
      description: "Password, authentication, and account security",
    },
    {
      icon: Globe,
      label: "General",
      href: "/settings/general",
      description: "General preferences and application settings",
    },
    {
      icon: Shield,
      label: "Privacy",
      href: "/settings/privacy",
      description: "Control your privacy and data sharing preferences",
    },
  ];

  return (
    <div className="space-y-3">
      {menuItems.map((item) => (
        <Link key={item.label} href={item.href}>
          <Card className="rounded-2xl border-border/50 shadow-sm hover:shadow-md hover:border-primary/30 transition-all p-4 bg-card">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10 text-primary flex-shrink-0">
                <item.icon size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base">{item.label}</h3>
                <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                  {item.description}
                </p>
              </div>
              <ChevronRight
                size={20}
                className="text-muted-foreground flex-shrink-0"
              />
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}
