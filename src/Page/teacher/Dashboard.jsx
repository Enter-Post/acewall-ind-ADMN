"use client";

import { useContext, useEffect, useState } from "react";
import {
  BookOpen,
  GraduationCap,
  Users,
  MessageSquare,
  Grid2x2,
  Mail,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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


  const [recentActivity, setRecentActivity] = useState([]);
  const { user } = useContext(GlobalContext);
  const teacherId = user?._id;

  // Fetch teacher courses
  useEffect(() => {
    axiosInstance("/course/all")
      .then((res) => setCourses(res.data.courses || []))
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

  const metrics = [
    {
      title: "Courses",
      value: courses.length,
      icon: <BookOpen size={16} className="text-green-600" />,
    },
    {
      title: "Total Students",
      value: students.length,
      icon: <GraduationCap size={16} className="text-green-600" />,
    },
    {
      title: "Total Teachers",
      value: Teachers.length, // You can replace with separate user data if needed
      icon: <Users size={16} className="text-green-600" />,
    },
    {
      title: "Total Categorys",
      value: totalCategories.length,
      icon: <Grid2x2 size={16} className="text-green-600" />,
    },
     {
      title: "Total Subscribers",
      value: totalSubscribers,
      icon: <Mail size={16} className="text-green-600" />,
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
          <Card key={idx}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-gray-500">{metric.title}</CardTitle>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                {metric.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Activity and Recent Courses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">


        {/* Recent Courses */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Recent Courses</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {courses.slice(0, 3).map((course, i) => (
              <Link href={`/teacher/courses/courseDetail/${course._id}`} key={i}>
                <div className="flex gap-4 items-start border p-3 rounded-md bg-white hover:bg-gray-50 cursor-pointer">
                  <img
                    src={course.thumbnail?.url || "/placeholder.svg"}
                    alt={course.courseTitle}
                    className="w-10 h-10 object-cover rounded"
                  />
                  <div>
                    <h3 className="text-sm font-medium">{course.courseTitle}</h3>
                    <p className="text-xs text-gray-500">{course.category?.title}</p>
                  </div>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
