"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { SettingsBreadcrumb } from "@/app/(protected)/settings/_components/SettingsBreadcrumb";
import { Globe } from "lucide-react";

export default function GeneralSettingsPage() {
  return (
    <>
      {/* Breadcrumb */}
      <SettingsBreadcrumb currentPage="General" />

      {/* General Settings Content */}
      <div className="space-y-6">
        <Card className="rounded-2xl md:rounded-3xl border-border/50 shadow-sm overflow-hidden">
          <CardHeader className="bg-muted/30 pb-4 md:pb-6">
            <CardTitle className="text-lg md:text-xl flex items-center gap-2">
              <Globe size={20} />
              General Settings
            </CardTitle>
            <CardDescription className="text-sm">
              Configure general preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">
              General settings coming soon. This will include language
              preferences, timezone settings, and more.
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
