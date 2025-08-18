"use client";

import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
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

import {
  BookPlus,
  ChartBarStacked,
  CircleEllipsis,
  Languages,
  LibraryBig,
  Loader,
  Pen,
  Play,
  Users,
} from "lucide-react";
import { axiosInstance } from "@/lib/AxiosInstance";
import { CheckCircle } from "lucide-react";
import CommentSection from "@/CustomComponent/Student/CommentSection";
import DeleteCourseModal from "@/CustomComponent/CreateCourse/DeleteCourseModal";
import { FinalCourseAssessmentCard } from "@/CustomComponent/CreateCourse/FinalCourseAssessmentCard";
import { toast } from "sonner";
import AssessmentCategoryDialog from "@/CustomComponent/teacher/AssessmentCategoryDialog";
import RatingSection from "@/CustomComponent/teacher/RatingSection";
import { format } from "date-fns";
import { CourseContext } from "@/Context/CoursesProvider";
import { SelectSemAndQuarDialog } from "@/CustomComponent/CreateCourse/SelectSemAndQuarDialog";
import ArchiveDialog from "@/CustomComponent/teacher/ArchivedModal";
import BackButton from "@/CustomComponent/BackButton";
import { cn } from "@/lib/utils";
import { RejectCourseDialog } from "@/CustomComponent/RejectCourseDialog";
import { Badge } from "@/components/ui/badge";
import avatar from "@/assets/avatar.png";

