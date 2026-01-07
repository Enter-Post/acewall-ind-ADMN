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
import { Loader, Plus, Trash2, Edit, Image as ImageIcon } from "lucide-react";
import { axiosInstance } from "@/lib/AxiosInstance";

const Subcategory = () => {
  const { categoryName } = useParams();
  const [subcategories, setSubcategories] = useState([]);
  const [newSub, setNewSub] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  
  // Updated editData to hold the new file if selected
  const [editData, setEditData] = useState({ id: "", title: "", file: null });
  const [editError, setEditError] = useState("");
  
  const [categoryId, setCategoryId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [deleteLoading, setDeleteLoading] = useState({ id: null, loading: false });

  const fetchCategoryId = async () => {
    try {
      const { data } = await axiosInstance.get("/category/get");
      const category = data.categories.find(
        (cat) => cat.title.toLowerCase() === decodeURIComponent(categoryName).toLowerCase()
      );
      
      
      if (category) setCategoryId(category._id);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const fetchSubcategories = async (id) => {
    try {
      const { data } = await axiosInstance.get(`/category/subcategories/${id}`);
      setSubcategories(data.subcategories);
      console.log(data);
    } catch (err) {
      console.error("Error fetching subcategories:", err);
    }
  };

  const handleAddSubcategory = async () => {
    const trimmedSub = newSub.trim();
    if (!trimmedSub) return setError("Subcategory name cannot be empty.");
    if (!selectedFile) return setError("Please upload an image.");

    setLoading(true);
    const formData = new FormData();
    formData.append("title", trimmedSub);
    formData.append("category", categoryId);
    formData.append("image", selectedFile);

    try {
      const { data } = await axiosInstance.post("/subcategory/create", formData);
      setSubcategories((prev) => [...prev, data.subcategory].sort((a, b) => a.title.localeCompare(b.title)));
      setNewSub("");
      setSelectedFile(null);
      setDialogOpen(false);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // --- EDIT SUBCATEGORY WITH IMAGE SUPPORT ---
const handleEditSubcategory = async () => {
    const trimmedTitle = editData.title.trim();
    if (!trimmedTitle) return setEditError("Name cannot be empty.");

    setLoading(true);
    
    // Create FormData object
    const formData = new FormData();
    formData.append("title", trimmedTitle);
    formData.append("category", categoryId);
    
    // Ensure the file exists and is named "image" to match your backend: 
    // upload.fields([{ name: 'image' }])
    if (editData.file) {
      formData.append("image", editData.file);
    }

    try {
      // FIX: Added headers to ensure multipart/form-data is recognized
      const { data } = await axiosInstance.put(
        `/subcategory/update/${editData.id}`, 
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      
      if (data.success) {
        setSubcategories((prev) =>
          prev
            .map((sub) => (sub._id === data.subcategory._id ? data.subcategory : sub))
            .sort((a, b) => a.title.localeCompare(b.title))
        );

        setEditDialogOpen(false);
        setEditData({ id: "", title: "", file: null });
        setEditError("");
        
        // Optional: Refresh local state to show new image immediately
        // fetchSubcategories(categoryId); 
      }
    } catch (err) {
      console.error("Update Error:", err);
      setEditError(err.response?.data?.message || "Error updating subcategory.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubcategory = async (id) => {
    setDeleteLoading({ id, loading: true });
    try {
      await axiosInstance.delete(`/subcategory/delete/${id}`);
      fetchSubcategories(categoryId);
    } catch (err) {
      console.error("Error deleting subcategory:", err);
    } finally {
      setDeleteLoading({ id: null, loading: false });
    }
  };

  useEffect(() => { fetchCategoryId(); }, []);
  useEffect(() => { if (categoryId) fetchSubcategories(categoryId); }, [categoryId]);

  return (
    <div className="p-6 space-y-6">
      <Button variant="outline" onClick={() => navigate(-1)}>← Back</Button>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Sub Topic for: {categoryName}</h1>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2"><Plus size={18} /> Add Sub Topic</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Sub Topic</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input value={newSub} onChange={(e) => setNewSub(e.target.value)} />
              </div>
              <div>
                <Label>Thumbnail Image</Label>
                <Input type="file" accept="image/*" onChange={(e) => setSelectedFile(e.target.files[0])} />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button onClick={handleAddSubcategory} className="w-full" disabled={loading}>
                {loading ? <Loader className="animate-spin mr-2" size={18} /> : "Add Subcategory"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Sub Topic</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input 
                value={editData.title} 
                onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))} 
              />
            </div>
            <div>
              <Label>Update Image (Optional)</Label>
              <Input 
                type="file" 
                accept="image/*" 
                onChange={(e) => setEditData(prev => ({ ...prev, file: e.target.files[0] }))} 
              />
            </div>
            {editError && <p className="text-red-500 text-sm">{editError}</p>}
            <Button onClick={handleEditSubcategory} className="w-full" disabled={loading}>
              {loading ? <Loader className="animate-spin mr-2" size={18} /> : "Save Changes"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Card>
        <CardContent className="p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">SN</TableHead>
                <TableHead className="w-24">Image</TableHead>
                <TableHead>Sub Topic</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subcategories.map((sub, index) => (
                <TableRow key={sub._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 border">
                      {sub.image?.url ? (
                        <img src={sub.image.url} alt={sub.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex items-center justify-center h-full text-slate-400"><ImageIcon size={16} /></div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{sub.title}</TableCell>
                  <TableCell className="flex justify-end gap-2">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => {
                            setEditData({ id: sub._id, title: sub.title, file: null });
                            setEditDialogOpen(true);
                        }}
                    >
                      <Edit size={18} className="text-blue-500" />
                    </Button>
                    {deleteLoading.id === sub._id ? (
                      <Loader size={18} className="animate-spin" />
                    ) : (
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteSubcategory(sub._id)} className="text-red-500 hover:text-red-700">
                        <Trash2 size={18} />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Subcategory;