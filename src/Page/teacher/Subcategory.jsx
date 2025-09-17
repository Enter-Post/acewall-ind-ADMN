import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Loader, Plus, Trash2 } from "lucide-react";
import { axiosInstance } from "@/lib/AxiosInstance";

const Subcategory = () => {
  const { categoryName } = useParams();
  const [subcategories, setSubcategories] = useState([]);
  const [newSub, setNewSub] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editData, setEditData] = useState({ id: "", title: "" });
  const [editError, setEditError] = useState("");
  const [categoryId, setCategoryId] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [deleteLoading, setDeleteLoading] = useState({
    id: null,
    loading: false,
  });

  // Fetch category ID from title
  const fetchCategoryId = async () => {
    try {
      const { data } = await axiosInstance.get("/category/get");
      const category = data.categories.find(
        (cat) =>
          cat.title.toLowerCase() ===
          decodeURIComponent(categoryName).toLowerCase()
      );
      if (category) {
        setCategoryId(category._id);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const fetchSubcategories = async (id) => {
    try {
      const { data } = await axiosInstance.get(`/category/subcategories/${id}`);
      setSubcategories(data.subcategories);
    } catch (err) {
      console.error("Error fetching subcategories:", err);
    }
  };

  const handleAddSubcategory = async () => {
    const trimmedSub = newSub.trim();

    if (!trimmedSub) {
      setError("Subcategory name cannot be empty.");
      return;
    }

    const alreadyExists = subcategories.some(
      (sub) => sub.title.toLowerCase() === trimmedSub.toLowerCase()
    );

    if (alreadyExists) {
      setError("Subcategory already exists.");
      return;
    }

    try {
      const { data } = await axiosInstance.post("/subcategory/create", {
        title: trimmedSub,
        category: categoryId,
      });

      setSubcategories((prev) =>
        [...prev, data.subcategory].sort((a, b) =>
          a.title.localeCompare(b.title)
        )
      );

      setNewSub("");
      setDialogOpen(false);
      setError("");
    } catch (err) {
      if (err.response?.status === 400 || err.response?.status === 409) {
        setError(err.response.data.message || "Subcategory already exists.");
      } else {
        console.error("Error creating subcategory:", err);
        setError("An unexpected error occurred.");
      }
    }
  };

  const handleEditSubcategory = async () => {
    const trimmedTitle = editData.title.trim();

    if (!trimmedTitle) {
      setEditError("Subcategory name cannot be empty.");
      return;
    }

    const alreadyExists = subcategories.some(
      (sub) =>
        sub.title.toLowerCase() === trimmedTitle.toLowerCase() &&
        sub._id !== editData.id
    );

    if (alreadyExists) {
      setEditError("Subcategory already exists.");
      return;
    }

    try {
      const { data } = await axiosInstance.put(`/subcategory/${editData.id}`, {
        title: trimmedTitle,
        category: categoryId,
      });

      setSubcategories((prev) =>
        prev
          .map((sub) =>
            sub._id === data.subcategory._id ? data.subcategory : sub
          )
          .sort((a, b) => a.title.localeCompare(b.title))
      );

      setEditDialogOpen(false);
      setEditData({ id: "", title: "" });
      setEditError("");
    } catch (err) {
      if (err.response?.status === 400 || err.response?.status === 409) {
        setEditError(
          err.response.data.message || "Subcategory already exists."
        );
      } else {
        console.error("Error updating subcategory:", err);
        setEditError("An unexpected error occurred.");
      }
    }
  };

  const handleDeleteSubcategory = async (id) => {
    setDeleteLoading({ id, loading: true });
    try {
      await axiosInstance.delete(`/subcategory/delete/${id}`);
      setDeleteLoading({ id, loading: false });
      fetchSubcategories(categoryId);
    } catch (err) {
      setDeleteLoading({ id, loading: false });
      console.error("Error deleting subcategory:", err);
    }
  };

  useEffect(() => {
    fetchCategoryId();
  }, []);

  useEffect(() => {
    if (categoryId) {
      fetchSubcategories(categoryId);
    }
  }, [categoryId]);

  return (
    <div className="p-6 space-y-6">
      <Button variant="outline" onClick={() => navigate(-1)}>
        ← Back
      </Button>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          Sub Topic for: {categoryName}
        </h1>

        {/* Add Subcategory Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus size={18} />
              Add Sub Topic
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Sub Topic</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Label htmlFor="sub Topic">Sub Topic Name</Label>
              <Input
                id="subcategory"
                value={newSub}
                onChange={(e) => setNewSub(e.target.value)}
                placeholder="e.g. Web Development"
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button onClick={handleAddSubcategory} className="w-full">
                Add
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Subcategory Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Sub Topic</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Label htmlFor="edit sub Topic">Sub Topic Name</Label>
              <Input
                id="edit-subcategory"
                value={editData.title}
                onChange={(e) =>
                  setEditData((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="e.g. Updated Sub Topic"
              />
              {editError && <p className="text-red-500 text-sm">{editError}</p>}
              <Button onClick={handleEditSubcategory} className="w-full">
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Serial Number</TableHead>
                <TableHead>Sub Topic</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subcategories.map((sub, index) => (
                <TableRow key={sub._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{sub.title}</TableCell>
                  <TableCell className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditData({ id: sub._id, title: sub.title });
                        setEditDialogOpen(true);
                      }}
                    >
                      Edit
                    </Button>

                    {deleteLoading.id === sub._id && deleteLoading.loading ? (
                      <Loader size={18} className="animate-spin" />
                    ) : (
                      <Trash2
                        onClick={() => handleDeleteSubcategory(sub._id)}
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {subcategories.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-gray-500">
                    No sub Topic found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Subcategory;
