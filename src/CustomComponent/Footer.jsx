import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react"; // For Scroll-to-Top button

export default function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <footer className="bg-black text-white mt-10">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            {/* Column 1: School Name */}
            <div>
              <h3 className="font-semibold text-xl mb-2">Acewall Scholars</h3>
            </div>

            {/* Column 2: Address */}
            <div>
              <h4 className="font-medium text-md mb-2">Address</h4>
              <div className="space-y-1 text-sm text-gray-300">
                <p>Acewall Scholars</p>
                <p>P.O. Box 445   Powhatan, VA 23139</p>
              </div>
            </div>

            {/* Column 3: Contact */}
            <div>
              <h4 className="font-medium text-md mb-2">Contact</h4>
              <div className="text-sm text-gray-300">
                <p>Email: <a href="mailto:contact@acewallscholars.org" className="text-green-500 hover:underline">contact@acewallscholars.org</a></p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom footer */}
        <div className="bg-[#0c0c0c] py-2">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm text-gray-400">
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
