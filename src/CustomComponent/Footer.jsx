import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import TermsModal from "@/CustomComponent/Termsandcondition";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  ArrowUp,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import PrivacyPolicy from "./PrivacePolicy";
import { useEffect, useState } from "react";

export default function Footer() {
  const location = useLocation().pathname;

  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const usefulLinks = [
    { name: "Home", url: "/" },
    { name: "About Us", url: "/about" },
    { name: "Additional Services", url: "/AdditionalServices" },
  ];

  const popularCourses = [
    { name: "Cell Biology", url: "/Courses/detail" },
    { name: "Calculus", url: "/Courses/detail" },
    { name: "American Literature", url: "/Courses/detail" },
    { name: "Momentum and Energy", url: "/Courses/detail" },
    { name: "Thermodynamics", url: "/Courses/detail" },
  ];

  const socialLinks = [
    { Icon: Twitter, url: "https://twitter.com/AcewallScholars" },
    { Icon: Facebook, url: "https://www.facebook.com/acewallscholars" },
    {
      Icon: Instagram,
      url: "https://www.instagram.com/acewallscholarsonline/",
    },
    {
      Icon: Youtube,
      url: "https://youtube.com/channel/UCR7GG6Dvnuf6ckhTo3wqSIQ",
    },
    { Icon: Mail, url: "mailto:contact@acewallscholars.org" },
  ];

  return (
    <>
      <footer className="bg-black text-white mt-10">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Column 1: Acewall Scholars */}
            <div>
              <h3 className="font-semibold text-white mb-4">Acewall Scholars</h3>
              <div className="space-y-2 text-sm text-gray-300">
                <p>Acewall Scholars</p>
                <p>P.O. Box 445</p>
                <p>Powhatan, VA 23139</p>
                <p>Email: contact@acewallscholars.org</p>
              </div>
            </div>

            {/* Column 2: Useful Links */}
            <div>
              <h3 className="font-semibold text-white mb-4">Useful Links</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                {usefulLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.url}
                      onClick={link.func ? link.func : undefined}
                      className="flex items-center hover:text-white"
                    >
                      <span className="text-green-500 mr-2">›</span>
                      <p>{link.name}</p>
                    </Link>
                  </li>
                ))}
                <li className="flex cursor-pointer items-center">
                  <span className="text-green-500 mr-2">›</span> <TermsModal />
                </li>
                <li className="flex cursor-pointer items-center">
                  <span className="text-green-500 mr-2">›</span> <PrivacyPolicy />
                </li>
              </ul>
            </div>

            {/* Column 3: Popular Courses */}
            <div>
              <h3 className="font-semibold text-white mb-4">Popular Courses</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                {popularCourses.map((course, index) => (
                  <li key={index}>
                    <Link
                      to={course.url}
                      className="flex items-center hover:text-white"
                    >
                      <span className="text-green-500 mr-2">›</span>{" "}
                      {course.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Newsletter */}
            <div>
              <h3 className="font-semibold text-white mb-4">
                Join Our Newsletter
              </h3>
              <p className="text-sm text-gray-300 mb-4">
                Stay updated with our latest news and offers.
              </p>
              <div className="flex">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="rounded-l-md rounded-r-none border-gray-700 bg-black text-white focus:ring-0 focus:border-gray-600"
                />
                <Button className="rounded-l-none bg-green-500 hover:bg-green-600 text-white">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom footer */}
        <div className="bg-[#0c0c0c] py-4">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-gray-400 text-center md:text-left">
                © Copyright{" "}
                <a
                  href="https://www.acewallscholars.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-500 font-bold hover:underline"
                >
                  Acewall Scholars
                </a>{" "}
                All Rights Reserved
              </p>
              <div className="flex space-x-2 mt-4 md:mt-0">
                {socialLinks.map(({ Icon, url }, index) => (
                  <a
                    key={index}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg transition-all duration-300"
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      )}
    </>
  );
}
