"use client";

import RouteGuard from "@/app/others/components/Auth/common/RouteGuard";
import { NavBar } from "@/app/others/components/Home";
import React, { useState } from "react";
import Prism from "@/app/others/components/ReactBits/Prism";
import GroupInvitesManager from "../others/components/User/MyAcount/Groupinvites/GroupInvitesManager";
import { Users, MessageCircle, Crown, Search } from "lucide-react";
import GroupChatManager from "../others/components/User/MyAcount/Chat/GroupChatManager";

const lexendMedium = { className: "font-medium" };

const page = () => {
    const [activeTab, setActiveTab] = useState<'invites' | 'chats'>('invites');

    return (
        <RouteGuard allowedRoles={['user']}>
            <div className="relative min-h-screen bg-black">
                <div className="fixed top-9 inset-0 z-0">
                    <Prism
                        animationType="rotate"
                        timeScale={0.5}
                        height={3.5}
                        baseWidth={4}
                        scale={4}
                        hueShift={0.7}
                        colorFrequency={1}
                        noise={0}
                        glow={0.5}
                    />
                </div>

                <div className="relative z-20">
                    <NavBar />
                </div>

                <div className="relative z-10 max-w-6xl mx-auto p-6">
                    {/* Top Tab Bar */}
                    <div className="mb-8 flex justify-center">
                        <div className="flex gap-4">
                            <button
                                onClick={() => setActiveTab('invites')}
                                className={`${lexendMedium.className} px-6 py-3 rounded-xl transition-all duration-200 flex items-center gap-2 ${activeTab === 'invites'
                                        ? 'bg-purple-600 text-white'
                                        : 'bg-white/10 text-gray-400 hover:text-white'
                                    }`}
                            >
                                <Users className="w-4 h-4" />
                                Group Invites
                            </button>

                            <button
                                onClick={() => setActiveTab('chats')}
                                className={`${lexendMedium.className} px-6 py-3 rounded-xl transition-all duration-200 flex items-center gap-2 ${activeTab === 'chats'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white/10 text-gray-400 hover:text-white'
                                    }`}
                            >
                                <MessageCircle className="w-4 h-4" />
                                Group Chats
                                <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">3</span>
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    {activeTab === 'invites' ? (
                        <GroupInvitesManager />
                    ) : (
                        <GroupChatManager />
                    )}
                </div>
            </div>
        </RouteGuard>
    );
};

export default page;
