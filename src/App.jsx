import { Route, Routes } from "react-router-dom";
import Login from "./Page/Login";
import Support from "./Page/Support";
import GeneralCoursesDetail from "./Page/teacher/Courses/GeneralCourseDetail";
import TeacherDashboard from "./Page/teacher/Dashboard";
import TeacherLayout from "./Page/teacher/Layout";
import AllStudent from "./Page/teacher/AllStudent";
import StudentProfile from "./Page/teacher/studentProfile";
import TeacherCourses from "./Page/teacher/Courses/TeacherCourses";
import TeacherCourseDetails from "./Page/teacher/Courses/CourseDetail";
import ScrollToTop from "./lib/scrolltop";
import { PrivateRoute, PublicRoute } from "./lib/PrivateRoutes";
import { useEffect, useState } from "react";
import { GlobalContext } from "./Context/GlobalProvider";
import { useContext } from "react";
import LoadingLoader from "./CustomComponent/LoadingLoader";
import { io } from "socket.io-client";
import AllTeacher from "./Page/teacher/AllTeacher";
import TeacherProfile from "./Page/teacher/teacherProfile";
import Category from "./Page/teacher/Category";
import Subcategory from "./Page/teacher/Subcategory";
import Newsletter from "./Page/teacher/Newsletter";

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
              redirectTo={user?.role === "admin" ? "/admin" : "/admin"}
            />
          }
        >
          <Route path="/" element={<Login />}></Route>
        </Route>

        {/* Admin Routes */}
        <Route element={<PrivateRoute user={user} allowedRole="admin" />}>
          <Route path="/admin" element={<TeacherLayout />}>
            <Route index element={<TeacherDashboard />} />
            <Route path="category" element={<Category />} />
            <Route path="subcategory/:categoryName" element={<Subcategory />} />
            <Route path="allStudent" element={<AllStudent />} />
            <Route path="newsletter" element={<Newsletter />} />
            <Route path="allTeacher" element={<AllTeacher />} />
            <Route path="studentProfile/:id" element={<StudentProfile />} />
            <Route path="teacherProfile/:id" element={<TeacherProfile />} />
            <Route path="support" element={<Support />} />
            <Route path="courses">
              <Route index element={<TeacherCourses />} />
              <Route path="courseDetail/:id" element={<TeacherCourseDetails />} />
              <Route path="generalcoursesdetailpage/:id" element={<GeneralCoursesDetail />} />
            </Route>

          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
