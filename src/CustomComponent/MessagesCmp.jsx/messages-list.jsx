import { useContext, useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useParams } from "react-router-dom";
import { axiosInstance } from "@/lib/AxiosInstance";
import { GlobalContext } from "@/Context/GlobalProvider";

export default function MessageList({ messages, contactName, contactAvatar }) {
  const { user } = useContext(GlobalContext);
  const myId = user._id;

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6">
      <div className="space-y-4">
        {messages?.map((message) => {
          const isMyMessage = message?.sender._id === myId;

          return (
            <div
              key={message._id}
              className={cn(
                "flex gap-3",
                isMyMessage ? "justify-end" : "justify-start"
              )}
            >
              {!isMyMessage && (
                <div className="flex-shrink-0 mt-1">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={message.sender.profileImg}
                      alt={message.sender.name}
                    />
                    {/* <AvatarFallback>{message.sender.name[0]}</AvatarFallback> */}
                  </Avatar>
                </div>
              )}

              <div
                className={cn(
                  "max-w-[70%] rounded-2xl px-4 py-2 text-sm",
                  isMyMessage
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-800"
                )}
              >
                {message.text}
                <div
                  className={cn(
                    "text-xs mt-1",
                    isMyMessage ? "text-green-200 text-right" : "text-gray-500"
                  )}
                >
                  {/* {message.createdAt.split("T")[1].split(".")[0]} */}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
