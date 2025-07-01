import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"; // Use ShadCN's Avatar
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { axiosInstance } from "@/lib/AxiosInstance";
import { useContext } from "react";
import { GlobalContext } from "@/Context/GlobalProvider";
import { toast } from "sonner";

export function TeacherTopNavbarDropDown({ selected, setselected }) {
  const { user, checkAuth, logout, setAuthLoading } = useContext(GlobalContext);

  const tabs = [
    // {
    //   id: 9,
    //   title: "Account",
    //   path: "/admin/account",
    // },
  ];

  const navigate = useNavigate();
  // console.log(user);

  const handleLogout = async () => {
    logout();
    checkAuth();
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
          <p className="text-white flex items-center">Admin</p>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-white">
        {tabs.map((tab, index) => {
          return (
            <DropdownMenuItem
              key={index}
              className={
                selected == tab.id &&
                "bg-green-500 hover:bg-green-600 text-white"
              }
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