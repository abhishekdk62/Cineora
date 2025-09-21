import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, Users, MoreVertical, Edit2, Trash2, Check, X, UserPlus, UserMinus } from "lucide-react";

interface Participant {
  _id: string;
  username: string;
}

interface ChatRoom {
  id: string;
  name: string;
  participantsCount: number;
}

export interface MessageItem {
  _id: string;
  chatRoomId: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  isDeleted: boolean;
  messageType: 'TEXT' | 'SYSTEM' | 'BOOKING_UPDATE' | 'IMAGE';
  senderId: string;
  senderName: string;
  replyToMessageId?: string;
  // System message specific fields
  systemData?: {
    userId: string;
    username: string;
  };
  systemMessageType?: string;
}

interface ChatMessagesProps {
  chatRoom?: ChatRoom;
  messages: MessageItem[];
  messageInput: string;
  onMessageChange: (value: string) => void;
  onSend: () => void;
  onEditMessage: (messageId: string, newContent: string) => void;
  onDeleteMessage: (messageId: string) => void;
  id: string | number;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
  chatRoom,
  messages,
  messageInput,
  onMessageChange,
  onSend,
  onEditMessage,
  onDeleteMessage,
  id
}) => {
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [showOptionsMenu, setShowOptionsMenu] = useState<string | null>(null);
  
  // Refs for auto-scroll functionality
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Helper function to check if message can be edited/deleted (within 5 minutes)
  const canModifyMessage = (messageCreatedAt: string): boolean => {
    const messageDate = new Date(messageCreatedAt);
    const currentDate = new Date();
    const diffInMilliseconds = currentDate.getTime() - messageDate.getTime();
    const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
    
    return diffInMinutes <= 5;
  };

  // Function to render system message content
  const renderSystemMessage = (msg: MessageItem) => {
    const username = msg.systemData?.username || 'Someone';
    
    switch (msg.systemMessageType) {
      case 'USER_JOINED':
        return `${username} joined the chat`;
      case 'USER_LEFT':
        return `${username} left the chat`;
      case 'BOOKING_UPDATE':
        return `${username} updated the booking`;
      default:
        return msg.content || `${username} performed an action`;
    }
  };

  // Auto-scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll to bottom when messages update
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!chatRoom) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        Select a chat room to start messaging
      </div>
    );
  }

  const handleEditStart = (messageId: string, currentContent: string) => {
    setEditingMessageId(messageId);
    setEditingContent(currentContent);
    setShowOptionsMenu(null);
  };

  const handleEditSave = () => {
    if (editingMessageId && editingContent.trim()) {
      onEditMessage(editingMessageId, editingContent.trim());
      setEditingMessageId(null);
      setEditingContent("");
    }
  };

  const handleEditCancel = () => {
    setEditingMessageId(null);
    setEditingContent("");
  };

  const handleDelete = (messageId: string) => {
    onDeleteMessage(messageId);
    setShowOptionsMenu(null);
  };

  const toggleOptionsMenu = (messageId: string) => {
    setShowOptionsMenu(showOptionsMenu === messageId ? null : messageId);
  };

  return (
    <div className="flex-1 flex flex-col bg-white/5 rounded-tr-2xl">
      <div className="p-4 border-b border-white/10 flex items-center gap-3">
        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
          <MessageCircle className="w-4 h-4 text-white" />
        </div>
        <div>
          <h3 className="font-medium text-white truncate">{chatRoom.name}</h3>
          <p className="text-xs text-gray-400 flex items-center gap-1 truncate">
            <Users className="w-3 h-3" />
            {chatRoom.participantsCount} member{chatRoom.participantsCount !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div 
        ref={messagesContainerRef}
        className="flex-1 p-4 overflow-y-auto space-y-3"
      >
        {messages.length === 0 ? (
          <p className="text-gray-400 text-center">No messages yet. Say hi!</p>
        ) : (
          messages.map((msg) => {
            const isOwnMessage = String(msg.senderId) === String(id);
            const isSystemMessage = msg.messageType === 'SYSTEM';
            const isEditing = editingMessageId === msg._id;
            const canModify = canModifyMessage(msg.createdAt);
            
            // Render system messages differently - centered and small
            if (isSystemMessage) {
              return (
                <div key={msg._id} className="flex justify-center my-2">
                  <div className="flex items-center gap-2 bg-gray-700/50 text-gray-300 px-3 py-1 rounded-full text-xs">
                    {msg.systemMessageType === 'USER_JOINED' && <UserPlus className="w-3 h-3" />}
                    {msg.systemMessageType === 'USER_LEFT' && <UserMinus className="w-3 h-3" />}
                    <span className="italic">
                      {renderSystemMessage(msg)}
                    </span>
                    <span className="text-gray-400 ml-2">
                      {new Date(msg.createdAt).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                </div>
              );
            }
            
            // Regular message rendering
            return (
              <div 
                key={msg._id} 
                className={`flex gap-3 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs text-white">
                    {msg.senderName[0]?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div className={`max-w-[70%] ${isOwnMessage ? 'items-end' : 'items-start'} flex flex-col`}>
                  <div className={`flex items-center gap-2 mb-1 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
                    <span className="font-medium text-sm text-white">
                      {isOwnMessage ? 'You' : msg.senderName}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(msg.createdAt).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                      {msg.updatedAt && msg.updatedAt !== msg.createdAt && (
                        <span className="ml-1 text-gray-500">(edited)</span>
                      )}
                    </span>
                  </div>
                  
                  <div className="relative group">
                    <div 
                      className={`px-4 py-2 rounded-lg max-w-full break-words ${
                        msg.isDeleted 
                          ? 'bg-gray-800 text-gray-500 italic' 
                          : isOwnMessage 
                            ? 'bg-blue-600 text-white rounded-br-sm' 
                            : 'bg-gray-700 text-gray-200 rounded-bl-sm'
                      }`}
                    >
                      {isEditing ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={editingContent}
                            onChange={(e) => setEditingContent(e.target.value)}
                            className="w-full bg-white/10 text-white px-2 py-1 rounded text-sm focus:outline-none"
                            onKeyPress={(e) => {
                              if (e.key === "Enter") handleEditSave();
                              if (e.key === "Escape") handleEditCancel();
                            }}
                            autoFocus
                          />
                          <div className="flex gap-1 justify-end">
                            <button
                              onClick={handleEditSave}
                              className="p-1 bg-green-600 hover:bg-green-700 rounded"
                              title="Save"
                            >
                              <Check className="w-3 h-3" />
                            </button>
                            <button
                              onClick={handleEditCancel}
                              className="p-1 bg-gray-600 hover:bg-gray-700 rounded"
                              title="Cancel"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm">{msg.content}</p>
                      )}
                    </div>

                    {/* Options Menu - Only show for own messages, not deleted, not editing, and within 5 minutes */}
                    {isOwnMessage && !msg.isDeleted && !isEditing && canModify && (
                      <div className="relative">
                        <button
                          onClick={() => toggleOptionsMenu(msg._id)}
                          className="absolute -top-8 right-0 p-1 bg-gray-600 hover:bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Message options"
                        >
                          <MoreVertical className="w-3 h-3 text-white" />
                        </button>

                        {showOptionsMenu === msg._id && (
                          <div className="absolute top-0 right-0 mt-2 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-10">
                            <button
                              onClick={() => handleEditStart(msg._id, msg.content)}
                              className="flex items-center gap-2 px-3 py-2 text-sm text-white hover:bg-gray-700 rounded-t-lg w-full text-left"
                            >
                              <Edit2 className="w-3 h-3" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(msg._id)}
                              className="flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-gray-700 rounded-b-lg w-full text-left"
                            >
                              <Trash2 className="w-3 h-3" />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        {/* Invisible element at the end for scrolling reference */}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-white/10">
        <div className="flex gap-2">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => onMessageChange(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-white/10 text-white placeholder-gray-400 px-4 py-2 rounded-lg focus:outline-none"
            onKeyPress={(e) => e.key === "Enter" && onSend()}
          />
          <button
            onClick={onSend}
            className="bg-blue-500 hover:bg-blue-600 p-2 rounded-lg transition-colors"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatMessages;
