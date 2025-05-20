"use client";

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogFooter,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Loader, Play, Users } from "lucide-react";
import { axiosInstance } from "@/lib/AxiosInstance";
import { CheckCircle } from "lucide-react";
import CommentSection from "@/CustomComponent/Student/CommentSection";
import DeleteCourseModal from "@/CustomComponent/CreateCourse/DeleteCourseModal";
import ChapterCreationModal from "@/CustomComponent/CreateCourse/CreatChapterModal";
import ChapterDetail from "@/CustomComponent/CreateCourse/ChapterDetail";
import { FinalCourseAssessmentCard } from "@/CustomComponent/CreateCourse/FinalCourseAssessmentCard";
import { toast } from "sonner";

export default function TeacherCourseDetails() {
  const { id } = useParams() || { id: "68115952b4991f70a28c486f" }; // Default ID or from URL
  const [course, setCourse] = useState(null);
  const [open, setOpen] = useState(false);
  const [openChapter, setOpenChapter] = useState(null); // Default to no chapter open
  const [loadingChapters, setLoadingChapters] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [openLessons, setOpenLessons] = useState({});

  const toggleLesson = (lessonId) => {
    setOpenLessons((prev) => ({
      ...prev,
      [lessonId]: !prev[lessonId],
    }));
  };
  const handleDeleteAssessment = (assessmentID) => {
    setLoading(true);
    axiosInstance
      .delete(`/assessment/delete/${assessmentID}`)
      .then((res) => {
        setLoading(false);
        toast.success(res.data.message);
        fetchCourseDetail();
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err.response?.data?.message || "Error deleting assessment");
      });
  };// Delete Assessment
  const fetchCourseDetail = async () => {
    await axiosInstance
      .get(`course/details/${id}`)
      .then((res) => {
        setCourse(res.data.course);
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
    // Set the course data in state
  };

  useEffect(() => {
    fetchCourseDetail();
  }, [id]); // Added id as a dependency to refetch when the id changes

  if (!course)
    return (
      <div>
        <section className="flex justify-center items-center h-full w-full">
          <Loader size={48} className={"animate-spin"} />
        </section>
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-semibold mb-8">All Courses</h1>

      <div className="space-y-8">
        {/* Course Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <img
              src={
                course.thumbnail.url ||
                "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80"
              }
              alt="Course thumbnail"
              className="w-full  rounded-md object-cover  aspect-video"
            />
          </div>

          <div className="md:col-span-2 space-y-6">
            <div className="space-y-1">
              <div className="flex justify-between text-sm mb-2 text-muted-foreground">
                <span>
                  Uploaded: {course.createdAt?.split("T")[0] || "N/A"}
                </span>
                <span>
                  Last Updated: {course.updatedAt?.split("T")[0] || "N/A"}
                </span>
              </div>
              <h2 className="text-2xl uppercase font-semibold">
                {course.courseTitle || "Course Title"}
              </h2>
              <p className="text-muted-foreground">
                {course.courseDescription || "Course description goes here..."}
              </p>
            </div>

            <div className="flex mt-10 justify-end space-x-2">
              {/* Delete Confirmation Modal */}
              <DeleteCourseModal
                confirmOpen={confirmOpen}
                setConfirmOpen={setConfirmOpen}
                fetchCourseDetail={fetchCourseDetail}
                id={id}
                setSuccessOpen={setSuccessOpen}
              />

              {/* ✅ Success Confirmation Modal */}
              <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
                <DialogContent className="flex flex-col items-center justify-center text-center">
                  <CheckCircle className="w-12 h-12 text-green-500" />
                  <h3 className="text-lg font-semibold mt-2">
                    Course deleted successfully!
                  </h3>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          <StatCard
            icon={<Play className="h-5 w-5  text-orange-500" />}
            value={course.language?.toUpperCase()}
            label="Language"
            bgColor="bg-orange-50"
          />
          <StatCard
            icon={<Play className="h-5 w-5 text-orange-500" />}
            value={course.category?.title?.toUpperCase()}
            label="Category"
            bgColor="bg-orange-50"
          />

          <StatCard
            icon={<Play className="h-5 w-5 text-orange-500" />}
            value={
              course.chapters?.reduce(
                (total, chapter) => total + chapter.lessons?.length,
                0
              ) || 0
            }
            label="Lessons"
            bgColor="bg-orange-50"
          />
          <StatCard
            icon={<Users className="h-5 w-5 text-rose-500" />}
            value={course.student?.length}
            label="Students Enrolled"
            bgColor="bg-rose-50"
          />
        </div>
        <div className="flex justify-between items-center">
        </div>

        {/* chapter detail */}
        <ChapterDetail
          courseId={id}
          chapters={course.chapters}
          fetchCourseDetail={fetchCourseDetail}
        />

        {/* Final Assessment Cards */}
        {Array.isArray(course.finalAssessments) &&
          course.finalAssessments.map((assessment) => (
            <FinalCourseAssessmentCard
              key={assessment._id}  // Use unique id as key
              assessment={assessment}
              handleDeleteAssessment={handleDeleteAssessment}
            />
          ))}

        {/* Rating */}
        <div className="my-10 ">
          <h3 className="text-lg font-medium mb-4">Overall Course Rating</h3>
          <div className="bg-green-50 p-8 rounded-lg flex flex-col items-center">
            {course.rating && course.rating.length > 0 ? (
              <>
                <div className="text-5xl font-semibold mb-4">
                  {(course.averageRating || 4.8).toFixed(1)}
                </div>
                <div className="flex items-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star, index) => {
                    const fullStar =
                      index + 1 <= Math.floor(course.averageRating || 5);
                    const halfStar =
                      index + 1 === Math.floor(course.averageRating || 5) + 0.5;
                    return (
                      <svg
                        key={index}
                        className={`w-6 h-6 ${fullStar
                          ? "text-orange-400"
                          : halfStar
                            ? "text-yellow-500"
                            : "text-gray-300"
                          }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          d={
                            halfStar
                              ? "M10 2L8.618 6.268L4 7.618L7.09 10.118L6 14L10 11.5L14 14L12.91 10.118L16"
                              : "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                          }
                        />
                      </svg>
                    );
                  })}
                </div>
                <div className="text-sm text-muted-foreground">
                  Course Rating
                </div>
              </>
            ) : (
              <div className="text-lg font-medium text-gray-500">
                No ratings available
              </div>
            )}
          </div>
        </div>
      </div>

      <CommentSection id={id} />
    </div>
  );
}

function StatCard({ icon, value, label, bgColor }) {
  return (
    <Card className={`border-0 shadow-sm ${bgColor}`}>
      <CardContent className="p-4 flex items-center gap-4">
        <div className="p-2 rounded-md bg-white">{icon}</div>
        <div>
          <div className="font-semibold text-lg">{value}</div>
          <div className="text-sm text-muted-foreground">{label}</div>
        </div>
      </CardContent>
    </Card>
  );
}
