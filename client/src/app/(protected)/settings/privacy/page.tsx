"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { SettingsBreadcrumb } from "@/app/(protected)/settings/_components/SettingsBreadcrumb";
import { Shield } from "lucide-react";

export default function PrivacySettingsPage() {
  return (
    <>
      {/* Breadcrumb */}
      <SettingsBreadcrumb currentPage="Privacy" />

      {/* Privacy Settings Content */}
      <div className="space-y-6">
        <Card className="rounded-2xl md:rounded-3xl border-border/50 shadow-sm overflow-hidden">
          <CardHeader className="bg-muted/30 pb-4 md:pb-6">
            <CardTitle className="text-lg md:text-xl flex items-center gap-2">
              <Shield size={20} />
              Privacy Settings
            </CardTitle>
            <CardDescription className="text-sm">
              Control your privacy preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">
              Privacy settings coming soon. This will include options to control
              who can see your profile, articles, and activity.
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
