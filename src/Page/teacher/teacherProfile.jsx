import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Calendar, Mail, School } from "lucide-react";
import { TeacherProfileStatCard } from "@/CustomComponent/Card";
import { axiosInstance } from "@/lib/AxiosInstance";
import { toast } from "sonner"; 
import BackButton from "@/CustomComponent/BackButton";

export default function TeacherProfile() {
  const { id } = useParams();
  const [teacherInfo, setTeacherInfo] = useState(null);
  const [teacherLoading, setTeacherLoading] = useState(true);
  const [courseLoading, setCourseLoading] = useState(true);
  const [teacherCourses, setTeacherCourses] = useState([]);

  const fetchTeacher = async () => {
    setTeacherLoading(true);
    try {
      const res = await axiosInstance.get(`/admin/getTeacherById/${id}`);
      console.log(res, "teacher Info");
      setTeacherInfo(res.data.teacher);
    } catch (err) {
      console.error("Failed to fetch teacher:", err);
      setTeacherInfo(null);
    } finally {
      setTeacherLoading(false);
    }
  };

  useEffect(() => {
    fetchTeacher();
  }, [id]);

  useEffect(() => {
    if (!id) return;
    setCourseLoading(true);

    const getCourses = async () => {
      try {
        const response = await axiosInstance.get("/course/getCoursesforadminofteacher", {
          params: { teacherId: id },
        });
        setTeacherCourses(response.data.courses);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setTeacherCourses([]);
      } finally {
        setCourseLoading(false);
      }
    };

    getCourses();
  }, [id]);

  const updateDocumentStatus = async (docId, status) => {
    await axiosInstance
      .patch(`auth/verify-document/${id}/${docId}`, { status })
      .then((res) => {
        toast.success(`Document ${status === "verified" ? "verified" : "rejected"} successfully`);
        fetchTeacher()
      })
      .catch((err) => {
        console.error("Failed to update document status:", err);
        toast.error("Failed to update document status");
      });

  };

  if (teacherLoading || courseLoading) {
    return <p className="text-center py-20 text-gray-500">Loading profile and courses...</p>;
  }

  if (!teacherInfo) {
    return <p className="text-center py-20 text-red-500">Teacher not found.</p>;
  }

  const [firstName, ...rest] = (teacherInfo.firstName
    ? [teacherInfo.firstName, teacherInfo.middleName, teacherInfo.lastName].filter(Boolean)
    : teacherInfo.name?.split(" ") || []) || [];
  const lastName = rest.length > 1 ? rest.pop() : rest[0] || "";
  const middleName = rest.length > 1 ? rest.join(" ") : "";

  const joinedDate = new Date(teacherInfo.joiningDate ?? teacherInfo.createdAt).toLocaleDateString(
    undefined,
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white rounded-xl shadow-lg">
      <BackButton label="Go Back" className="mb-4" />

      {/* Profile Section */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12">
        <Avatar className="w-28 h-28 ring-2 ring-gray-300 shadow rounded-full overflow-hidden">
          <AvatarImage
            src={teacherInfo.profileImg?.url}
            alt={`${teacherInfo.firstName} ${teacherInfo.lastName}`}
            className="w-full h-full object-cover rounded-full"
          />
          <AvatarFallback className="w-full h-full bg-gray-200 text-gray-600 text-lg font-semibold flex items-center justify-center rounded-full">
            {teacherInfo.firstName?.[0]?.toUpperCase() || "?"}
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col w-full justify-center text-center md:text-left max-w-xl">
          <h1 className="text-4xl font-extrabold text-gray-900 leading-tight flex flex-wrap justify-center md:justify-start gap-1">
            <span>{firstName}</span>
            {middleName && <span>{middleName}</span>}
            <span>{lastName}</span>
          </h1>

          {/* Verification Status Badge */}
          <div className="mt-4">
            {teacherInfo.isVarified ? (
              <span className="inline-block bg-green-100 text-green-800 text-sm font-semibold px-4 py-1 rounded-full shadow-sm">
                ✅ Verified Teacher
              </span>
            ) : (
              <span className="inline-block bg-yellow-100 text-yellow-800 text-sm font-semibold px-4 py-1 rounded-full shadow-sm">
                ⏳ Not Verified
              </span>
            )}
          </div>

          <div className="mt-6 space-y-3 text-gray-600 text-sm">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <Mail className="w-5 h-5 text-green-500" />
              <span>{teacherInfo.email}</span>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-3">
              <Calendar className="w-5 h-5 text-green-500" />
              <span>Joined on {joinedDate}</span>
            </div>
          </div>

          {teacherInfo.Bio && (
            <p className="mt-6 text-gray-700 text-base">{teacherInfo.Bio}</p>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="flex justify-center mb-8">
        <TeacherProfileStatCard
          className="max-w-xs"
          icon={<School className="text-green-600" />}
          title="Published Courses"
          value={teacherCourses.length}
        />
      </div>

      {/* Courses */}
      <div>
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Courses by {firstName}</h2>
        {teacherCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {teacherCourses.map((course, idx) => (
              <Link
                to={`/admin/courses/courseDetail/${course._id}`}
                key={idx}
                className="rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300 block"
              >
                <img
                  src={course?.thumbnail?.url ?? ""}
                  alt={course?.courseTitle ?? "Course Thumbnail"}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {course?.courseTitle ?? "Untitled Course"}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No courses published yet.</p>
        )}
      </div>

      {/* Documents */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Uploaded Documents</h2>
        {teacherInfo.documents && teacherInfo.documents.length > 0 ? (
          <ul className="space-y-4">
            {teacherInfo.documents.map((doc) => (
              <li
                key={doc._id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-gray-50 border border-gray-200 rounded-md shadow-sm  transition"
              >
                <div>
                  <p className="text-lg font-medium text-gray-800">{doc.name}</p>
                  <p className="text-sm text-gray-600">
                    Status:{" "}
                    <span
                      className={
                        doc.verificationStatus === "verified"
                          ? "text-green-600 font-semibold"
                          : doc.verificationStatus === "not_verified"
                            ? "text-red-600 font-semibold"
                            : "text-yellow-600 font-semibold"
                      }
                    >
                      {doc.verificationStatus}
                    </span>
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 items-center">
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                  >
                    View
                  </a>
                  {doc.verificationStatus === "pending" && (
                    <>
                      <button
                        onClick={() => updateDocumentStatus(doc._id, "verified")}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => updateDocumentStatus(doc._id, "not_verified")}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500">No documents uploaded yet.</p>
        )}
      </div>
    </div>
  );
};

