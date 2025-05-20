import { Button } from "@/components/ui/button";
import { Megaphone, Edit, Trash2 } from "lucide-react";

export default function AnnouncementCard({ announcement, onDelete }) {
  return (
    <tr className="border-b">
      <td className="p-4 text-gray-700">{announcement.date}</td>
      <td className="p-4 text-indigo-500 flex items-center">
        <Megaphone className="h-4 w-4 mr-2 text-indigo-400" />
        {announcement.title}
      </td>
      <td className="p-4 text-gray-700">{announcement.message}</td>
      <td className="p-4 flex justify-end space-x-2">
        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500">
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-red-500"
          onClick={() => onDelete?.(announcement._id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </td>
    </tr>
  );
}
