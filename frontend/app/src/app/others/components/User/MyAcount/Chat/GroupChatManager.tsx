"use client";

import React, { useState } from "react";
import { MessageCircle, Send, Users } from "lucide-react";

const lexendBold = { className: "font-bold" };
const lexendMedium = { className: "font-medium" };
const lexendSmall = { className: "font-normal text-sm" };

interface ChatRoom {
  id: string;
  name: string;
  movieName: string;
  participants: number;
  lastMessage: string;
  unreadCount: number;
}

const GroupChatManager: React.FC = () => {
  const [selectedChatId, setSelectedChatId] = useState<string>('1');
  const [messageInput, setMessageInput] = useState('');

  const chatRooms: ChatRoom[] = [
    {
      id: '1',
      name: 'Avengers Group',
      movieName: 'Avengers: Endgame',
      participants: 4,
      lastMessage: 'See you at the theater!',
      unreadCount: 2
    },
    {
      id: '2',
      name: 'Weekend Squad',
      movieName: 'Spider-Man',
      participants: 6,
      lastMessage: 'Grab dinner before?',
      unreadCount: 0
    }
  ];

  const messages = [
    { id: '1', sender: 'Rahul', content: 'Hey everyone! Movie tonight 🎬', time: '10:32 AM' },
    { id: '2', sender: 'Priya', content: 'Meet 30 mins before?', time: '10:35 AM' },
    { id: '3', sender: 'Arjun', content: 'Ill bring snacks 🍿', time: '10:38 AM' }
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className={`${lexendBold.className} text-3xl text-white mb-2`}>Group Chats</h1>
        <p className={`${lexendSmall.className} text-gray-400`}>Chat with your movie group members</p>
      </div>

      <div className="flex h-[500px] bg-white/5 rounded-2xl overflow-hidden">
        {/* Chat List */}
        <div className="w-1/3 bg-white/5 border-r border-white/10">
          <div className="p-4 border-b border-white/10">
            <h3 className={`${lexendMedium.className} text-white`}>Active Groups</h3>
          </div>
          
          <div className="overflow-y-auto">
            {chatRooms.map((chat) => (
              <div
                key={chat.id}
                onClick={() => setSelectedChatId(chat.id)}
                className={`p-4 border-b border-white/5 cursor-pointer ${
                  selectedChatId === chat.id ? 'bg-blue-500/20' : 'hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className={`${lexendMedium.className} text-white text-sm`}>{chat.name}</h4>
                    <p className="text-xs text-gray-400">{chat.movieName}</p>
                    <p className="text-xs text-gray-300 mt-1">{chat.lastMessage}</p>
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

        {/* Chat Messages */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-white/10 flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
              <MessageCircle className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className={`${lexendMedium.className} text-white`}>Avengers Group</h3>
              <p className="text-xs text-gray-400 flex items-center gap-1">
                <Users className="w-3 h-3" /> 4 members
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className="flex gap-3">
                <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white">{msg.sender[0]}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`${lexendMedium.className} text-sm text-white`}>{msg.sender}</span>
                    <span className="text-xs text-gray-400">{msg.time}</span>
                  </div>
                  <p className="text-sm text-gray-200">{msg.content}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-white/10">
            <div className="flex gap-2">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-white/10 text-white placeholder-gray-400 px-4 py-2 rounded-lg focus:outline-none"
                onKeyPress={(e) => e.key === 'Enter' && setMessageInput('')}
              />
              <button
                onClick={() => setMessageInput('')}
                className="bg-blue-500 hover:bg-blue-600 p-2 rounded-lg transition-colors"
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupChatManager;
