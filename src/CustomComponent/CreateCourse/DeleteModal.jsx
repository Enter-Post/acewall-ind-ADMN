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
import { axiosInstance } from "@/lib/AxiosInstance";
import { toast } from "sonner";
import LoadingLoader from "../LoadingLoader";
import { Loader, Trash2 } from "lucide-react";

export function DeleteModal({
  chapterID,
  deleteFunc
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 text-gray-500 hover:text-red-600"
          onClick={(e) => {
            e.stopPropagation();
            /* Open delete confirmation */
          }}
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span className="sr-only">Delete</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the item.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={deleteFunc}>
            {loading ? <Loader className="animate-spin" /> : "Confirm Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
