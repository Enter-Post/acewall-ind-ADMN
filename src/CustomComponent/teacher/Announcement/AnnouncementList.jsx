import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import AnnouncementCard from "../Announcement/AnnouncementCard";

export default function AnnouncementList({ title, announcements, onDelete }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="border rounded-lg overflow-hidden bg-white mb-4">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="border-b">
          <CollapsibleTrigger className="flex items-center w-full p-4 text-left">
            <ChevronDown className={`h-5 w-5 mr-2 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            <h2 className="text-md font-semibold">
              {title} ({announcements.length})
            </h2>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="p-4 text-left font-medium text-gray-600 w-1/6">Date</th>
                  <th className="p-4 text-left font-medium text-gray-600 w-1/4">Title</th>
                  <th className="p-4 text-left font-medium text-gray-600">Message Summary</th>
                  <th className="p-4 w-24"></th>
                </tr>
              </thead>
              <tbody>
                {announcements.map((announcement) => (
                  <AnnouncementCard
                    key={announcement._id}
                    announcement={announcement}
                    onDelete={onDelete}
                  />))}
              </tbody>
            </table>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
