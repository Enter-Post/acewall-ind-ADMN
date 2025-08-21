"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash } from "lucide-react";
import { axiosInstance } from "@/lib/AxiosInstance";
import { toast } from "sonner";

// Zod schema
const pdfFileSchema = z
  .instanceof(File)
  .refine((file) => file.type === "application/pdf", {
    message: "Only PDF files are allowed",
  });

const lessonSchema = z.object({
  title: z.string().min(5).max(100),
  description: z.string().min(5).max(200),
  youtubeLinks: z
    .string()
    .trim()
    .transform((val) => (val === "" ? undefined : val))
    .optional()
    .refine(
      (val) =>
        !val ||
        /^https:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]{11}(&.+)?$/
          .test(val),
      {
        message: "Enter a valid YouTube video link",
      }
    ),
  otherLink: z
    .string()
    .trim()
    .transform((val) => (val === "" ? undefined : val))
    .optional()
    .refine((val) => !val || /^https?:\/\/.+$/.test(val), {
      message: "Must be a valid URL",
    }),
  pdfFiles: z
    .array(pdfFileSchema)
    .min(1, { message: "At least one PDF is required" })
    .refine(
      (files) =>
        files.reduce((acc, file) => acc + (file?.size || 0), 0) <= 5 * 1024 * 1024,
      {
        message: "Total file size must not exceed 5MB",
      }
    ),
});

const LessonModal = ({ chapterID, fetchCourseDetail }) => {
  const [open, setOpen] = useState(false);
  const [pdfInputs, setPdfInputs] = useState([null]);
  const [totalSize, setTotalSize] = useState(0);
  const [loading, setLoading] = useState(false);
  const MAX_TITLE_LENGTH = 100;
  const MAX_DESCRIPTION_LENGTH = 200;

  const [titleValue, setTitleValue] = useState("");
  const [descValue, setDescValue] = useState("");


  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      title: "",
      description: "",
      youtubeLinks: "",
      otherLink: "",
      pdfFiles: [],
    },
  });

  const calculateTotalSize = (files) =>
    files.reduce((acc, f) => acc + (f?.size || 0), 0);

  const handleFileChange = (index, file) => {
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are allowed");
      return;
    }

    const updated = [...pdfInputs];
    updated[index] = file;

    const newSize = calculateTotalSize(updated);
    if (newSize > 5 * 1024 * 1024) {
      toast.error("Total file size exceeds 5MB");
      return;
    }

    setPdfInputs(updated);
    setTotalSize(newSize);
    setValue("pdfFiles", updated.filter(Boolean), { shouldValidate: true });
  };

  const handleAddField = () => {
    const currentTotal = calculateTotalSize(pdfInputs);
    if (currentTotal >= 5 * 1024 * 1024) {
      toast.error("Cannot add more files. 5MB limit reached.");
      return;
    }
    setPdfInputs((prev) => [...prev, null]);
  };

  const handleRemoveField = (index) => {
    const updated = [...pdfInputs];
    updated.splice(index, 1);
    const newSize = calculateTotalSize(updated);
    setPdfInputs(updated);
    setTotalSize(newSize);
    setValue("pdfFiles", updated.filter(Boolean), { shouldValidate: true });
  };

  const onSubmit = async (data) => {
    setLoading(true); // prevent multiple submissions

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("youtubeLinks", data.youtubeLinks || "");
    formData.append("otherLink", data.otherLink || "");
    formData.append("chapter", chapterID);

    pdfInputs.filter(Boolean).forEach((file) => {
      formData.append("pdfFiles", file);
    });

    try {
      const res = await axiosInstance.post("/lesson/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success(res.data.message);
      fetchCourseDetail();
      reset();
      setPdfInputs([null]);
      setTotalSize(0);
      setOpen(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false); // allow future submissions
    }
  };


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
       
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] h-[80dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Lesson</DialogTitle>
          <DialogDescription>
            Fill in the lesson details. Upload only PDF files, max 5MB total.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="title">Lesson Title</Label>
            <Input
              id="title"
              {...register("title")}
              value={titleValue}
              maxLength={MAX_TITLE_LENGTH}
              onChange={(e) => {
                if (e.target.value.length <= MAX_TITLE_LENGTH) {
                  setTitleValue(e.target.value);
                  setValue("title", e.target.value); // sync with react-hook-form
                }
              }}
            />
            <div className="text-sm text-muted-foreground text-right">
              {titleValue.length}/{MAX_TITLE_LENGTH}
            </div>
            {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
          </div>

          <div>
            <Label htmlFor="description">Lesson Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              value={descValue}
              maxLength={MAX_DESCRIPTION_LENGTH}
              onChange={(e) => {
                if (e.target.value.length <= MAX_DESCRIPTION_LENGTH) {
                  setDescValue(e.target.value);
                  setValue("description", e.target.value);
                }
              }}
              rows={4}
            />
            <div className="text-sm text-muted-foreground text-right">
              {descValue.length}/{MAX_DESCRIPTION_LENGTH}
            </div>
            {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
          </div>

          <div>
            <Label htmlFor="youtubeLinks">YouTube Link</Label>
            <Input id="youtubeLinks" {...register("youtubeLinks")} />
            {errors.youtubeLinks && (
              <p className="text-red-500 text-sm">{errors.youtubeLinks.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="otherLink">Other Link</Label>
            <Input id="otherLink" {...register("otherLink")} />
            {errors.otherLink && (
              <p className="text-red-500 text-sm">{errors.otherLink.message}</p>
            )}
          </div>

          <div>
            <Label>Lesson PDF Files</Label>
            {pdfInputs.map((file, index) => (
              <div key={index} className="flex items-center gap-2 mt-2">
                <Input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => handleFileChange(index, e.target.files?.[0])}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveField(index)}
                  disabled={pdfInputs.length === 1}
                  className="text-red-500"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={handleAddField}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Another File
            </Button>

            <p className="text-gray-600 text-sm mt-1">
              Total size: {(totalSize / 1024 / 1024).toFixed(2)} MB / 5 MB
            </p>

            {errors.pdfFiles && (
              <p className="text-red-500 text-sm mt-2">{errors.pdfFiles.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                setPdfInputs([null]);
                setTotalSize(0);
                setOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Lesson"}
            </Button>

          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LessonModal;
