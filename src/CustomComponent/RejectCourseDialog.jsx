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

export const RejectCourseDialog = ({ courseID, fetchCourseDetail }) => {
  const { register, handleSubmit, reset } = useForm();

  const handleReject = async (data) => {
    await axiosInstance
      .put(`course/rejectCourse/${courseID}`, {
        remark: data.remark,
      })
      .then((res) => {
        toast.success(res.data.message);
        fetchCourseDetail();
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
      });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Reject Course</Button>
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
            <Button type="button" variant="ghost" onClick={() => reset()}>
              Cancel
            </Button>
            <Button type="submit" variant="destructive">
              Submit
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
