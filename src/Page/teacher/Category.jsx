import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "@/lib/AxiosInstance";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [subCountMap, setSubCountMap] = useState({});
  const [newCategoryName, setNewCategoryName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/category/get");
      setCategories(res.data.categories);
      await fetchSubcategoryCounts(res.data.categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubcategoryCounts = async (categories) => {
    try {
      const counts = {};
      for (const cat of categories) {
        console.log("Fetching subcategories for:", cat._id); 
        const res = await axiosInstance.get(`/category/subcategories/${cat._id}`);
        counts[cat._id] = res.data.subcategories.length;
      }
      console.log("Subcategory counts:", counts);
      setSubCountMap(counts);
    } catch (error) {
      console.error("Error fetching subcategory counts:", {
        message: error.message,
        url: error.config?.url,
        responseData: error.response?.data,
      });
    }
  };


  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;

    try {
      const res = await axiosInstance.post("/category/create", {
        title: newCategoryName.trim(),
      });
      setCategories((prev) => [...prev, res.data.category]);
      setSubCountMap((prev) => ({ ...prev, [res.data.category._id]: 0 }));
      setNewCategoryName("");
      setDialogOpen(false);
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Categories</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2 bg-green-500 hover:bg-green-600">
              <Plus size={18} />
              Add New Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle >Add New Category</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Label htmlFor="categoryName">Category Name</Label>
              <Input
                id="categoryName"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="e.g. Business"
              />
              <Button onClick={handleAddCategory} className="w-full bg-green-500 hover:bg-green-600">
                Add Category
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-4">
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <Loader className="animate-spin " />
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No categories found.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Serial Number</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>No of Subcategories</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((cat, index) => (
                  <TableRow key={cat._id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <button
                        onClick={() =>
                          navigate(`/admin/subcategory/${encodeURIComponent(cat.title)}`)
                        }
                        className="text-blue-600 hover:underline cursor-pointer"
                      >
                        {cat.title}
                      </button>
                    </TableCell>
                    <TableCell>{subCountMap[cat._id] ?? 0}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Category;
