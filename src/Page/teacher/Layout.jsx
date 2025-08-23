import * as React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import acewallscholarslogo from "../../assets/acewallscholarslogo.webp";
import acewallshort from "../../assets/acewallshort.png";
import {
  Menu,
  GraduationCap,
  Users,
  Headset,
  School,
  Mails,
  BookPlus,
  NotebookPen,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { TeacherTopNavbarDropDown } from "@/CustomComponent/TeacherTopNavDropDown";
import { DashboardCircleAddIcon } from "@/assets/Icons/deshboard";
import { Book02Icon } from "@/assets/Icons/mycoursesIcon";
import { Megaphone02Icon } from "@/assets/Icons/Announcement";
import Footer from "@/CustomComponent/Footer";
import { useContext } from "react";
import { GlobalContext } from "@/Context/GlobalProvider";
import { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { axiosInstance } from "@/lib/AxiosInstance";
import { Avatar } from "@radix-ui/react-avatar";
const sideBarTabs = [
  {
    id: 1,
    name: "Dashboard",
    icon: <DashboardCircleAddIcon />,
    path: "/admin",
  },
  { id: 2, name: "All Courses", icon: <Book02Icon />, path: "/admin/courses" },
  {
    id: 3,
    name: "Category",
    icon: <Megaphone02Icon />,
    path: "/admin/Category",
  },

  {
    id: 4,
    name: "Teachers",
    icon: <Users />,
    path: "/admin/allTeacher",
  },
  {
    id: 5,
    name: "Students",
    icon: <GraduationCap />,
    path: "/admin/allStudent",
  },
  {
    id: 6,
    name: "Support",
    icon: <Headset />,
    path: "/admin/support",
  },

  {
    id: 7,
    name: "Newsletter",
    icon: <Mails />,
    path: "/admin/Newsletter",
  },
  {
    id: 8,
    name: "Withdrawals",
    icon: <BookPlus />,
    path: "/admin/withdrawals",
  },

];

export default function TeacherLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { checkAuth, user, Authloading, setAuthLoading } =
    useContext(GlobalContext);

  const location = useLocation().pathname;

  const [searchQuery, setSearchQuery] = React.useState("");
  const [dropdownCourses, setDropdownCourses] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [openDropdown, setOpenDropdown] = React.useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim() || loading) return;

    setLoading(true);
    setOpenDropdown(false); // Ensure dropdown is closed while loading

    try {
      const res = await axiosInstance.get("/course/getindividualcourse", {
        params: { search: searchQuery },
      });

      const courses = res.data.courses || [];
      setDropdownCourses(courses);
    } catch (error) {
      console.error("Search error:", error);
      setDropdownCourses([]); // To show "No results found"
    } finally {
      setLoading(false);
      setOpenDropdown(true); // ✅ Open dropdown only after data is ready
    }
  };

  return (
    <div className="flex flex-col">
      <header className="sticky top-0 z-10 bg-white">
        <div className="h-8 bg-green-600 flex justify-end items-center px-5 cursor-pointer">
          <TeacherTopNavbarDropDown />
        </div>
        <div className="flex h-16 items-center justify-between px-4 border">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
          <Link to="/admin" className="block md:hidden">
            <img
              src={acewallshort}
              alt="Mobile Logo"
              className="w-8 rounded-full h-auto cursor-pointer"
            />
          </Link>
          <Link to="/admin" className="hidden md:block">
            <img
              src={acewallscholarslogo}
              alt="Desktop Logo"
              className="w-40 h-auto cursor-pointer"
            />
          </Link>
          <div className="flex justify-between items-center">
            <div className="flex gap-6"></div>
          </div>


        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside
          className={`bg-white ${isSidebarOpen ? "block" : "hidden"
            } w-screen md:w-64 flex-shrink-0 overflow-y-auto md:block`}
        >
          <div className="p-4">
            <div className="flex items-center space-x-3 pb-4">
              <div>
                <p
                  className="text-sm text-gray-600 w-full  break-words"
                  title={user.email}

                >
                  {user.email}
                </p>
              </div>
            </div>
            <nav className="space-y-2">
              {sideBarTabs.map((tab) => (
                <Link
                  key={tab.name}
                  to={tab.path}
                  onClick={() => {
                    setIsSidebarOpen(false);
                  }}
                  className={`flex items-center space-x-3 rounded-lg px-3 py-2 ${location == tab.path ? "bg-green-500" : "text-black"
                    } `}
                >
                  <p>{tab.icon}</p>
                  <span
                    className={`${location == tab.path ? "text-white" : "text-green-600"
                      }`}
                  >
                    {tab.name}
                  </span>
                </Link>
              ))}
            </nav>
            <div className="rounded-full flex flex-col items-center justify-between mt-10 w-full">
              <img src={acewallshort} alt="" className="w-1/2" />
              <Link
                to="https://www.acewallscholars.org/contact-Us"
                className="text-center font-semibold text-sm mt-4 text-acewall-main"
              >
                Need Tutoring? Contact us
              </Link>
            </div>
          </div>
        </aside>
        <main className="flex-1 p-2 md:p-4 hide-scrollbar overflow-y-scroll w-full">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
}
