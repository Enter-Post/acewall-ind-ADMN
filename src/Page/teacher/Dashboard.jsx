"use client";

import { useContext, useEffect, useState } from "react";
import {
  BookOpen,
  GraduationCap,
  Users,
  MessageSquare,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { axiosInstance } from "@/lib/AxiosInstance";
import { GlobalContext } from "@/Context/GlobalProvider";

export default function TeacherDashboard() {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [Teachers, setTeachers] = useState([]);
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

  // Fetch recent comments
  useEffect(() => {
    axiosInstance(`/comment/teacher/${teacherId}/comments`)
      .then((res) => {
        const formatted = res.data.comments.map((comment) => ({
          user: `${comment.createdby.firstName} ${comment.createdby.lastName}`,
          action: "commented on",
          target: comment.course?.basics?.courseTitle || "a course",
          time: new Date(comment.createdAt).toLocaleString("en-US", {
            dateStyle: "medium",
            timeStyle: "short",
          }),
        }));
        setRecentActivity(formatted);
      })
      .catch(console.error);
  }, [teacherId]);

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
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Recent Comments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, i) => (
                <div key={i} className="flex gap-4 items-start border p-3 rounded-md bg-white">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                    <MessageSquare size={16} />
                  </div>
                  <div>
                    <p className="text-sm">
                      <span className="font-medium">{activity.user}</span> {activity.action}{" "}
                      <span className="font-medium text-gray-800">{activity.target}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No recent activity to show.</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Courses */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Recent Courses</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {courses.slice(0, 3).map((course, i) => (
              <div key={i} className="flex gap-4 items-start border p-3 rounded-md bg-white">
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
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
