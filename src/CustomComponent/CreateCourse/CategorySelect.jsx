import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { axiosInstance } from "@/lib/AxiosInstance";
import React, { useEffect, useState } from "react";

const CategorySelect = ({ register, errors, onCategoryChange }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosInstance.get("category/get");
        setCategories(res.data.categories);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div>
      <Label htmlFor="category" className="block mb-2">
        Category
      </Label>
      <Select
        onValueChange={(value) => {
          const event = { target: { name: "category", value } };
          register("category").onChange(event);
          onCategoryChange?.(value); // notify parent of selection
        }}
      >
        <SelectTrigger className="bg-gray-50">
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent>
          {categories.length > 0 ? (
            categories.map((value) => (
              <SelectItem key={value._id} value={value._id}>
                {value.title}
              </SelectItem>
            ))
          ) : (
            <div className="p-2 text-sm text-gray-500">No categories found</div>
          )}
        </SelectContent>
      </Select>
      <input type="hidden" {...register("category")} />
      {errors?.category && (
        <p className="text-xs text-red-500 mt-1">{errors.category.message}</p>
      )}
    </div>
  );
};

export default CategorySelect;
