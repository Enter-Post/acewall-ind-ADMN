import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

export default function ConversationItem({ conversation, isActive, onClick }) {
  // const { name, avatar, message, time, unread, online } = conversation

  return (
    <div
      className={cn(

        "flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2  shadow-sm  cursor-pointer transition-all hover:shadow-md hover:bg-gray-50",
        isActive && "bg-green-50 border-green-200 shadow-md"
      )}
      onClick={onClick}
      >
      <Avatar className="h-16 w-16 flex items-center justify-center rounded-full border-2 border-green-200">
        <AvatarImage
          src={conversation.otherMember.profileImg}
          alt={conversation.otherMember.name}
          className="w-full h-full bg-cover rounded-full"
        />
        <AvatarFallback className="text-green-500 font-bold">
          {conversation.otherMember.name[0]}
        </AvatarFallback>
      </Avatar>

      <h3 className="text-md font-medium text-gray-800 text-center truncate w-full">
        {conversation.otherMember.name}
      </h3>

    </div>
  )
}

