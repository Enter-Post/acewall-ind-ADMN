import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { axiosInstance } from "@/lib/AxiosInstance";

export default function ArchiveDialog({
  onConfirm,
  course,
  fetchCourseDetail,
}) {
  const [open, setOpen] = useState(false);

  const handleArchive = async () => {
    try {
      const res = await axiosInstance.put(`course/archive/${course._id}`);

      fetchCourseDetail();
      setOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className={
            course.published
              ? "bg-gray-200 text-black"
              : "bg-green-500 text-black"
          }
        >
          {course.published ? "Archive Course" : "Unarchive Course"}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle
            className={`flex items-center gap-2 ${
              course.published ? "text-red-600" : "text-green-600"
            }`}
          >
            {course.published && <AlertTriangle className="w-5 h-5" />}
            Confirm {course.published ? "Archive" : "Unarchive"}
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to archive this course? This action can be
            reversed later.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            className={`${
              course.published
                ? "bg-red-600 hover:bg-red-700"
                : "bg-green-600 hover:bg-green-700"
            }`}
            onClick={handleArchive}
          >
            Yes {course.published ? "Archive" : "Unarchive"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
