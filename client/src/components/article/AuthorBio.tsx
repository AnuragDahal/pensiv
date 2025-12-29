import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Github, Linkedin, Twitter, Globe } from "lucide-react";

interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  portfolio?: string;
}

interface AuthorBioProps {
  name: string;
  avatar?: string;
  bio?: string;
  socialLinks?: SocialLinks;
}

const AuthorBio: React.FC<AuthorBioProps> = ({ name, avatar, bio, socialLinks }) => (
  <div className="mt-8 flex flex-col sm:flex-row gap-4 p-6 rounded-xl bg-muted/30 border border-border/50">
    <Avatar className="h-16 w-16 flex-shrink-0">
      <AvatarImage src={avatar} alt={name} />
      <AvatarFallback>{name.charAt(0)}</AvatarFallback>
    </Avatar>
    <div className="flex-1">
      <h3 className="font-medium text-lg">{name}</h3>
      <p className="text-muted-foreground mt-1 text-sm">{bio ?? ""}</p>

      {/* Social Links - Horizontal Layout */}
      {socialLinks && Object.values(socialLinks).some((link) => link) && (
        <div className="flex items-center gap-3 mt-3 flex-wrap">
          {socialLinks.github && (
            <a
              href={socialLinks.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
              aria-label="GitHub"
            >
              <Github size={14} />
              <span>GitHub</span>
            </a>
          )}
          {socialLinks.linkedin && (
            <a
              href={socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin size={14} />
              <span>LinkedIn</span>
            </a>
          )}
          {socialLinks.twitter && (
            <a
              href={socialLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
              aria-label="Twitter"
            >
              <Twitter size={14} />
              <span>Twitter</span>
            </a>
          )}
          {socialLinks.portfolio && (
            <a
              href={socialLinks.portfolio}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
              aria-label="Portfolio"
            >
              <Globe size={14} />
              <span>Portfolio</span>
            </a>
          )}
        </div>
      )}

      <Button variant="outline" className="mt-3 rounded-full text-xs">
        Follow
      </Button>
    </div>
  </div>
);

export default AuthorBio;
