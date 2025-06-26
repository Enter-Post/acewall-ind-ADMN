import * as React from "react";
import axios from "axios";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"; // Use ShadCN's Avatar
import { Link, useNavigate } from "react-router-dom";
import { GlobalContext } from "@/Context/GlobalProvider";
import { useContext } from "react";
import { toast } from "sonner";
import { axiosInstance } from "@/lib/AxiosInstance";

export function TopNavbarDropDown({ selected, setselected }) {
  const { checkAuth, user, logout, setAuthLoading } = useContext(GlobalContext);

  const tabs = [
    {
      id: 9,
      title: "Account",
      path: "/student/account",
    },
    
  ];

  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    await checkAuth();
    location.reload();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center space-x-2 cursor-pointer">
          <Avatar className="w-5 h-5">
            <AvatarImage src={user.profileImg} alt="User Avatar" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <p className="text-white flex items-center">{user.firstName}</p>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-white">
        {tabs.map((tab, index) => {
          return (
            <DropdownMenuItem
              key={index}
              asChild
            >
              <Link to={tab.path}>{tab.title}</Link>
            </DropdownMenuItem>
          );
        })}
        <DropdownMenuItem asChild>
          <button onClick={() => handleLogout()}>Logout</button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