export default function TeacherCourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { quarters, setQuarters } = useContext(CourseContext);

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [Prevthumbnail, setPrevThumbnail] = useState(null);
  const [newthumbnail, setNewThumbnail] = useState(null);
  const [loadingThumbnail, setLoadingThumbnail] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [verifyloading, setVerifyloading] = useState(false);
  const [rejectCourse, setRejectCourse] = useState(false);

  console.log(course, "course");
  console.log(quarters, "quarters");

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
  };

  const fetchCourseDetail = async () => {
    await axiosInstance
      .get(`course/details/${id}`)
      .then((res) => {
        setCourse(res.data.course);
        setQuarters(res.data.course.quarter);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleVerifyCourse = async (status) => {
    setVerifyloading(true);
    await axiosInstance
      .put(`course/verifyCourse/${id}`, { isVerified: status })
      .then((res) => {
        toast.success(res.data.message);
        setVerifyloading(false);
        fetchCourseDetail();
      })
      .catch((err) => {
        setVerifyloading(false);
        toast.error(err.response?.data?.message || "Error verifying course");
      });
  };

  useEffect(() => {
    fetchCourseDetail();
  }, [id]);

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size must be less than 2MB.");
      return;
    }
    if (
      file.type !== "image/jpeg" &&
      file.type !== "image/png" &&
      file.type !== "image/jpg"
    ) {
      toast.error("Only JPEG and PNG images are allowed.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPrevThumbnail(reader.result);
    };
    reader.readAsDataURL(file);

    setNewThumbnail(file);
  };

  const confirmChange = async () => {
    setLoadingThumbnail(true);
    await axiosInstance
      .put(
        `course/thumbnail/${id}`,
        { thumbnail: newthumbnail },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
        console.log(res);
        toast.success(res.data.message || "Thumbnail updated successfully!");
        fetchCourseDetail();
        setPrevThumbnail(null);
        setNewThumbnail(null);
        setLoadingThumbnail(false);
      })
      .catch((err) => {
        console.log(err);
        setLoadingThumbnail(false);
      });
  };

  const prevSemesterIds = course?.semester?.map((sem) => sem._id) || [];
  const prevQuarterIds = course?.quarter?.map((quarter) => quarter._id) || [];

  if (!course)
    return (
      <div className="flex justify-center items-center h-screen w-full">
        <Loader className="animate-spin w-8 h-8" />
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Header Section */}
      <BackButton label="Back" className="mb-2" />
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
        <div className="flex flex-col md:flex-row gap-3 items-center md:items-start">
          {course && course?.isAppliedReverified?.status === true && (
            <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-lg self-start">
              <Badge
                variant="shaded"
                className="bg-green-200 text-gray-700 font-medium text-xs"
              >
                Re-verification Requested
              </Badge>
              <span className="text-xs text-gray-600">
                {course.isAppliedReverified.request}
              </span>
            </div>
          )}
          {course && course.isVerified === "pending" && (
            <div className="flex flex-col gap-2 self-start">
              <section className="flex items-center gap-3">
                <Button
                  className="bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2 rounded-lg shadow"
                  onClick={() => handleVerifyCourse("approved")}
                >
                  {verifyloading ? (
                    <Loader className="animate-spin w-4 h-4" />
                  ) : (
                    "Verify Course"
                  )}
                </Button>
                <RejectCourseDialog
                  verifyloading={verifyloading}
                  rejectCourse={rejectCourse}
                  setRejectCourse={setRejectCourse}
                  courseID={id}
                  fetchCourseDetail={fetchCourseDetail}
                />
              </section>
            </div>
          )}
          {course?.createdby?.isVarified === false && (
            <div className="text-red-500 text-xs">
              This course is from an unverified teacher, please verify the
              teacher first
            </div>
          )}
        </div>
      </div>
      {!course.published && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800 text-sm font-medium">
            ⚠️ This course is archived and not visible to new students.
          </p>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        {/* Left Column - Thumbnail & Documents */}
        <div className="lg:col-span-4 space-y-6">
          {/* Thumbnail Section */}
          <Card className="overflow-hidden shadow-sm">
            <CardContent className="p-0">
              <img
                src={
                  Prevthumbnail ||
                  course.thumbnail?.url ||
                  "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80"
                }
                alt="Course thumbnail"
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                {Prevthumbnail ? (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 flex-1"
                      onClick={confirmChange}
                      disabled={loadingThumbnail}
                    >
                      {loadingThumbnail ? (
                        <Loader className="animate-spin w-4 h-4" />
                      ) : (
                        "Confirm"
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setPrevThumbnail(null);
                        setNewThumbnail(null);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <div>
                    <input
                      type="file"
                      className="hidden"
                      id="thumbnail"
                      onChange={handleThumbnailChange}
                    />
                    <label
                      htmlFor="thumbnail"
                      className="flex items-center justify-center gap-2 w-full px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <Pen className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        Edit Thumbnail
                      </span>
                    </label>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Documents Section */}
        </div>

        {/* Right Column - Course Details */}
        <div className="lg:col-span-8 space-y-6">
          {/* Course Info Card */}
          <Card className="shadow-sm">
            <CardContent className="p-6">
              {/* Course Metadata */}
              <div className="flex justify-between text-xs text-muted-foreground mb-4">
                <span>Created: {formatDate(course.createdAt)}</span>
                <span>Updated: {formatDate(course.updatedAt)}</span>
              </div>

              {/* Course Title & Description */}
              <div className="space-y-3">
                <h1 className="text-3xl font-bold text-gray-900">
                  {course.courseTitle || "Untitled Course"}
                </h1>
                <p className="text-gray-600 leading-relaxed">
                  {course.courseDescription || "No description available."}
                </p>

                <p className="text-lg font-semibold text-gray-800">
                  ${course.price ? course.price.toFixed(2) : "N/A"}
                </p>

                {/* Verification Status */}
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium",
                      {
                        "bg-yellow-100 text-yellow-800 border border-yellow-200":
                          course.isVerified === "pending",
                        "bg-green-100 text-green-800 border border-green-200":
                          course.isVerified === "approved",
                        "bg-red-100 text-red-800 border border-red-200":
                          course.isVerified === "rejected",
                      }
                    )}
                  >
                    {course.isVerified?.charAt(0).toUpperCase() +
                      course.isVerified?.slice(1)}
                  </span>
                </div>

                {/* Status Messages */}
                {course.isVerified === "pending" && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                    <p className="text-yellow-800 text-sm">
                      Course verification is pending review.
                    </p>
                  </div>
                )}
                {course.isVerified === "rejected" && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-3">
                    <span className="text-red-800 text-sm flex gap-2">
                      <p className="font-semibold">Admin Remark: </p>
                      <p>{course.remarks || "No remarks from admin."} </p>
                    </span>
                  </div>
                )}
                {course.isVerified === "approved" && (
                  <div className="bg-green-50 border border-green-200 rounded-md p-3">
                    <p className="text-green-800 text-sm">
                      Course is verified and approved for students.
                    </p>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-3 border-t border-gray-200 pt-4 mt-4">
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => navigate(`/admin/courses/stdPreview/${id}`)}
                >
                  <Play className="w-4 h-4" />
                  Preview as Student
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => navigate(`/admin/courses/edit/${id}`)}
                >
                  <Pen className="w-4 h-4" />
                  Edit Course Info
                </Button>
                <AssessmentCategoryDialog courseId={id} />
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={<Languages className="h-5 w-5 text-blue-500" />}
          value={course.language?.toUpperCase() || "N/A"}
          label="Language"
        />
        <StatCard
          icon={<ChartBarStacked className="h-5 w-5 text-purple-500" />}
          value={course.category?.title?.toUpperCase() || "N/A"}
          label="Category"
        />
        <StatCard
          icon={<LibraryBig className="h-5 w-5 text-green-500" />}
          value={course.semester?.length || 0}
          label="Semesters"
        />
        <StatCard
          icon={<Users className="h-5 w-5 text-orange-500" />}
          value={course.enrollments?.length || 0}
          label="Students Enrolled"
        />
      </div>

      <Card className="shadow-sm">
        <CardContent className="p-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Teacher:</h3>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <Link to={`/admin/teacherProfile/${course.createdby?._id}`}>
              {course.createdby?.profileImg ? (
                <img
                  src={course.createdby?.profileImg?.url || "/placeholder.svg"}
                  alt="Instructor Profile"
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <img
                  src={avatar}
                  alt="Instructor Profile"
                  className="w-16 h-16 rounded-full object-cover"
                />
              )}
            </Link>

            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                {course.createdby?.firstName}{" "}
                {course.createdby?.middleName
                  ? course.createdby.middleName + " "
                  : ""}{" "}
                {course.createdby?.lastName}
              </h3>
              <p className="text-sm text-muted-foreground">
                {course.createdby?.email}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Course Documents</h3>
          </div>
          <div className="space-y-3">
            {course.documents?.governmentId && (
              <DocumentLink
                label="Government ID"
                document={course.documents.governmentId}
              />
            )}

            {course.documents?.resume && (
              <DocumentLink label="Resume" document={course.documents.resume} />
            )}
            {course.documents?.certificate && (
              <DocumentLink
                label="Certificate"
                document={course.documents.certificate}
              />
            )}
            {course.documents?.transcript && (
              <DocumentLink
                label="Transcript"
                document={course.documents.transcript}
              />
            )}
            {!hasAnyDocuments(course.documents) && (
              <p className="text-sm text-muted-foreground">
                No documents uploaded.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Semesters Section */}
      <Card className="shadow-sm mb-8">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Course Semesters</h2>
          {course?.semester?.length === 0 ? (
            <div className="text-center py-8">
              <LibraryBig className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No semesters added yet</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {course?.semester?.map((semester, index) => (
                <Link
                  key={semester._id}
                  to={`/admin/courses/${id}/semester/${semester._id}`}
                  className="block"
                >
                  <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer">
                    <h3 className="font-semibold text-lg text-gray-900">
                      Semester {index + 1}: {semester.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {format(new Date(semester.startDate), "MMMM do, yyyy")} -{" "}
                      {format(new Date(semester.endDate), "MMMM do, yyyy")}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Final Assessment Cards */}
      {Array.isArray(course.Assessments) &&
        course.CourseAssessments?.map((assessment) => (
          <FinalCourseAssessmentCard
            key={assessment._id}
            assessment={assessment}
            handleDeleteAssessment={handleDeleteAssessment}
          />
        ))}

      {/* Rating Section */}
      <RatingSection courseId={id} />

      {/* Comment Section */}
      <CommentSection id={id} />

      {/* Bottom Actions */}
      <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
        <ArchiveDialog course={course} fetchCourseDetail={fetchCourseDetail} />
        <DeleteCourseModal
          confirmOpen={confirmOpen}
          setConfirmOpen={setConfirmOpen}
          fetchCourseDetail={fetchCourseDetail}
          id={id}
          setSuccessOpen={setSuccessOpen}
        />
      </div>

      {/* Success Modal */}
      <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
        <DialogContent className="flex flex-col items-center justify-center text-center">
          <CheckCircle className="w-12 h-12 text-green-500" />
          <h3 className="text-lg font-semibold mt-2">
            Course deleted successfully!
          </h3>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Helper Components
function StatCard({ icon, value, label }) {
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gray-50">{icon}</div>
          <div>
            <div className="font-bold text-xl text-gray-900">{value}</div>
            <div className="text-sm text-gray-600">{label}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function DocumentLink({ label, document }) {
  return (
    <a
      href={document.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors group"
    >
      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
      <div className="flex-1">
        <span className="font-medium text-gray-900 group-hover:text-blue-600">
          {label}:
        </span>
        <span className="text-sm text-gray-600 ml-2">{document.filename}</span>
      </div>
    </a>
  );
}

// Helper Functions
function hasAnyDocuments(documents) {
  return (
    documents?.governmentId ||
    documents?.resume ||
    documents?.certificate ||
    documents?.transcript
  );
}

function formatDate(dateString) {
  return dateString
    ? new Date(dateString).toLocaleDateString("en-US", {
        year: "2-digit",
        month: "2-digit",
        day: "2-digit",
      })
    : "N/A";
}
