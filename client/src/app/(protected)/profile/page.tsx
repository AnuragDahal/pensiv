"use client";

import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Mail, Calendar, MapPin, Link as LinkIcon, Edit2, FileText, Settings, Star, Trophy, Zap, User } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="relative mb-12">
          <div className="h-48 w-full rounded-3xl bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 animate-gradient-x border border-border/50 overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.5))]" />
          </div>
          <div className="absolute -bottom-10 left-8 md:left-12 flex items-end gap-6">
            <div className="h-32 w-32 rounded-3xl border-4 border-background bg-muted shadow-xl overflow-hidden group">
              {user.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="h-full w-full object-cover transition-transform group-hover:scale-110" 
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-primary/10 text-primary">
                  <User size={48} />
                </div>
              )}
            </div>
            <div className="pb-4 hidden sm:block">
              <h1 className="text-3xl font-extrabold tracking-tight">{user.name}</h1>
              <p className="text-muted-foreground font-medium">{user.email}</p>
            </div>
          </div>
          <div className="absolute bottom-4 right-8 md:right-12">
            <Link href="/settings">
              <Button className="rounded-2xl gap-2 font-bold shadow-lg shadow-primary/20 px-6">
                <Edit2 size={16} />
                Edit Profile
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {/* Left Column: About & Stats */}
          <div className="space-y-6">
            <Card className="rounded-2xl border-border/50 shadow-sm overflow-hidden">
              <CardHeader className="bg-muted/30">
                <CardTitle className="text-lg">About</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  {user.bio || "No biography provided yet. Tell the world who you are!"}
                </p>
                <Separator className="bg-border/50" />
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Mail size={16} className="text-primary" />
                    {user.email}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Calendar size={16} className="text-primary" />
                    Joined December 2023
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <MapPin size={16} className="text-primary" />
                    San Francisco, CA
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-border/50 shadow-sm overflow-hidden">
              <CardHeader className="bg-muted/30">
                <CardTitle className="text-lg">Stats</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                    <p className="text-2xl font-bold text-primary">{user.stats?.postCount || 0}</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Articles</p>
                  </div>
                  <div className="p-4 rounded-xl bg-accent/5 border border-accent/10">
                    <p className="text-2xl font-bold text-accent">{user.stats?.totalLikes || 0}</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Likes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Profile Summary/Overview */}
          <div className="md:col-span-2 space-y-8">
            <div className="flex items-center gap-4 mb-2">
              <h2 className="text-xl font-bold">Quick Overview</h2>
              <div className="h-px flex-1 bg-border/50" />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Link href="/article?author=me" className="group">
                <Card className="rounded-3xl border-border/50 shadow-sm hover:shadow-md hover:border-primary/30 transition-all p-6 bg-gradient-to-br from-primary/5 to-transparent">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                      <FileText size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">My Articles</h3>
                      <p className="text-sm text-muted-foreground">Manage and view your published stories.</p>
                    </div>
                  </div>
                </Card>
              </Link>
              
              <Link href="/settings" className="group">
                <Card className="rounded-3xl border-border/50 shadow-sm hover:shadow-md hover:border-accent/30 transition-all p-6 bg-gradient-to-br from-accent/5 to-transparent">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                      <Settings size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Account Settings</h3>
                      <p className="text-sm text-muted-foreground">Update your profile and preferences.</p>
                    </div>
                  </div>
                </Card>
              </Link>
            </div>

            <Card className="rounded-3xl border-border/50 shadow-sm overflow-hidden">
               <CardHeader className="bg-muted/20">
                 <CardTitle className="text-lg flex items-center gap-2">
                   <Trophy size={18} className="text-yellow-500" />
                   Achievements
                 </CardTitle>
               </CardHeader>
               <CardContent className="py-8">
                 <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                    {[
                      { icon: Star, label: "Early Adopter", color: "text-blue-500", bg: "bg-blue-500/10" },
                      { icon: Trophy, label: "First Post", color: "text-yellow-500", bg: "bg-yellow-500/10", locked: (user.stats?.postCount || 0) === 0 },
                      { icon: Zap, label: "Quick Learner", color: "text-purple-500", bg: "bg-purple-500/10" }
                    ].map((badge) => (
                      <div key={badge.label} className={`flex flex-col items-center gap-2 p-4 rounded-2xl border border-border/50 min-w-[120px] transition-all ${badge.locked ? "opacity-40 grayscale" : "hover:scale-105"}`}>
                        <div className={`p-3 rounded-full ${badge.bg} ${badge.color}`}>
                          <badge.icon size={24} />
                        </div>
                        <span className="text-xs font-bold">{badge.label}</span>
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
