import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Calendar,
  Mail,
  School,
} from "lucide-react";
import { axiosInstance } from "@/lib/AxiosInstance";
import {
  StudentProfileCourseCard,
  StudentProfileStatCard,
} from "@/CustomComponent/Card";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

export default function StudentProfile() {
  const { id } = useParams();
  const [studentInfo, setStudentInfo] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(`/admin/getStudentById/${id}`);
        setStudentInfo(res.data.user);
      } catch (err) {
        console.error("Error fetching student profile:", err);
      } finally {
        setLoading(false);
      }
    };
    getUser();
  }, [id]);

  useEffect(() => {
    const getEnrolledCourses = async () => {
      try {
        const res = await axiosInstance.get(`/admin/student-enrolled-courses/${id}`);
        setEnrolledCourses(res.data.enrolledCourses);
      } catch (err) {
        console.error("Error fetching enrolled courses:", err);
      }
    };
    getEnrolledCourses();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-500">Loading student profile...</div>
    );
  }

  if (!studentInfo) {
    return (
      <div className="text-center py-10 text-red-500">Student not found.</div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 bg-white rounded-xl shadow-md space-y-10">

      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        <Avatar className="w-28 h-28 ring-2 ring-gray-300 shadow rounded-full overflow-hidden">
          <AvatarImage
            src={studentInfo.profileImg?.url}
            alt={`${studentInfo.firstName} ${studentInfo.lastName}`}
            className="w-full h-full object-cover rounded-full"
          />
          <AvatarFallback className="w-full h-full bg-gray-200 text-gray-600 text-lg font-semibold flex items-center justify-center rounded-full">
            {studentInfo.firstName?.[0]?.toUpperCase() || "?"}
          </AvatarFallback>
        </Avatar>

        <div className="text-center md:text-left space-y-2">
          <h1 className="text-2xl font-semibold text-gray-800">
            {studentInfo.firstName}{" "}
            {studentInfo.middleName && `${studentInfo.middleName} `}
            {studentInfo.lastName}
          </h1>

          <div className="text-gray-600 space-y-1 text-sm">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <Mail className="w-4 h-4 text-gray-500" />
              <span>{studentInfo.email}</span>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span>
                Joined: {new Date(studentInfo.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>


      {/* Stats Cards */}
      <div className="flex justify-center">
        <StudentProfileStatCard
          icon={<School />}
          title="Enrolled Courses"
          value={enrolledCourses.length}
        />
      </div>

      {/* Enrolled Courses */}
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Enrolled Courses
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrolledCourses.length > 0 ? (
            enrolledCourses.map((item, index) => {
              const course = item.course;
              return (
                course &&
                course.thumbnail &&
                course.courseTitle && (
                  <StudentProfileCourseCard key={index} course={course} />
                )
              );
            })
          ) : (
            <p className="text-gray-500 col-span-full">No enrolled courses.</p>
          )}
        </div>
      </section>
    </div>
  );
}
