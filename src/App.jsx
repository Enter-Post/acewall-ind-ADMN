import { Route, Routes } from "react-router-dom";
// import Layout from "./Page/StudentPortal/Layout";
// import Deshboard from "./Page/StudentPortal/Deshboard";
// import Mycourses from "./Page/StudentPortal/Courses/MyCourses";
// import Assignment from "./Page/StudentPortal/Assignment";
import Login from "./Page/Login";
// import Announcement from "./Page/StudentPortal/Announcement";
// import Account from "./Page/StudentPortal/Account";
// import Gradebook from "./Page/StudentPortal/Gradebook";
// import SignupPage from "./Page/signup";
// import AllCourses from "./Page/AllCourses";
// import AllCoursesDetail from "./Page/allCourseDetail";
// import MainLayout from "./Page/MainLayout";
import Support from "./Page/Support";
// import LandingPage from "./Page/LandingPage";
// import Messages from "./Page/StudentPortal/Messages";

// import GeneralCourses from "./Page/GeneralCourses";
// import GeneralSupport from "./Page/GeneralSupport";
// import GeneralCoursesDetail from "./Page/GeneralCourseDetail";
import TeacherDashboard from "./Page/teacher/Dashboard";
import TeacherLayout from "./Page/teacher/Layout";
// import TeacherAccount from "./Page/teacher/Account";
// import TeacherrAssessment from "./Page/teacher/TeacherAssignment";
// import TeacherAnnoucement from "./Page/teacher/TeacherAnnoucement";
import AllStudent from "./Page/teacher/AllStudent";
import StudentProfile from "./Page/teacher/studentProfile";
import TeacherCourses from "./Page/teacher/Courses/TeacherCourses";
import TeacherCourseDetails from "./Page/teacher/Courses/CourseDetail";
// import CreateCourses from "./Page/teacher/Courses/CreateCourses";
// import CoursesChapter from "./Page/teacher/Courses/CourseChapters";
// import TeacherGradebook from "./Page/teacher/Courses/Gradebook";
// import CreateAssessmentPage from "./Page/teacher/CreateAssessment";
// import AdditionalServices from "./Page/AdditionalServices";
// import About from "./Page/About";
import ScrollToTop from "./lib/scrolltop";
// import ContactUs from "./Page/ContactUs";
import { PrivateRoute, PublicRoute } from "./lib/PrivateRoutes";

// import CoursesBasis from "./Page/teacher/Courses/CoursesBasics";
import { useEffect, useState } from "react";
import { GlobalContext } from "./Context/GlobalProvider";
import { useContext } from "react";
import LoadingLoader from "./CustomComponent/LoadingLoader";
// import MainDetailPage from "./Page/StudentPortal/Courses/MainDetailPage";
// import ChapterDetail from "./Page/StudentPortal/Courses/MyCourseDetail";
// import NotFoundPage from "./Page/NotFoundPage";
import { io } from "socket.io-client";
// import ChatWindow from "./CustomComponent/MessagesCmp.jsx/chat-window";
import AllTeacher from "./Page/teacher/AllTeacher";
import TeacherProfile from "./Page/teacher/teacherProfile";
import Category from "./Page/teacher/Category";
import Subcategory from "./Page/teacher/Subcategory";
import Account from "./Page/teacher/Account";
import SchoolProfile from "./Page/teacher/Schoolproile";
import Newsletter from "./Page/teacher/Newsletter";
import ManageGradeScale from "./Page/manageGradeScale";
import GradeScaleForm from "./Page/GradeScale";

function App() {
  const { checkAuth, user, Authloading, socket, setSocket, setOnlineUser } =
    useContext(GlobalContext);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    return () => {
      connectsocket();
    };
  }, [user]);

  if (Authloading) {
    return <LoadingLoader />;
  }

  const connectsocket = () => {
    const newSocket = io("http://localhost:5050", {
      query: { userId: user?._id || "" },
    });

    setSocket(newSocket);

    newSocket.on("getOnlineUsers", (usersIds) => {
      setOnlineUser(usersIds);
    });

    newSocket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });
  };

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route
          element={
            <PublicRoute
              user={user}
              redirectTo={user?.role === "admin" ? "/admin" : "/teacher"}
            />
          }
        >
          <Route path="/" element={<Login />}></Route>
        </Route>

        {/* Admin Routes */}
        <Route element={<PrivateRoute user={user} allowedRole="admin" />}>
          <Route path="/admin" element={<TeacherLayout />}>
            <Route index element={<TeacherDashboard />} />
            <Route path="account" element={<Account />} />
            <Route path="SchoolProfile" element={<SchoolProfile />} />
            <Route path="category" element={<Category />} />
            <Route path="subcategory/:categoryName" element={<Subcategory />} />
            <Route path="allStudent" element={<AllStudent />} />
            <Route path="newsletter" element={<Newsletter />} />
            <Route path="allTeacher" element={<AllTeacher />} />
            <Route path="studentProfile/:id" element={<StudentProfile />} />
            <Route path="teacherProfile/:id" element={<TeacherProfile />} />
            <Route path="support" element={<Support />} />
            <Route path="gradescale">
              <Route index element={<GradeScaleForm />} />
              <Route path="managegradescale" element={<ManageGradeScale />} />
            </Route>
            <Route path="courses">
              <Route index element={<TeacherCourses />} />
              <Route
                path="courseDetail/:id"
                element={<TeacherCourseDetails />}
              />
            </Route>
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
