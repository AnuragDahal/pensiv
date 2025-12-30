import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { getInitials } from "@/lib/utils";

interface ProfileProps {
  name: string;
  avatar: string;
  size?: "sm" | "md" | "lg";
}

const Profile = ({ name, avatar, size = "md" }: ProfileProps) => {
  const sizeClasses = {
    sm: "h-6 w-6 text-xs",
    md: "h-8 w-8 text-sm",
    lg: "h-10 w-10 text-base",
  };

  return (
    <div>
      <Avatar className={sizeClasses[size]}>
        <AvatarImage src={avatar} alt={name} />
        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
          {getInitials(name ?? "U")}
        </AvatarFallback>
      </Avatar>
    </div>
  );
};

export default Profile;
