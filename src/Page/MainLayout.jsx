import * as React from "react";
import { Link, Outlet } from "react-router-dom";
import acewallscholarslogo from "../assets/acewallscholarslogo.webp";
import acewallshort from "../assets/acewallshort.png";

import { Search } from "lucide-react";
import { Input } from "../components/ui/input";
import Footer from "@/CustomComponent/Footer";
import { MultiLevelDropdown } from "@/CustomComponent/MultilevelDropdown";
import ScrollToTop from "@/lib/scrolltop";

const topBarTabs = [
  {
    label: "MORE COURSE",
    items: [
      {
        label: "History",
        subItems: [
          { label: "World History", link: "/Courses/detail" },
          { label: "US History", link: "/Courses/detail" },
          { label: "African American History", link: "/Courses/detail" },
          { label: "European History", link: "/Courses/detail" },
          { label: "Government", link: "/Courses/detail" },
        ],
      },
      {
        label: "Physics",
        subItems: [
          { label: "Classical Mechanics", onClick: () => { } },
          { label: "Electromagnetism", onClick: () => { } },
          { label: "Thermodynamics", onClick: () => { } },
          { label: "Quantum Mechanics", onClick: () => { } },
          { label: "Relativity", onClick: () => { } },
        ],
      },
      {
        label: "Mathematics",
        subItems: [
          { label: "Algebra 1", link: "/Courses/detail" },
          { label: "Algebra 2", link: "/Courses/detail" },
          { label: "Pre-Algebra", link: "/Courses/detail" },
          { label: "Geometry", link: "/Courses/detail" },
          { label: "Pre-Calculus", link: "/Courses/detail" },
          { label: "Trigonometry", link: "/Courses/detail" },
          { label: "Calculus", link: "/Courses/detail" },
        ],
      },
      {
        label: "English",
        subItems: [
          { label: "American Literature", link: "/Courses/detail" },
          { label: "World Literature", link: "/Courses/detail" },
          { label: "British Literature", link: "/Courses/detail" },
        ],
      },
      {
        label: "Culinary Arts",
        subItems: [
          { label: "Baking", link: "/Courses/detail" },
          { label: "Sauces", link: "/Courses/detail" },
          { label: "Italian Cuisine", link: "/Courses/detail" },
          { label: "French Cuisine", link: "/Courses/detail" },
          { label: "Asian Cuisine", link: "/Courses/detail" },
        ],
      },
      {
        label: "Mental Wellness",
        subItems: [
          { label: "Breath Work", link: "/Courses/" },
          { label: "Meditation/Yoga", link: "/Courses/" },
        ],
      },
      {
        label: "Engineering",
        subItems: [{ label: "Audio Engineering", link: "/Courses/" }],
      },
    ],
  },

];

const MainLayout = () => {
  return (
    <>
      <ScrollToTop />
      <div className="flex h-screen flex-col w-screen">
        <div className="h-8 bg-green-600 flex justify-end items-end px-5 cursor-pointer" />
        {/* Header Navigation */}
        <header className="sticky top-0 z-10 bg-white w-full">
          <div className="flex h-16 items-center justify-between px-4">
            {/* <div className="text-xl font-semibold">ScholarNest</div> */}
            <Link className="block md:hidden" to={"/"}>
              <img
                src={acewallshort}
                alt="Mobile Logo"
                className="w-8 rounded-full h-auto cursor-pointer"
              />
            </Link>
            <Link className="hidden md:block" to={"/"}>
              <img
                src={acewallscholarslogo}
                alt="Desktop Logo"
                className="w-40 h-auto  cursor-pointer"
              />
            </Link>

            <div className="flex justify-between items-center">

              <div className="flex gap-6">
                <Link
                  to="/courses"
                  className="text-xs md:text-sm lg:text-base font-semibold text-gray-800 hover:text-gray-900"
                >
                  More Courses
                </Link>
                <Link to="/support" className="text-xs md:text-sm lg:text-base font-semibold text-gray-800 hover:text-gray-900">
                  Support
                </Link>
                <Link to="/contactUs" className="text-xs md:text-sm lg:text-base font-semibold text-gray-800 hover:text-gray-900">
                  Contact Us
                </Link>
              </div>
            </div>


            <div className="hidden md:flex items-center space-x-4">
              <Input type="email" placeholder="Search courses and lessons" />
              <div className="bg-green-200 hover:bg-green-300 rounded-full p-2 cursor-pointer">
                <Search className="rounded-full" />
              </div>
            </div>
          </div>
        </header>
        <div className="flex flex-1 overflow-hidden">
          <main className="flex-1 hide-scrollbar overflow-y-scroll">
            <Outlet />
            <Footer />
          </main>
        </div>
      </div>
    </>
  );
};

export default MainLayout;
