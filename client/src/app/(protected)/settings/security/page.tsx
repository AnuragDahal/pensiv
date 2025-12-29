"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Key, Shield } from "lucide-react";

export default function SecuritySettingsPage() {
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
        <span className="text-foreground">Security</span>
      </div>

      {/* Security Settings Content */}
      <div className="space-y-6">
        <Card className="rounded-2xl md:rounded-3xl border-border/50 shadow-sm overflow-hidden">
          <CardHeader className="bg-muted/30 pb-4 md:pb-6">
            <CardTitle className="text-lg md:text-xl flex items-center gap-2">
              <Lock size={20} />
              Change Password
            </CardTitle>
            <CardDescription className="text-sm">
              Update your password to keep your account secure
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input
                id="current-password"
                type="password"
                placeholder="Enter current password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="Enter new password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Confirm new password"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button disabled>Update Password</Button>
              <Button variant="outline" disabled>Cancel</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl md:rounded-3xl border-border/50 shadow-sm overflow-hidden">
          <CardHeader className="bg-muted/30 pb-4 md:pb-6">
            <CardTitle className="text-lg md:text-xl flex items-center gap-2">
              <Shield size={20} />
              Two-Factor Authentication
            </CardTitle>
            <CardDescription className="text-sm">
              Add an extra layer of security to your account
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-4">
              Two-factor authentication is not currently enabled. Enable it to add an extra layer of security.
            </p>
            <Button disabled variant="outline">
              <Key size={16} className="mr-2" />
              Enable 2FA (Coming Soon)
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
