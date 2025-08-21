import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { axiosInstance } from "@/lib/AxiosInstance";
import { Send } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const CommentSection = ({ id }) => {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState();

  useEffect(() => {
    const getCourseComments = async () => {
      setLoading(true);
      await axiosInstance
        .get(`/comment/${id}`)
        .then((res) => {
          console.log(res);
          setComments(res.data.comments);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    };
    getCourseComments();
  }, [id]);

  

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Comments ({comments.length})</h3>    

      {/* Comments List */}
      <div className="space-y-6">
        {comments.length > 0 ? (
          [...comments].reverse().map((comment) => (
            <div key={comment?._id} className="border-b pb-6">
              <div className="flex items-start gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={comment?.createdby?.profileImg || "/placeholder.svg"}
                    alt={comment?.createdby?.firstName}
                  />
                  <AvatarFallback>
                    {comment?.createdby?.firstName?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">
                        {comment?.createdby?.firstName} {comment?.createdby?.lastName}
                      </p>
                      {comment?.createdby?.role && (
                        <span
                          className={`text-[10px] uppercase px-2 py-0.5 rounded-full ${comment.createdby.role === "admin"
                            ? "bg-red-600 text-white"
                            : comment.createdby.role === "teacher"
                              ? "bg-blue-600 text-white"
                              : "bg-green-600 text-white"
                            }`}
                        >
                          {comment.createdby.role}
                        </span>
                      )}
                      <span className="text-xs text-gray-500">{new Date(comment?.updatedAt).toLocaleDateString()}</span>


                    </div>
                  </div>
                  <p className="mt-1 text-gray-700">{comment?.text}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-6">
            No comments yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
