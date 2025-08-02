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
import { Plus, Loader, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "@/lib/AxiosInstance";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [subCountMap, setSubCountMap] = useState({});
  const [newCategoryName, setNewCategoryName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editData, setEditData] = useState({ id: null, title: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  console.log(categories, "categories");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/category/get");
      const cats = res.data.categories;
      setCategories(cats);
      await fetchSubcategoryCounts(cats);
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
        const res = await axiosInstance.get(
          `/category/subcategories/${cat._id}`
        );
        counts[cat._id] = res.data.subcategories?.length || 0;
      }
      setSubCountMap(counts);
    } catch (error) {
      console.error("Error fetching subcategory counts:", error);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
      const res = await axiosInstance.post("/category/create", {
        title: newCategoryName.trim(),
      });
      const newCat = res.data.category;
      setCategories((prev) => [...prev, newCat]);
      setSubCountMap((prev) => ({ ...prev, [newCat._id]: 0 }));
      setNewCategoryName("");
      setDialogOpen(false);
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

  const handleEditCategory = async () => {
    try {
      const res = await axiosInstance.put(`category/edit/${editData.id}`, {
        title: editData.title,
      });
      setCategories((prev) =>
        prev.map((cat) => (cat._id === editData.id ? res.data.category : cat))
      );
      setEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Categories</h1>

        {/* Add Category Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2 bg-green-500 hover:bg-green-600">
              <Plus size={18} />
              Add New Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Label htmlFor="categoryName">Category Name</Label>
              <Input
                id="categoryName"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="e.g. Business"
              />
              <Button
                onClick={handleAddCategory}
                className="w-full bg-green-500 hover:bg-green-600"
              >
                Add Category
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Category Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Category</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Label htmlFor="editCategory">New Title</Label>
              <Input
                id="editCategory"
                value={editData.title}
                onChange={(e) =>
                  setEditData({ ...editData, title: e.target.value })
                }
              />
              <Button
                onClick={handleEditCategory}
                className="w-full bg-blue-500 hover:bg-blue-600"
              >
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-4">
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <Loader className="animate-spin" />
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No categories found.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Subcategories</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((cat, index) => (
                  <TableRow key={cat._id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <span
                        onClick={() =>
                          navigate(`/admin/subcategory/${cat.title}`)
                        }
                        className="text-blue-600 hover:underline cursor-pointer"
                      >
                        {cat.title}
                      </span>
                    </TableCell>
                    <TableCell>{subCountMap[cat._id] ?? 0}</TableCell>
                    <TableCell className="flex items-center space-x-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditData({ id: cat._id, title: cat.title });
                          setEditDialogOpen(true);
                        }}
                        className="flex items-center gap-1 px-2 py-1 text-sm"
                      >
                        <Pencil size={14} />
                        Edit
                      </Button>

                      <Button
                        variant="link"
                        className="text-sm text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400"
                        onClick={() =>
                          navigate(`/admin/subcategory/${cat.title}`)
                        }
                        role="link"
                        tabIndex={0}
                      >
                        Manage Subcategories
                      </Button>
                    </TableCell>
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