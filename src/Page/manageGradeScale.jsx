"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Plus, RefreshCw, Check } from "lucide-react";
import { axiosInstance } from "@/lib/AxiosInstance";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function ManageGradeScale() {
  const [grades, setGrades] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      grade: "",
      min: grades.length > 0 ? grades[grades.length - 1].max + 1 : 0,
      max:
        grades.length > 0
          ? Math.min(grades[grades.length - 1].max + 10, 100)
          : 50,
    },
  });

  const watchMin = watch("min");
  const watchMax = watch("max");

  const hadleCreateGradeScale = async () => {
    await axiosInstance
      .post("gradebook/gradingScale", { scale: grades })
      .then((res) => {
        console.log(res);
        toast.success(res.data.message);
        navigate("/admin/gradescale");
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response.data.message || "Something went wrong");
      });
  };

  const onSubmit = (data) => {
    const totalMax = grades.length > 0 ? grades[grades.length - 1].max : -1;
    if (data.min <= totalMax) {
      toast.error("Min value must be greater than the previous max value.");
      return;
    }

    const newEntry = {
      grade: data.grade.toUpperCase(),
      min: Number.parseInt(data.min),
      max: Number.parseInt(data.max),
    };

    setGrades([...grades, newEntry]);
    setSuccessMessage(`Grade ${data.grade.toUpperCase()} added successfully!`);

    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);

    // Set next values
    if (data.max < 100) {
      const nextMin = Number.parseInt(data.max) + 1;
      setValue("min", nextMin);
      setValue("max", Math.min(nextMin + 10, 100));
      setValue("grade", "");
    } else {
      // Reset form if we reached 100%
      reset({
        grade: "",
        min: 0,
        max: 50,
      });
    }
  };

  const handleReset = () => {
    setGrades([]);
    reset({
      grade: "",
      min: 0,
      max: 50,
    });
    setSuccessMessage("");
  };

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6">
        Create Grade Scale
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Form Section */}
        <Card>
          <CardHeader>
            <CardTitle>Add New Grade</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-sm font-medium">
                  Letter Grade
                </label>
                <Input
                  {...register("grade", {
                    required: "Grade is required",
                    pattern: {
                      value: /^[A-F+-]*$/i,
                      message: "Only letters A-F and +/- symbols allowed",
                    },
                  })}
                  placeholder="e.g., A, B+, C-"
                  className={errors.grade ? "border-red-500" : ""}
                />
                {errors.grade && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.grade.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-sm font-medium">
                    Min Percentage
                  </label>
                  <Input
                    type="number"
                    {...register("min", {
                      required: "Min is required",
                      min: {
                        value: 0,
                        message: "Min cannot be less than 0",
                      },
                      max: {
                        value: 99,
                        message: "Min must be less than 100",
                      },
                    })}
                    className={errors.min ? "border-red-500" : ""}
                  />
                  {errors.min && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.min.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium">
                    Max Percentage
                  </label>
                  <Input
                    type="number"
                    {...register("max", {
                      required: "Max is required",
                      min: {
                        value: watchMin ? Number.parseInt(watchMin) + 1 : 1,
                        message: "Max must be greater than Min",
                      },
                      max: {
                        value: 100,
                        message: "Max cannot exceed 100",
                      },
                    })}
                    className={errors.max ? "border-red-500" : ""}
                  />
                  {errors.max && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.max.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex space-x-2 pt-2">
                <Button type="submit" className="flex-1 bg-green-500 hover:bg-green-600">
                  <Plus className="mr-2 h-4 w-4" /> Add Grade
                </Button>
                <Button type="button" variant="outline" onClick={handleReset}>
                  <RefreshCw className="mr-2 h-4 w-4" /> Reset
                </Button>
              </div>
            </form>

            {successMessage && (
              <Alert className="mt-4 bg-green-50 border-green-200">
                <Check className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-600">
                  {successMessage}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Grade Scale Display */}
        <Card>
          <CardHeader>
            <CardTitle>Grade Scale</CardTitle>
          </CardHeader>
          <CardContent>
            {grades.length > 0 ? (
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-2 font-medium text-sm text-gray-500 mb-2">
                  <div>Grade</div>
                  <div>Range</div>
                  <div>Percentage</div>
                </div>
                {grades.map((grade, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-3 gap-2 items-center border-b border-gray-100 pb-2"
                  >
                    <Badge className={`font-bold text-sm px-3 py-1 bg-green-500 `}>
                      {grade.grade}
                    </Badge>
                    <div className="text-sm">
                      {grade.min}% - {grade.max}%
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-green-500 h-2.5 rounded-full"
                        style={{ width: `${grade.max - grade.min + 1}%` }}
                      ></div>
                    </div>
                  </div>
                ))}

                {grades[grades.length - 1]?.max === 100 && (
                  <div>
                    <Alert className="mt-4 bg-green-50 border-green-200">
                      <Check className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-600">
                        Grade scale completed to 100%!
                      </AlertDescription>
                    </Alert>

                    <Button
                      onClick={() => {
                        hadleCreateGradeScale();
                      }}
                      className="mt-4 w-full bg-green-500 hover:bg-green-600"
                    >
                      Create
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-center text-gray-500">
                <AlertCircle className="h-8 w-8 mb-2 opacity-50" />
                <p>No grades added yet</p>
                <p className="text-sm">Add grades using the form</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
