import React, { useState } from "react";
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
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Category = () => {
  const [categories, setCategories] = useState([
    { name: "Programming", courses: 12 },
    { name: "Design", courses: 8 },
    { name: "Marketing", courses: 5 },
  ]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    setCategories((prev) => [
      ...prev,
      { name: newCategoryName.trim(), courses: 0 },
    ]);
    setNewCategoryName("");
    setDialogOpen(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Categories</h1>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
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
              <Button onClick={handleAddCategory} className="w-full">
                Add Category
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
                <TableHead>Category</TableHead>
                <TableHead>No of Courses</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((cat, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <button
                      onClick={() =>
                        navigate(`/teacher/subcategory/${encodeURIComponent(cat.name)}`)
                      }
                      className="text-blue-600 hover:underline cursor-pointer"
                    >
                      {cat.name}
                    </button>
                  </TableCell>
                  <TableCell>{cat.courses}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Category;
