"use client";

import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Mail, Calendar, MapPin, Link as LinkIcon, Edit2, FileText, Settings, Star, Trophy, Zap, User, Github, Linkedin, Twitter, Globe, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 pb-12">
      <div className="max-w-6xl mx-auto">
        {/* Header Section - No Cover Image */}
        <div className="relative mb-8 md:mb-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-6 md:p-8 rounded-2xl md:rounded-3xl bg-gradient-to-br from-muted/50 to-muted/30 border border-border/50">
            {/* Avatar */}
            <div className="h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32 rounded-2xl md:rounded-3xl border-4 border-background bg-muted shadow-xl overflow-hidden group flex-shrink-0">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-full w-full object-cover transition-transform group-hover:scale-110"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20 text-primary">
                  <User size={48} className="md:w-16 md:h-16" />
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">{user.name}</h1>
              <p className="text-muted-foreground font-medium text-sm sm:text-base mt-1">{user.email}</p>
              <p className="text-muted-foreground text-sm mt-2 line-clamp-2">
                {user.bio || "No biography provided yet."}
              </p>
            </div>

            {/* Edit Button */}
            <div className="w-full sm:w-auto">
              <Link href="/settings" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto rounded-xl gap-2 font-semibold shadow-md px-6">
                  <Edit2 size={16} />
                  Edit Profile
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Left Column: Stats */}
          <div className="space-y-6">
            <Card className="rounded-2xl border-border/50 shadow-sm overflow-hidden">
              <CardHeader className="bg-muted/30 pb-4">
                <CardTitle className="text-base md:text-lg">Stats</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-3 md:gap-4 text-center">
                  <div className="p-3 md:p-4 rounded-xl bg-primary/5 border border-primary/10">
                    <p className="text-xl md:text-2xl font-bold text-primary">{user.stats?.postCount || 0}</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-1">Articles</p>
                  </div>
                  <div className="p-3 md:p-4 rounded-xl bg-accent/5 border border-accent/10">
                    <p className="text-xl md:text-2xl font-bold text-accent">{user.stats?.totalLikes || 0}</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-1">Likes</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-border/50 shadow-sm overflow-hidden">
              <CardHeader className="bg-muted/30 pb-4">
                <CardTitle className="text-base md:text-lg">Info</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-3">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Mail size={16} className="text-primary flex-shrink-0" />
                  <span className="truncate">{user.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Calendar size={16} className="text-primary flex-shrink-0" />
                  Joined December 2023
                </div>

                {/* Social Links Section */}
                {user.socialLinks && Object.values(user.socialLinks).some((link) => link) && (
                  <>
                    <Separator className="bg-border/50 my-3" />
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                        Social Links
                      </p>
                      <div className="space-y-2">
                        {user.socialLinks.github && (
                          <a
                            href={user.socialLinks.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-primary transition-colors group"
                          >
                            <Github size={16} className="flex-shrink-0 text-primary" />
                            <span className="flex-1 truncate">GitHub</span>
                            <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                          </a>
                        )}
                        {user.socialLinks.linkedin && (
                          <a
                            href={user.socialLinks.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-primary transition-colors group"
                          >
                            <Linkedin size={16} className="flex-shrink-0 text-primary" />
                            <span className="flex-1 truncate">LinkedIn</span>
                            <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                          </a>
                        )}
                        {user.socialLinks.twitter && (
                          <a
                            href={user.socialLinks.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-primary transition-colors group"
                          >
                            <Twitter size={16} className="flex-shrink-0 text-primary" />
                            <span className="flex-1 truncate">Twitter / X</span>
                            <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                          </a>
                        )}
                        {user.socialLinks.portfolio && (
                          <a
                            href={user.socialLinks.portfolio}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-primary transition-colors group"
                          >
                            <Globe size={16} className="flex-shrink-0 text-primary" />
                            <span className="flex-1 truncate">Portfolio</span>
                            <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                          </a>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Profile Summary/Overview */}
          <div className="lg:col-span-2 space-y-6 md:space-y-8">
            <div className="flex items-center gap-4 mb-2">
              <h2 className="text-lg md:text-xl font-bold">Quick Overview</h2>
              <div className="h-px flex-1 bg-border/50" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              <Link href="/article?author=me" className="group">
                <Card className="rounded-2xl md:rounded-3xl border-border/50 shadow-sm hover:shadow-md hover:border-primary/30 transition-all p-5 md:p-6 bg-gradient-to-br from-primary/5 to-transparent">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="p-2.5 md:p-3 rounded-xl md:rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors flex-shrink-0">
                      <FileText size={20} className="md:w-6 md:h-6" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-base md:text-lg">My Articles</h3>
                      <p className="text-xs md:text-sm text-muted-foreground line-clamp-1">Manage and view your published stories.</p>
                    </div>
                  </div>
                </Card>
              </Link>

              <Link href="/settings" className="group">
                <Card className="rounded-2xl md:rounded-3xl border-border/50 shadow-sm hover:shadow-md hover:border-accent/30 transition-all p-5 md:p-6 bg-gradient-to-br from-accent/5 to-transparent">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="p-2.5 md:p-3 rounded-xl md:rounded-2xl bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white transition-colors flex-shrink-0">
                      <Settings size={20} className="md:w-6 md:h-6" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-base md:text-lg">Account Settings</h3>
                      <p className="text-xs md:text-sm text-muted-foreground line-clamp-1">Update your profile and preferences.</p>
                    </div>
                  </div>
                </Card>
              </Link>
            </div>

            <Card className="rounded-2xl md:rounded-3xl border-border/50 shadow-sm overflow-hidden">
               <CardHeader className="bg-muted/20 pb-4">
                 <CardTitle className="text-base md:text-lg flex items-center gap-2">
                   <Trophy size={18} className="text-yellow-500" />
                   Achievements
                 </CardTitle>
               </CardHeader>
               <CardContent className="py-6 md:py-8">
                 <div className="flex flex-wrap gap-3 md:gap-4 justify-center sm:justify-start">
                    {[
                      { icon: Star, label: "Early Adopter", color: "text-blue-500", bg: "bg-blue-500/10" },
                      { icon: Trophy, label: "First Post", color: "text-yellow-500", bg: "bg-yellow-500/10", locked: (user.stats?.postCount || 0) === 0 },
                      { icon: Zap, label: "Quick Learner", color: "text-purple-500", bg: "bg-purple-500/10" }
                    ].map((badge) => (
                      <div key={badge.label} className={`flex flex-col items-center gap-2 p-3 md:p-4 rounded-xl md:rounded-2xl border border-border/50 min-w-[100px] sm:min-w-[120px] transition-all ${badge.locked ? "opacity-40 grayscale" : "hover:scale-105"}`}>
                        <div className={`p-2.5 md:p-3 rounded-full ${badge.bg} ${badge.color}`}>
                          <badge.icon size={20} className="md:w-6 md:h-6" />
                        </div>
                        <span className="text-xs font-bold text-center">{badge.label}</span>
                      </div>
                    ))}
                 </div>
               </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
