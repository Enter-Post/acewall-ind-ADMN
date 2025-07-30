import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Save, X } from "lucide-react";
import { axiosInstance } from "@/lib/AxiosInstance";
import { toast } from "sonner";

export default function AssessmentCategoryDialog({ courseId }) {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState();
  const [newCategory, setNewCategory] = useState({ name: "", weight: "" });
  const [editingWeights, setEditingWeights] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      await axiosInstance
        .get(`assessmentCategory/${courseId}`)
        .then((res) => {
          console.log(res);
          setCategories(res.data.categories);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    fetchCategories();
  }, [loading, courseId]);

  const handleWeightChange = (categoryId, newWeight) => {
    setEditingWeights((prev) => ({
      ...prev,
      [categoryId]: newWeight,
    }));
  };

  const handleSaveWeight = async (categoryId) => {
    const newWeight = editingWeights[categoryId];
    if (newWeight !== undefined && newWeight !== "") {
      setLoading(true);
      await axiosInstance
        .put(`assessmentCategory/${courseId}/${categoryId}`, {
          weight: Number.parseFloat(newWeight),
        })
        .then((res) => {
          setLoading(false);
          toast.success(res.data.message || "Weight updated successfully");
          editingWeights[categoryId] = undefined;
        })
        .catch((err) => {
          setLoading(false);
          toast.error(err.response?.data?.message || "Failed to update weight");
          // editingWeights[categoryId] = undefined;
        });
    }
  };

  const handleAddCategory = async () => {
    setLoading(true);
    await axiosInstance
      .post(`assessmentCategory/${courseId}`, {
        name: newCategory.name,
        weight: Number.parseFloat(newCategory.weight),
      })
      .then((res) => {
        setLoading(false);
        setNewCategory({ name: "", weight: "" });
        toast.success(res.data.message || "Category added successfully");
      })
      .catch((err) => {
        setLoading(false);
        console.error("Error adding category:", err);
        toast.error(err.response?.data?.message || "Failed to add category");
      });
  };

  const handleDeleteCategory = async (categoryId) => {
    setLoading(true);
    await axiosInstance
      .delete(`assessmentCategory/${categoryId}`)
      .then((res) => {
        setLoading(false);
        toast.success(res.data.message || "Category deleted successfully");
        setCategories((prev) => prev ? prev.filter((cat) => cat._id !== categoryId) : []);
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err.response?.data?.message || "Failed to delete category");
        console.log(err);
      });
  };

  const getDisplayWeight = (category) => {
    return editingWeights[category._id] !== undefined
      ? editingWeights[category._id]
      : category.weight;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Manage Assessment Categories</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Assessment Categories</DialogTitle>
          <DialogDescription>
            Manage your course assessment categories and their weights.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Categories Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category Name</TableHead>
                  <TableHead>Weight (%)</TableHead>
                  <TableHead className="w-24">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories?.map((category) => (
                  <TableRow key={category._id}>
                    <TableCell className="font-medium">
                      {category.name}
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={getDisplayWeight(category)}
                        onChange={(e) =>
                          handleWeightChange(category._id, e.target.value)
                        }
                        className="w-20"
                        min="0"
                        max="100"
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSaveWeight(category._id)}
                        disabled={editingWeights[category._id] === undefined}
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                    </TableCell>
                    <TableCell>
                      <div onClick={() => handleDeleteCategory(category._id)}>
                        <X className="h-4 w-4 text-red-500 cursor-pointer" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Add New Category */}
          <div className="border rounded-lg p-4 bg-muted/50">
            <h4 className="font-medium mb-3">Add New Category</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <Label htmlFor="categoryName">Category Name</Label>
                <Input
                  id="categoryName"
                  placeholder="Enter category name"
                  value={newCategory.name}
                  onChange={(e) =>
                    setNewCategory((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="categoryWeight">Weight (%)</Label>
                <Input
                  id="categoryWeight"
                  type="number"
                  placeholder="Enter weight"
                  value={newCategory.weight}
                  onChange={(e) =>
                    setNewCategory((prev) => ({
                      ...prev,
                      weight: e.target.value,
                    }))
                  }
                  min="0"
                  max="100"
                />
              </div>
              <div className="flex items-end justify-end">
                <Button
                  onClick={handleAddCategory}
                  disabled={!newCategory.name || !newCategory.weight}
                  className=""
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
            </div>
          </div>

          {/* Total Weight Display */}
          <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
            <span className="font-medium">Total Weight:</span>
            <span className="font-bold text-lg">
              {categories?.reduce((sum, cat) => sum + cat.weight, 0)}%
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
