import { useEffect, useState } from "react";
import { StudentCard } from "@/CustomComponent/Card";
import { axiosInstance } from "@/lib/AxiosInstance";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Search } from "lucide-react";
import BackButton from "@/CustomComponent/BackButton";

const AllStudent = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [courseFilter, setCourseFilter] = useState("");

  // Fetch students and their enrolled courses
  const fetchStudents = async (pageNumber = 1, searchQuery = "") => {
    setLoading(true);
    try {
      // 1️⃣ Fetch students
      const res = await axiosInstance.get(
        `/admin/allStudent?page=${pageNumber}&limit=6&search=${searchQuery}`
      );
      const rawStudents = Array.isArray(res.data.students)
        ? res.data.students
        : [];

      // 2️⃣ Normalize student data
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
          numberOfCourses: s.numberOfCourses || 0,
          profileImg:
            s.profileImg ||
            `https://randomuser.me/api/portraits/lego/${i % 10}.jpg`,
          enrolledCourses: [], // will fetch next
        };
      });

      // 3️⃣ Fetch enrolled courses for each student
      const enriched = await Promise.all(
        normalized.map(async (stu) => {
          if (!stu._id) return stu;
          try {
            const courseRes = await axiosInstance.get(
              `/admin/student-enrolled-courses/${stu._id}`
            );
            const enrolledCourses = courseRes.data.enrolledCourses || [];
            return { ...stu, enrolledCourses };
          } catch (err) {
            console.error(
              "Error fetching enrolled courses for student:",
              stu._id,
              err
            );
            return { ...stu, enrolledCourses: [] };
          }
        })
      );

      setStudents(enriched);
      setTotalPages(res.data.totalPages || 1);
      setPage(res.data.currentPage || 1);
    } catch (err) {
      console.error("Error fetching students:", err);
      setStudents([]);
      setTotalPages(1);
      setPage(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents(page, query);
  }, [page, query]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setQuery(search.trim());
  };

  // 4️⃣ Get unique course titles for dropdown
  const uniqueCourses = [
    ...new Set(
      students
        .flatMap((s) =>
          (s.enrolledCourses || []).map((c) => c.course?.courseTitle)
        )
        .filter(Boolean)
    ),
  ];

  // 5️⃣ Filter students by selected course
  const filteredStudents = courseFilter
    ? students.filter((s) =>
        (s.enrolledCourses || []).some(
          (c) =>
            c.course?.courseTitle?.toLowerCase() === courseFilter.toLowerCase()
        )
      )
    : students;

  return (
    <div className="container mx-auto px-4 py-8">
      <BackButton className="mb-10" />

      <h1 className="text-2xl font-bold mb-6">
        All Students{" "}
        <span className="font-normal text-gray-500">
          ({filteredStudents.length})
        </span>
      </h1>

      {/* Search Input */}

      <section className=" flex  flex-row w-full items-center justify-between">
        <form
          onSubmit={handleSearch}
          className="flex items-center gap-2 mb-4 max-w-md"
        >
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-acewall-main"
          />
          <Button type="submit" className="flex items-center gap-1">
            <Search className="w-4 h-4" /> Search
          </Button>
        </form>

        {/* Course Filter Dropdown */}
        <div className="flex items-center gap-3 mb-6">
          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg"
          >
            <option value="">All Courses</option>
            {uniqueCourses.map((course) => (
              <option key={course} value={course}>
                {course}
              </option>
            ))}
          </select>

          {courseFilter && (
            <Button variant="outline" onClick={() => setCourseFilter("")}>
              Clear
            </Button>
          )}
        </div>
      </section>

      {/* Students List */}
      {loading ? (
        <p className="text-gray-500">Loading students...</p>
      ) : filteredStudents.length === 0 ? (
        <p className="text-gray-500">No students found.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
            {filteredStudents.map((student) => (
              <StudentCard key={student._id} student={student} />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex flex-col items-center mt-8 gap-4">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
              </Button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                <button
                  key={pg}
                  onClick={() => setPage(pg)}
                  className={`w-9 h-9 rounded-full border flex items-center justify-center text-sm font-medium transition-colors ${
                    pg === page
                      ? "bg-acewall-main text-white"
                      : "bg-white text-gray-700"
                  }`}
                >
                  {pg}
                </button>
              ))}

              <Button
                variant="outline"
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
              >
                <ArrowRight className="w-4 h-4 mr-2" />
              </Button>
            </div>
            <span className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </span>
          </div>
        </>
      )}
    </div>  
  );
};

export default AllStudent;
