"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe } from "lucide-react";

export default function GeneralSettingsPage() {
  return (
    <>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/settings/profile" className="hover:text-primary transition-colors">
          Settings
        </Link>
        <span>/</span>
        <span className="text-foreground">General</span>
      </div>

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
              General settings coming soon. This will include language preferences, timezone settings, and more.
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
