"use client";

import React, { useEffect, useState } from "react";
import {
  getMessages,
  getUserChatRooms,
  sendMessageApi,
  SendMessageDto,
  editMessage,
  deleteMessage,
  EditMessageDto,
  DeleteMessageDto
} from "@/app/others/services/userServices/chatServices";
import ChatRoomList from "./ChatRoomList";
import ChatMessages, { MessageItem } from "./ChatMessages";
import { useSelector } from "react-redux";
import { RootState } from "@/app/others/redux/store";
import { useSocket } from "@/app/others/Utils/useSocket";

interface ChatRoom {
  id: string;
  name: string;
  movieTitle: string;
  theaterName: string;
  participantsCount: number;
  lastMessageTime: string;
  unreadCount: number;
}

const GroupChatManager: React.FC = () => {
  const [selectedChatId, setSelectedChatId] = useState("");
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const id = useSelector((state: RootState) => state?.auth?.user?.id) || 4545345;
  const email = useSelector((state: RootState) => state?.auth?.user?.email);
  const { socket, isConnected, joinChatRoom, leaveChatRoom } = useSocket();

  useEffect(() => {
    const handleNewMessage = (event: MessageItem) => {
      const messageData = event.detail;
      if (messageData.chatRoomId === selectedChatId && messageData.senderId !== String(id)) {
        const newMessage: MessageItem = {
          _id: messageData._id,
          chatRoomId: messageData.chatRoomId,
          content: messageData.content,
          createdAt: messageData.createdAt,
          updatedAt: messageData.updatedAt,
          isDeleted: messageData.isDeleted,
          messageType: messageData.messageType,
          senderId: messageData.senderId,
          senderName: messageData.senderName || "Unknown",
          systemData: messageData.systemData,
          systemMessageType: messageData.systemMessageType,
          replyToMessageId: messageData.replyToMessageId,
        };
        setMessages(prev => [...prev, newMessage]);
      }
    };

    const handleMessageEdited = (event: MessageItem) => {
      const { messageId, content, chatRoomId } = event.detail;
      if (chatRoomId === selectedChatId) {
        setMessages(prev =>
          prev.map(msg =>
            msg._id === messageId
              ? { ...msg, content, updatedAt: new Date().toISOString() }
              : msg
          )
        );
      }
    };

    const handleMessageDeleted = (event: MessageItem) => {
      const { messageId, chatRoomId } = event.detail;
      if (chatRoomId === selectedChatId) {
        setMessages(prev =>
          prev.map(msg =>
            msg._id === messageId
              ? { ...msg, isDeleted: true, content: "This message was deleted" }
              : msg
          )
        );
      }
    };

    window.addEventListener('newMessage', handleNewMessage);
    window.addEventListener('messageEdited', handleMessageEdited);
    window.addEventListener('messageDeleted', handleMessageDeleted);

    return () => {
      window.removeEventListener('newMessage', handleNewMessage);
      window.removeEventListener('messageEdited', handleMessageEdited);
      window.removeEventListener('messageDeleted', handleMessageDeleted);
    };
  }, [selectedChatId, id]);

  useEffect(() => {
    if (selectedChatId && isConnected) {
      joinChatRoom(selectedChatId);

      return () => {
        leaveChatRoom(selectedChatId);
      };
    }
  }, [selectedChatId, isConnected]);

  useEffect(() => {
    const fetchUserChatRooms = async () => {
      try {
        const res = await getUserChatRooms();
        if (res.success && res.data) {
          const rooms: ChatRoom[] = res.data.map((room: ChatRoom) => ({
            id: room._id,
            name: room.roomName,
            movieTitle: room.movieInfo.title,
            theaterName: room.theaterInfo.name,
            participantsCount: room.participantCount,
            lastMessageTime: room.lastMessageAt,
            unreadCount: 0,
          }));
          setChatRooms(rooms);
          if (rooms.length > 0) setSelectedChatId(rooms[0].id);
        } else {
          setChatRooms([]);
        }
      } catch {
        setChatRooms([]);
      }
    };
    fetchUserChatRooms();
  }, []);

  const selectedChatRoom = chatRooms.find((r) => r.id === selectedChatId);

  const getMessagesFunc = async () => {
    if (!selectedChatId) {
      setMessages([]);
      return;
    }

    try {
      const response = await getMessages({ chatRoomId: selectedChatId });
      console.log("the messages are:", response);

      if (response.success && response.data && response.data.messages) {
        const mappedMessages: MessageItem[] = response.data.messages.map((msg: MessageItem) => ({
          _id: msg._id,
          chatRoomId: msg.chatRoomId,
          content: msg.content,
          createdAt: msg.createdAt,
          updatedAt: msg.updatedAt,
          isDeleted: msg.isDeleted,
          messageType: msg.messageType,
          senderId: msg.senderId,
          senderName: msg.senderName || "Unknown",
          systemData: msg.systemData, 
          systemMessageType: msg.systemMessageType, 
          replyToMessageId: msg.replyToMessageId,
        }));

        const systemMessages = mappedMessages.filter(m => m.messageType === 'SYSTEM');
        console.log("System messages found:", systemMessages);
        systemMessages.forEach(sm => {
          console.log(`System message: ${sm.systemMessageType}, username: ${sm.systemData?.username}`);
        });

        setMessages(mappedMessages);
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.log(error);
      setMessages([]);
    }
  };

  useEffect(() => {
    getMessagesFunc();
  }, [selectedChatId]);

  const sendMessage = () => {
    if (!messageInput.trim()) return;
    sendMsg();
    setMessageInput("");
  };

  const sendMsg = async () => {
    if (!messageInput.trim() || !selectedChatId) return;

    try {
      const payload: SendMessageDto = {
        chatRoomId: selectedChatId,
        content: messageInput.trim(),
        messageType: 'TEXT',
      };
      console.log('send data', payload);

      const response = await sendMessageApi(payload);
      console.log(response);

      const newMessage: MessageItem = {
        _id: `temp-${Date.now()}`,
        chatRoomId: selectedChatId,
        content: messageInput.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isDeleted: false,
        messageType: "TEXT",
        senderId: String(id),
        senderName: email?.split("@")[0]
      };

      setMessages(prev => [...prev, newMessage]);
      setMessageInput("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleEditMessage = async (messageId: string, newContent: string) => {
    try {
      const payload: EditMessageDto = {
        messageId,
        content: newContent
      };

      const response = await editMessage(payload);
      console.log("Edit response:", response);

      if (response.success) {
        setMessages(prev =>
          prev.map(msg =>
            msg._id === messageId
              ? { ...msg, content: newContent, updatedAt: new Date().toISOString() }
              : msg
          )
        );
      }
    } catch (error) {
      console.error("Failed to edit message:", error);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      const payload: DeleteMessageDto = {
        messageId
      };

      const response = await deleteMessage(payload);
      console.log("Delete response:", response);

      if (response.success) {
        setMessages(prev =>
          prev.map(msg =>
            msg._id === messageId
              ? { ...msg, isDeleted: true, content: "This message was deleted" }
              : msg
          )
        );
      }
    } catch (error) {
      console.error("Failed to delete message:", error);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-bold text-3xl text-white mb-2">Group Chats</h1>
        <p className="text-sm text-gray-400">Chat with your movie group members</p>
      </div>
      <div className="flex h-[500px] bg-white/5 rounded-2xl overflow-hidden">
        <ChatRoomList chatRooms={chatRooms} selectedChatId={selectedChatId} onSelect={setSelectedChatId} />
        {!chatRooms.length ? (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            You have not joined any groups yet.
          </div>
        ) : selectedChatId ? (
          <ChatMessages
            chatRoom={selectedChatRoom}
            messages={messages}
            messageInput={messageInput}
            onMessageChange={setMessageInput}
            onSend={sendMessage}
            onEditMessage={handleEditMessage}
            onDeleteMessage={handleDeleteMessage}
            id={id}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            Select a chat group to start messaging.
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupChatManager;
