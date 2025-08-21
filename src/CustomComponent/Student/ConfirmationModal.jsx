import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { axiosInstance } from "@/lib/AxiosInstance";

export default function PurchaseConfirmationModal({ purchase }) {
  const [open, setOpen] = useState(false);

  const handleConfirm = () => {
    purchase();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className={
            "w-full text-white text-sm py-2 bg-green-600 hover:bg-green-700 rounded-xl transition-colors duration-300"
          }
          variant="default"
        >
          Enroll Now
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-green-400">
            <CheckCircle2 className="h-5 w-5" /> Enroll in Course
          </DialogTitle>
          <DialogDescription>
             Click below to enroll and get started for free.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="default" onClick={handleConfirm}>
            Enroll Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
