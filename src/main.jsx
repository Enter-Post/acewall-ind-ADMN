import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { GlobalProvider } from "./Context/GlobalProvider";
import ScrollToTop from "./lib/scrolltop";
import { CourseProvider } from "./Context/CoursesProvider";
import { Toaster } from "./components/ui/sonner";

createRoot(document.getElementById("root")).render(
    <GlobalProvider>
      <CourseProvider>
        <BrowserRouter>
          <ScrollToTop />
          <App />
          <Toaster richColors />
        </BrowserRouter>
      </CourseProvider>
    </GlobalProvider>
);
