"use client";

import { useContext, useEffect, useState } from "react";
import { BookOpen, GraduationCap, Users, Grid2x2, Mail, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { axiosInstance } from "@/lib/AxiosInstance";
import { GlobalContext } from "@/Context/GlobalProvider";
import { Link } from "react-router-dom";

export default function TeacherDashboard() {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [Teachers, setTeachers] = useState([]);
  const [totalCategories, setTotalCategories] = useState(0);
  const [totalSubscribers, setTotalSubscribers] = useState(0);
  const [totalWithdrawalsCount, setTotalWithdrawalsCount] = useState(0); // State for total withdrawals count

  const { user } = useContext(GlobalContext);
  const teacherId = user?._id;

  // Fetch teacher courses
  useEffect(() => {
    axiosInstance("/admin/adminDeshboard")
      .then((res) => {
        console.log("Teacher Dashboard courses:", res.data);
        setCourses(res.data);
      })
      .catch(console.error);
  }, []);

  // Fetch all students
  useEffect(() => {
    axiosInstance("/admin/allstudent")
      .then((res) => {
        console.log("Teacher Dashboard all students:", res.data);
        setStudents(res.data || []);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    axiosInstance("/admin/allteacher")
      .then((res) => {
        console.log("Teacher Dashboard all students:", res.data);
        setTeachers(res.data || []);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    axiosInstance("/category/get")
      .then((res) => {
        console.log("all categories:", res.data);
        setTotalCategories(res.data.categories || []); // Access the 'categories' array
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    axiosInstance("/newsletter/subscribers")
      .then((res) => {
        setTotalSubscribers(res.data.length || 0); // Assuming `res.data` is an array of subscribers
      })
      .catch(console.error);
  }, []);

  // Fetch total withdrawals count
  useEffect(() => {
    axiosInstance("teacher/admin/withdrawals")  // Adjust the API path if needed
      .then((res) => {
        console.log("Total Withdrawals:", res.data);
        setTotalWithdrawalsCount(res.data.pagination.totalWithdrawalsCount || 0); // Access the totalWithdrawalsCount
      })
      .catch(console.error);
  }, []);

  const metrics = [
    {
      title: "Approved Courses",
      value: courses.approved,
      icon: <BookOpen size={16} className="text-green-600" />,
      link: "/admin/courses", // Route for courses
    }, {
      title: "Pending Courses",
      value: courses.pending,
      icon: <BookOpen size={16} className="text-green-600" />,
      link: "/admin/courses", // Route for courses
    },
    {
      title: "Total Students",
      value: students.length,
      icon: <GraduationCap size={16} className="text-green-600" />,
      link: "/admin/allStudent", // Route for students
    },
    {
      title: "Total Teachers",
      value: Teachers.length,
      icon: <Users size={16} className="text-green-600" />,
      link: "/admin/allTeacher", // Route for teachers
    },
    {
      title: "Total Topics",
      value: totalCategories.length,
      icon: <Grid2x2 size={16} className="text-green-600" />,
      link: "/admin/category", // Route for categories
    },
    {
      title: "Total SubTopics",
      value: totalSubscribers,
      icon: <Mail size={16} className="text-green-600" />,
      link: "/admin/newsletter", // Route for newsletter
    },
    {
      title: "Total Withdrawals", // New card for total withdrawals
      value: totalWithdrawalsCount,
      icon: <DollarSign size={16} className="text-green-600" />,
      link: "/admin/withdrawals", // Route for withdrawals
    },
  ];

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-white bg-acewall-main p-4 rounded-md mb-6">
        Dashboard
      </h1>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {metrics.map((metric, idx) => (
          <Link to={metric.link} key={idx}>
            <Card className="cursor-pointer hover:shadow-lg transition">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm text-gray-500">
                  {metric.title}
                </CardTitle>
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  {metric.icon}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      
    </div>
  );
}
