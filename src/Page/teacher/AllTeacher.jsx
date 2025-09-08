import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { TeacherCard } from "@/CustomComponent/Card";
import { axiosInstance } from "@/lib/AxiosInstance";

const AllTeacher = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("verified");
  const [searchTerm, setSearchTerm] = useState(""); // Search input state

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
            isVarified: t.isVarified || false,
            courses: Array.from({ length: t.courses ?? 0 }),
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

  const verifiedTeachers = teachers.filter((t) => t.isVarified);
  const notVerifiedTeachers = teachers.filter((t) => !t.isVarified);

  const filteredTeachers =
    activeTab === "verified" ? verifiedTeachers : notVerifiedTeachers;

  // Apply search filter to teachers based on name or email
  const searchedTeachers = filteredTeachers.filter(
    (teacher) =>
      teacher.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">All Teachers</h1>

      {/* Search Input */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 w-full border rounded-md"
        />
      </div>

      {/* Tabs with counts */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("verified")}
          className={`px-4 py-2 rounded-md font-medium ${
            activeTab === "verified"
              ? "bg-green-600 text-white"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          Verified ({verifiedTeachers.length})
        </button>
        <button
          onClick={() => setActiveTab("not_verified")}
          className={`px-4 py-2 rounded-md font-medium ${
            activeTab === "not_verified"
              ? "bg-red-600 text-white"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          Not Verified ({notVerifiedTeachers.length})
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading teachers...</p>
      ) : searchedTeachers.length === 0 ? (
        <p className="text-gray-500">
          No teachers found with that search term.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {searchedTeachers.map((teacher) => (
            <Link key={teacher.id} to={`/admin/teacherProfile/${teacher.id}`}>
              <TeacherCard teacher={teacher} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllTeacher;
