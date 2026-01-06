"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { SettingsBreadcrumb } from "@/app/(protected)/settings/_components/SettingsBreadcrumb";
import { Shield, Key, Lock, Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import apiClient from "@/lib/api/client";
import { useAuth } from "@/hooks/use-auth";

export default function SecuritySettingsPage() {
  const { } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters long";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password";
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (currentPassword && newPassword && currentPassword === newPassword) {
      newErrors.newPassword = "New password must be different from current password";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const hasChanges = (): boolean => {
    return currentPassword !== "" || newPassword !== "" || confirmPassword !== "";
  };

  const handleCancel = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsUpdating(true);
    try {
      await apiClient.patch(
        `/api/auth/update-password`,
        {
          currentPassword,
          newPassword,
        }
      );

      toast.success("Password updated successfully");
      handleCancel();
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to update password";
      toast.error(errorMessage);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      {/* Breadcrumb */}
      <SettingsBreadcrumb currentPage="Security" />

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
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <div className="relative">
                  <Input
                    id="current-password"
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={(e) => {
                      setCurrentPassword(e.target.value);
                      setErrors((prev) => ({ ...prev, currentPassword: "" }));
                    }}
                    className={errors.currentPassword ? "border-destructive" : ""}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.currentPassword && (
                  <p className="text-xs text-destructive">{errors.currentPassword}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setErrors((prev) => ({ ...prev, newPassword: "" }));
                    }}
                    className={errors.newPassword ? "border-destructive" : ""}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="text-xs text-destructive">{errors.newPassword}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Password must be at least 6 characters long
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setErrors((prev) => ({ ...prev, confirmPassword: "" }));
                    }}
                    className={errors.confirmPassword ? "border-destructive" : ""}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-destructive">{errors.confirmPassword}</p>
                )}
              </div>

              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
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
                      Updating...
                    </>
                  ) : (
                    "Update Password"
                  )}
                </Button>
              </div>
            </form>
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
              Two-factor authentication is not currently enabled. Enable it to
              add an extra layer of security.
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
