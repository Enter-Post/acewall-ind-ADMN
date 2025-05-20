import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  Mail,
  MapPin,
  Phone,
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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(`/admin/user/${id}`);
        setStudentInfo(res.data);
        console.log(res);
        
      } catch (err) {
        console.error("Error fetching student profile:", err);
      } finally {
        setLoading(false);
      }
    };
    getUser();
  }, [id]);

  if (loading) {
    return <div className="text-center py-10 text-gray-500">Loading student profile...</div>;
  }

  if (!studentInfo) {
    return <div className="text-center py-10 text-red-500">Student not found.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 bg-white rounded-xl shadow-md">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-10">
        <Avatar className="w-24 h-24 ring-3 ring-gray-500 rounded-full shadow-sm">
          <AvatarImage
            src={studentInfo?.profileImg}
            alt={studentInfo?.firstName}
            className="rounded-full h-24 object-cover"
          />
          <AvatarFallback className="bg-gray-200 text-gray-600 text-xl font-semibold flex items-center justify-center">
            {studentInfo?.firstName?.[0]}
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col justify-center text-center md:text-left">
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-2 gap-y-1">
            <p className="text-2xl font-bold text-gray-800">{studentInfo?.firstName}</p>
            {studentInfo?.middleName && (
              <p className="text-2xl font-bold text-gray-800">{studentInfo.middleName}</p>
            )}
            <p className="text-2xl font-bold text-gray-800">{studentInfo?.lastName}</p>
          </div>

          <div className="mt-3 space-y-1 text-sm text-gray-600">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <Mail className="w-4 h-4 text-gray-500" />
              <span>{studentInfo?.email}</span>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-2">
              <Phone className="w-4 h-4 text-gray-500" />
              <span>{studentInfo?.phone || "N/A"}</span>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span>{studentInfo?.homeAddress || "N/A"}</span>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span>Joined: {new Date(studentInfo?.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="flex items-center justify-center mb-10">
        <StudentProfileStatCard
          className="max-w-xs"
          icon={<School />}
          title="Enrolled Courses"
          value={studentInfo?.purchasedCourse?.length || 0}
        />
      </div>

      {/* Enrolled Courses */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Enrolled Courses</h2>
        <div className="flex flex-row gap-8 items-center flex-wrap justify-center md:justify-start">
          {studentInfo?.purchasedCourse?.length > 0 ? (
            studentInfo.purchasedCourse.map((course, index) => (
              <StudentProfileCourseCard key={index} course={course} />
            ))
          ) : (
            <p className="text-gray-500">No enrolled courses.</p>
          )}
        </div>
      </div>
    </div>
  );
}
