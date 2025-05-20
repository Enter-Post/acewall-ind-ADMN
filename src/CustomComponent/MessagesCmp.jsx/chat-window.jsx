import { useContext, useEffect, useState } from "react";
import { MoreHorizontal, Send, Edit } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getContactByName, messages as initialMessages } from "@/lib/data";
import MessageList from "./messages-list";
import { axiosInstance } from "@/lib/AxiosInstance";
import { useParams } from "react-router-dom";
import { GlobalContext } from "@/Context/GlobalProvider";

export default function ChatWindow() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [chat, setChat] = useState();

  const { user, socket, currentConversation } = useContext(GlobalContext);

  const activeConversation = useParams().id;

  const subscribeToMessages = () => {
    socket.on("newMessage", (message) => {
      setMessages([...messages, newMessage]);
    });
  };

  const unsubscripteToMessages = () => {
    socket.off("newMessage");
  };

  useEffect(() => {
    const getMessaages = async () => {
      await axiosInstance
        .get(`/messeges/get/${activeConversation}`)
        .then((res) => {
          setMessages(res.data.messages);
          // console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getMessaages();
    subscribeToMessages();
  }, [activeConversation, subscribeToMessages, unsubscripteToMessages]);

  // return;
  const handleSendMessage = async () => {
    await axiosInstance
      .post(`/messeges/create/${activeConversation}`, {
        text: newMessage,
      })
      .then((res) => {
        // console.log(res.data, "res.datares.data");

        setMessages([...messages, res.data.newMessage]);
        setNewMessage("");
      })
      .catch((err) => {
        console.log(err);
      });

    /// real time functinality
    socket.emit("sendMessage", {
      senderId: user._id,
      receiverId: activeConversation,
      text: newMessage,
    });
  };

  return (
    <div className="flex flex-col h-full overflow-auto hide-scrollbar border-red-600">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={currentConversation?.otherMember.profileImg} />
            <AvatarFallback>{currentConversation?.otherMember.name}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">{currentConversation?.otherMember.name}</h3>
          </div>
        </div>
      </div>

      <MessageList
        messages={messages}
        contactName={"contactName"}
        contactAvatar={"contact?.avatar"}
      />

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Type your message"
              className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            />
          </div>
          <Button
            className="bg-green-600 hover:bg-green-700 rounded-full h-12 w-12 flex items-center justify-center"
            onClick={handleSendMessage}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
