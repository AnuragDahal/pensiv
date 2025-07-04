import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface AuthorBioProps {
  name: string;
  avatar?: string;
  bio?: string;
}

const AuthorBio: React.FC<AuthorBioProps> = ({ name, avatar, bio }) => (
  <div className="mt-8 flex flex-col sm:flex-row gap-4 p-6 rounded-xl bg-muted/30 border border-border/50">
    <Avatar className="h-16 w-16">
      <AvatarImage src={avatar} alt={name} />
      <AvatarFallback>{name.charAt(0)}</AvatarFallback>
    </Avatar>
    <div>
      <h3 className="font-medium text-lg">{name}</h3>
      <p className="text-muted-foreground mt-1">{bio ?? ""}</p>
      <Button variant="outline" className="mt-3 rounded-full text-xs">
        Follow
      </Button>
    </div>
  </div>
);

export default AuthorBio;
