import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { StudentCard } from "@/CustomComponent/Card";
import { axiosInstance } from "@/lib/AxiosInstance";

const AllStudent = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axiosInstance.get("/admin/allStudent");
        const rawStudents = Array.isArray(res.data)
          ? res.data
          : res.data.users || [];
        console.log(res);

        const normalized = rawStudents.map((s, i) => {
          const cleanName = s.name?.replace(/<[^>]+>/g, "").trim() || "Unknown";
          const nameParts = cleanName.split(/\s+/);
          const firstName = s.firstName || nameParts[0] || "NoName";
          const lastName = s.lastName || nameParts.slice(1).join(" ") || "";

          return {
            _id: s._id || s.id || `student-${i}`,
            firstName,
            lastName,
            email: s.email || "N/A",
            createdAt: s.joiningDate || new Date().toISOString(),
            numberOfCourses: Array.isArray(s.purchasedCourse)
              ? s.purchasedCourse.length
              : s.numberOfCourses ?? 0,
            profileImg:
              s.profileImg ||
              `https://randomuser.me/api/portraits/lego/${i % 10}.jpg`,
          };
        });

        setStudents(normalized);
      } catch (err) {
        console.error("Error fetching students:", err);
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        All Students{" "}
        <span className="font-normal text-gray-500">({students.length})</span>
      </h1>

      {loading ? (
        <p className="text-gray-500">Loading students...</p>
      ) : students.length === 0 ? (
        <p className="text-gray-500">No students found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {students.map((student) => (
            <StudentCard student={student} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AllStudent;
