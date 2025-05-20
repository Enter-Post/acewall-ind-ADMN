import { Plus, Search } from "lucide-react";
import ConversationItem from "./conversation-item";
// import { conversations } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { axiosInstance } from "@/lib/AxiosInstance";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GlobalContext } from "@/Context/GlobalProvider";

export default function ConversationList({
  activeConversation,
  setActiveConversation,
}) {
  const [conversations, setConversations] = useState();
  const { user, currentConversation, setCurrentConversation } =
    useContext(GlobalContext);

  console.log(conversations, "conversations");

  useEffect(() => {
    const getConversations = () => {
      axiosInstance
        .get("/conversation/get")
        .then((res) => {
          setConversations(res.data.conversations);
          console.log(res, "res");
        })
        .catch((err) => console.log(err));
    };
    getConversations();
  }, []);

  const handleActiveConversation = async (id) => {
    setActiveConversation(id);
  };

  return (
    <div className="flex flex-col h-full overflow-auto hide-scrollbar p-4 items-center">

      {conversations && conversations.length > 0 ? (
        <div className="overflow-y-auto gap-3 flex flex-wrap">
          {conversations.map((conversation) => (
            <Link
              onClick={() => setCurrentConversation(conversation)}
              to={
                user.role === "student"
                  ? `/student/messages/${conversation.conversationId}`
                  : `/teacher/messages/${conversation.conversationId}`
              }
              key={conversation._id}
            >
              <ConversationItem
                conversation={conversation}
                // isActive={conversation.name === activeConversation}
              />
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 mt-10">
          No conversations found.
        </div>
      )}
    </div>
  );
  
}
