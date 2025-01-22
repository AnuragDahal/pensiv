import React from "react";
import { Input } from "@/components/ui/input";
import { Bell, Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const NavBar = () => {
  return (
    <div className="bg-black w-full px-6 text-white overflow-hidden flex py-6 justify-between md:justify-around items-center">
      <div className="font-bold text-xl">MetaBlog</div>
      <ul className="hidden md:flex md:gap-10">
        <li>Home</li>
        <li>Blog</li>
        <li>SinglePost</li>
        <li>Pages</li>
        <li>Contact</li>
      </ul>
      <div className="md:flex gap-1 relative hidden">
        <Search className="absolute top-1 left-1" />
        <Input />
      </div>
      <div className="flex gap-2 items-center">
        <Bell fill=""/>
        <Avatar className="w-[30px] h-[30px]">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>AD</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
};

export default NavBar;
