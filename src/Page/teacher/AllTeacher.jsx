import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { TeacherCard } from "@/CustomComponent/Card";
import { axiosInstance } from "@/lib/AxiosInstance";

const AllTeacher = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get("/admin/allTeacher")
      .then((res) => {
        const rawTeachers = Array.isArray(res.data) ? res.data : res.data.teachers;

        const normalized = (rawTeachers || []).map((t, i) => {
          const cleanName = t.name?.replace(/<[^>]+>/g, "").trim() || "Unknown";
          const nameParts = cleanName.split(/\s+/);
          const firstName = nameParts[0] || "NoName";
          const lastName = nameParts.slice(1).join(" ") || "";

          return {
            id: t._id || t.id || `teacher-${i}`,
            firstName,
            lastName,
            email: t.email || "N/A",
            createdAt: t.joiningDate || new Date().toISOString(),
            courses: Array.from({ length: t.courses ?? 0 }), // convert number to array
            profileImg: t.profileImg || `https://randomuser.me/api/portraits/lego/${i % 10}.jpg`,
          };
        });

        setTeachers(normalized);
      })
      .catch((err) => {
        console.error("Error fetching teachers:", err);
        setTeachers([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        All Teachers{" "}
        <span className="font-normal text-gray-500">({teachers.length})</span>
      </h1>

      {loading ? (
        <p className="text-gray-500">Loading teachers...</p>
      ) : teachers.length === 0 ? (
        <p className="text-gray-500">No teachers found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {teachers.map((teacher) => (
            <Link key={teacher.id} to={`/teacher/teacherProfile/${teacher.id}`}>
              <TeacherCard teacher={teacher} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllTeacher;
