import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart } from "lucide-react";

interface CommentCardProps {
  name: string;
  avatar?: string;
  date: string;
  content: string;
  likes?: number;
}

const CommentCard = ({ ...props }: CommentCardProps) => {
  return (
    <div className="flex items-start gap-3">
      <Avatar className="h-10 w-10 mt-1">
        <AvatarImage src={props.avatar} alt={props.name} />
        <AvatarFallback>{props.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <span className="font-medium">{props.name}</span>
          <span className="text-xs text-muted-foreground">{props.date}</span>
        </div>
        <p className="text-sm">{props.content}</p>
        <div className="mt-2 flex items-center gap-4">
          <button className="text-xs text-muted-foreground flex items-center hover:text-foreground">
            <Heart className="h-3 w-3 mr-1" />
            {props.likes ?? 0}
          </button>
          <button className="text-xs text-muted-foreground hover:text-foreground">
            Reply
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentCard;
