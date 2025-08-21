import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { axiosInstance } from "@/lib/AxiosInstance";
import { GlobalContext } from "@/Context/GlobalProvider";

// Zod Schema
const AnnouncementSchema = z.object({
  title: z.string().min(1, "Title is required"),
  courseId: z.string().min(1, "Course is required"),
  message: z.string().min(1, "Message is required"),
});

export default function AnnouncementDialog({ open, onOpenChange , onCreated  }) {
  const { user } = useContext(GlobalContext);
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(AnnouncementSchema),
    defaultValues: {
      title: "",
      courseId: "",
      message: "",
    },
  });

  useEffect(() => {
    const getCourses = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get("/course/getindividualcourse");
        setAllCourses(response.data.courses || []);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setAllCourses([]);
      } finally {
        setLoading(false);
      }
    };
    getCourses();
  }, []);

  const onSubmit = async (data) => {
    if (!user?._id) return;

    const payload = {
      ...data,
      teacherId: user._id,
    };

    try {
      const res = await axiosInstance.post(
        "/announcements/createannouncement",
        payload
      );
      console.log("Announcement created:", res.data);
      if (onCreated) onCreated(res.data.announcement);

      onOpenChange(false);
      reset(); // Clear the form
    } catch (err) {
      console.error("Error creating announcement:", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Announcement</DialogTitle>
          <DialogDescription>
            Create a new announcement for your students.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div>
            <Label htmlFor="title">Announcement Title</Label>
            <Input
              id="title"
              placeholder="Enter title"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="course">Select Course</Label>
            <Select
              onValueChange={(value) => setValue("courseId", value)}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a course" />
              </SelectTrigger>
              <SelectContent>
                {loading ? (
                  <SelectItem disabled>Loading courses...</SelectItem>
                ) : allCourses.length === 0 ? (
                  <SelectItem disabled>No courses available</SelectItem>
                ) : (
                  allCourses.map((courseData) => (
                    <SelectItem key={courseData._id} value={courseData._id}>
                      {courseData.courseTitle || "Untitled Course"}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {errors.courseId && (
              <p className="text-sm text-red-500">{errors.courseId.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="message">Announcement Message</Label>
            <Textarea
              id="message"
              placeholder="Enter message"
              {...register("message")}
            />
            {errors.message && (
              <p className="text-sm text-red-500">{errors.message.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                onOpenChange(false);
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-green-500 hover:bg-green-600"
            >
              {isSubmitting ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}