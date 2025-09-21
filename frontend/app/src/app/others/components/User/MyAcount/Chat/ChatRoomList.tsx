import React from "react";
import { MessageCircle } from "lucide-react";

interface ChatRoomListProps {
  chatRooms: {
    id: string;
    name: string;
    movieTitle: string;
    theaterName: string;
    participantsCount: number;
    unreadCount: number;
  }[];
  selectedChatId: string;
  onSelect: (id: string) => void;
}

const ChatRoomList: React.FC<ChatRoomListProps> = ({
  chatRooms,
  selectedChatId,
  onSelect,
}) => {
  return (
    <div className="w-1/3 bg-white/5 border-r border-white/10 flex flex-col">
      <div className="p-4 border-b border-white/10">
        <h3 className="font-medium text-white">Active Groups</h3>
      </div>
      <div className="overflow-y-auto flex-1">
        {chatRooms.length === 0 && (
          <p className="text-gray-400 p-4">No active chat groups found.</p>
        )}
        {chatRooms.map((chat) => (
          <div
            key={chat.id}
            onClick={() => onSelect(chat.id)}
            className={`p-4 border-b border-white/5 cursor-pointer ${
              selectedChatId === chat.id ? "bg-blue-500/20" : "hover:bg-white/5"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 overflow-hidden">
                <h4 className="font-medium text-white text-sm truncate" title={chat.name}>
                  {chat.name}
                </h4>
                <p className="text-xs text-gray-400 truncate" title={chat.movieTitle}>
                  {chat.movieTitle}
                </p>
                <p className="text-xs text-gray-300 mt-1 truncate">{chat.theaterName}</p>
              </div>
              {chat.unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {chat.unreadCount}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatRoomList;
