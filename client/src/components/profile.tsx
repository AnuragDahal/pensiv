import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { getInitials } from "@/lib/utils";

const Profile = ({ name, avatar }: { name: string; avatar: string }) => {
  return (
    <div>
      <Avatar>
        <AvatarImage src={avatar} alt={name} />
        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
          {getInitials(name ?? "U")}
        </AvatarFallback>
      </Avatar>
    </div>
  );
};

export default Profile;
