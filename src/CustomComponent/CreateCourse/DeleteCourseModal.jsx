import React from "react";
import {
  Dialog,
  DialogFooter,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { axiosInstance } from "@/lib/AxiosInstance";
import { toast } from "sonner";

const DeleteCourseModal = ({
  confirmOpen,
  setConfirmOpen,
  id,
  setSuccessOpen,
  fetchCourseDetail,
}) => {
  const handleDeleteCourse = async ({ fetchCourseDetail }) => {
    try {
      await axiosInstance.delete(`/course/delete/${id}`);
      setConfirmOpen(false);
      setSuccessOpen(true);

      // Wait 2 seconds before redirecting
      setTimeout(() => {
        setSuccessOpen(false);
        window.location.href = "/teacher/courses";
        fetchCourseDetail();
      }, 2000);
    } catch (error) {
      console.error("Error deleting course:", error);
      toast.error("Failed to delete course.");
    }
  };

  return (
    <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
      <DialogTrigger asChild>
        <Button
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded shadow-md transition-all duration-150"
          onClick={() => setConfirmOpen(true)}
        >
          Delete Course
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <p className="text-sm text-muted-foreground">
            This will permanently delete the course and all related data. Are
            you sure?
          </p>
        </DialogHeader>
        <DialogFooter className="mt-4 flex flex-col-reverse justify-end gap-2">
          <Button
            className="bg-red-600 text-white hover:bg-red-700"
            onClick={handleDeleteCourse}
          >
            Yes, Delete
          </Button>
          <Button variant="outline" onClick={() => setConfirmOpen(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteCourseModal;
