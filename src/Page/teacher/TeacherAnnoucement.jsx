import { useState, useContext, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import AnnouncementList from "../../CustomComponent/teacher/Announcement/AnnouncementList";
import AnnouncementDialog from "../../CustomComponent/teacher/Announcement/AnnouncementDialog";
import { axiosInstance } from "@/lib/AxiosInstance";
import { GlobalContext } from "@/Context/GlobalProvider";

export default function TeacherAnnouncement() {
  const { user } = useContext(GlobalContext);

  const [showNewDialog, setShowNewDialog] = useState(false);
  const [currentAnnouncements, setCurrentAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] = useState(null);
  const [announcements, setAnnouncements] = useState([]);


  // Function to fetch announcements
  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/announcements/getbyteacher/${user._id}`);
      const rawAnnouncements = res.data.announcements;

      const formatted = rawAnnouncements.map((item) => ({
        _id: item._id,
        date: new Date(item.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        title: item.title,
        message: item.message,
      }));

      setCurrentAnnouncements(formatted);
    } catch (error) {
      console.error("Error fetching teacher announcements:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchAnnouncements();
    }
  }, [user?._id]);

  const handleDeleteAnnouncement = (announcementId) => {
    setAnnouncementToDelete(announcementId);
    setShowDeleteDialog(true);
  };

  const confirmDeleteAnnouncement = async () => {
    if (!announcementToDelete) return;
    try {
      await axiosInstance.delete(`/announcements/${announcementToDelete}`);
      setCurrentAnnouncements((prev) =>
        prev.filter((a) => a._id !== announcementToDelete)
      );
    } catch (error) {
      console.error("Failed to delete announcement:", error.response?.data || error.message);
    } finally {
      setShowDeleteDialog(false);
      setAnnouncementToDelete(null);
    }
  };

  // This function is called after new announcement creation
  const handleAnnouncementCreated = () => {
    fetchAnnouncements();       // Refresh announcements list
    setShowNewDialog(false);    // Close the create dialog
    // If you want to navigate to a specific announcement page, add router push here.
  };

  return (
    <div className="mx-auto p-3 md:p-0">
      <div className="flex flex-col mb-2">
        <p className="text-xl py-4 mb-8 pl-6 font-semibold bg-acewall-main text-white rounded-lg">
          Announcements
        </p>
        <div className="flex justify-end">
          <Button
            className="bg-green-500 hover:bg-green-600"
            onClick={() => setShowNewDialog(true)}
          >
            + Add New
          </Button>
        </div>
      </div>

      {loading ? (
        <p>Loading announcements...</p>
      ) : (
        <AnnouncementList
          title="Announcements"
          announcements={currentAnnouncements}
          onDelete={handleDeleteAnnouncement}
        />
      )}

      <AnnouncementDialog
        open={showNewDialog}
        onOpenChange={setShowNewDialog}
        onCreated={handleAnnouncementCreated} // <-- pass callback here
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Announcement</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete this announcement? This action
            cannot be undone.
          </p>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700"
              onClick={confirmDeleteAnnouncement}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}