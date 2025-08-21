// components/RejectCourseDialog.jsx
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { axiosInstance } from "@/lib/AxiosInstance";
import { toast } from "sonner";
import { Loader } from "lucide-react";

export const RejectCourseDialog = ({
  courseID,
  fetchCourseDetail,
  verifyloading,
  rejectCourse,
  setRejectCourse,
}) => {
  const { register, handleSubmit, reset } = useForm();

  const handleReject = async (data) => {
    setRejectCourse(true);
    await axiosInstance
      .put(`course/rejectCourse/${courseID}`, {
        remark: data.remark,
      })
      .then((res) => {
        setRejectCourse(false);
        toast.success(res.data.message);
        fetchCourseDetail();
      })
      .catch((err) => {
        setRejectCourse(false);
        toast.error(err.response?.data?.message);
      });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive" disabled={verifyloading}>
          Reject Course
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit(handleReject)}>
          <DialogHeader>
            <DialogTitle>Reject Course</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="remark">Remark</Label>
              <Textarea
                id="remark"
                placeholder="Provide reason for rejection..."
                {...register("remark", { required: true })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              disabled={rejectCourse}
              onClick={() => reset()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={verifyloading || rejectCourse}
              variant="destructive"
            >
              {rejectCourse ? (
                <Loader size={16} className={"animate-spin"} />
              ) : (
                "Submit"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
