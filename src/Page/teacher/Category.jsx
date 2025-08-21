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
import { toast } from "sonner";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [subCountMap, setSubCountMap] = useState({});
  const [newCategoryName, setNewCategoryName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editData, setEditData] = useState({ id: null, title: "" });
  const [loading, setLoading] = useState(false);
  const [addError, setAddError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deletingId, setDeletingId] = useState(null); // Track which category is being deleted

  const navigate = useNavigate();

  console.log(categories, "categories");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/admin/getCategories");
      console.log(res, "get categories for admin");
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
    if (!newCategoryName.trim()) {
      setAddError("Category name cannot be empty");
      return;
    }

    try {
      const res = await axiosInstance.post("/category/create", {
        title: newCategoryName.trim(),
      });

      const newCat = res.data.category;
      setCategories((prev) => [...prev, newCat]);
      setSubCountMap((prev) => ({ ...prev, [newCat._id]: 0 }));
      setNewCategoryName("");
      setDialogOpen(false);
      setAddError("");
    } catch (error) {
      if (
        error.response?.status === 400 ||
        error.response?.status === 409 ||
        error.response?.data?.message?.includes("already exists")
      ) {
        setAddError("Category already exists");
      } else {
        setAddError("Something went wrong");
      }
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

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;

    try {
      setDeletingId(id);
      setDeleteError(""); // Clear previous error

      await axiosInstance.delete(`category/delete/${id}`);

      // Remove deleted category from state
      setCategories((prev) => prev.filter((cat) => cat._id !== id));
      setSubCountMap((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });

      toast.success("Category deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to delete category";

      // Check for the specific error message about courses
      if (errorMessage.includes("Category contains courses")) {
        toast.error("Cannot delete category: It contains courses.");
      } else {
        toast.error(errorMessage);
      }

      setDeleteError(errorMessage);
    } finally {
      setDeletingId(null);
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
            {addError && <p className="text-red-500 text-sm">{addError}</p>}
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
                    <TableCell>{cat?.subcategories?.length}</TableCell>
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
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteCategory(cat._id)}
                        disabled={deletingId === cat._id}
                        className="px-2 py-1 text-sm"
                      >
                        {deletingId === cat._id ? "Deleting..." : "Delete"}
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
