import React, { useState } from "react";
import { useParams } from "react-router-dom";
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
import { Plus } from "lucide-react";

const Subcategory = () => {
  const { categoryName } = useParams();

  // Sample subcategory data
  const initialSubcategories = {
    Programming: ["Web Development", "Mobile Apps", "Data Science"],
    Design: ["UI/UX", "Graphic Design", "3D Modeling"],
    Marketing: ["Digital Marketing", "SEO", "Content Strategy"],
  };

  const [subcategories, setSubcategories] = useState(() => {
    const decodedCategory = decodeURIComponent(categoryName);
    return initialSubcategories[decodedCategory] || [];
  });

  const [newSub, setNewSub] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleAddSubcategory = () => {
    if (!newSub.trim()) return;
    setSubcategories((prev) => [...prev, newSub.trim()]);
    setNewSub("");
    setDialogOpen(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          Subcategories for: {decodeURIComponent(categoryName)}
        </h1>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus size={18} />
              Add Sub Category
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Sub Category</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <Label htmlFor="subcategory">Sub Category Name</Label>
              <Input
                id="subcategory"
                value={newSub}
                onChange={(e) => setNewSub(e.target.value)}
                placeholder="e.g. Web Development"
              />
              <Button onClick={handleAddSubcategory} className="w-full">
                Add
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
                <TableHead>Sub Category</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subcategories.map((sub, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{sub}</TableCell>
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
    