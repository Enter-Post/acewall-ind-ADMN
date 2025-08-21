"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { axiosInstance } from "@/lib/AxiosInstance";
import CategoryDropdown from "@/CustomComponent/Assessment/Assessment-category-dropdown";
import StrictDatePicker from "@/CustomComponent/Assessment/DueDatePicker";
import { Pen } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(1, "Title must be at least 3 characters").max(120),
  description: z
    .string()
    .min(1, "Description must be at least 10 characters")
    .max(1000),
  category: z.string().min(1, "Please select a category"),
  dueDate: z.object({
    dateTime: z
      .preprocess(
        (val) =>
          typeof val === "string" || val instanceof Date ? new Date(val) : val,
        z.date({ required_error: "Due date is required" })
      )
      .refine((val) => val instanceof Date && !isNaN(val.getTime()), {
        message: "Please select a valid due date",
      }),
  }),
});

export default function EditAssessmentDialog({ assessment, fetchAssessment }) {
  const navigate = useNavigate();
  const { type, courseId, id } = useParams();
  const [searchParams] = useSearchParams();

  const [open, setOpen] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);

  console.log(assessment, "dueDate");

  useEffect(() => {
    const fetchQuarterDate = async () => {
      try {
        const res = await axiosInstance.get(
          `quarter/getDatesofQuarter/${assessment.quarter}`
        );
        setStartDate(new Date(res.data.startDate));
        setEndDate(new Date(res.data.endDate));
      } catch (err) {
        console.log(err);
      }
    };
    fetchQuarterDate();
  }, []);

  const minDate = startDate < endDate ? startDate : endDate;
  const maxDate = endDate > startDate ? endDate : startDate;

  const combineDateTime = (dateStr, timeStr) => {
    if (!dateStr || !timeStr) return null;

    const combinedStr = `${dateStr.split("T")[0]}T${timeStr}`;
    const dateTime = new Date(combinedStr);

    return isNaN(dateTime.getTime()) ? null : dateTime;
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: assessment.title,
      description: assessment.description,
      category: assessment.category._id || "",
      dueDate: {
        dateTime: combineDateTime(
          assessment.dueDate?.date,
          assessment.dueDate?.time
        ),
      },
    },
  });

  const onSubmit = async (data) => {
    console.log(data, "data");

    if (isSubmitting) return;

    setIsSubmitting(true);
    const toastId = toast.loading("Creating assessment...");

    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("category", data.category);
      formData.append(type, id);

      const dueDate = new Date(data.dueDate.dateTime);
      if (dueDate >= minDate && dueDate <= maxDate) {
        formData.append("dueDate", dueDate.toISOString());
      } else {
        toast.error("Due date must be within the allowed range", {
          id: toastId,
        });
        setIsSubmitting(false);
        return;
      }

      const res = await axiosInstance.put(
        `assessment/editAssessment/${assessment._id}`,
        formData
      );

      toast.success(res.data.message, { id: toastId });
      fetchAssessment();
      setOpen(false);
    } catch (err) {
      console.log(err);
      toast.error(
        err?.response?.data?.message || "Failed to create assessment",
        {
          id: toastId,
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Pen size={16} />
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Create New Assessment</DialogTitle>
          <DialogDescription>
            Fill in the form to create a new assessment.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assessment Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter Assessment Title" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Enter assessment description"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <CategoryDropdown
                      assessmentId={assessment.id}
                      courseId={assessment.course}
                      value={field.value}
                      onValueChange={field.onChange}
                      error={form.formState.errors.category?.message}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <Label>Due Date</Label>
              <StrictDatePicker
                name="dueDate"
                minDate={minDate}
                maxDate={maxDate}
              />
              <FormMessage>
                {form.formState.errors?.dueDate?.message}
              </FormMessage>
            </div>

            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Assessment"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
