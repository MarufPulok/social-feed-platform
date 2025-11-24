"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useReactionUsers } from "@/hooks/useReactionsQuery";
import { ReactionType } from "@/validators/reaction.validator";
import { default as Image, default as NextImage } from "next/image";
import Link from "next/link";
import { useState } from "react";

interface ReactionsModalProps {
  targetId: string;
  targetType: "post" | "comment";
  isOpen: boolean;
  onClose: () => void;
}

export default function ReactionsModal({
  targetId,
  targetType,
  isOpen,
  onClose,
}: ReactionsModalProps) {
  const { data, isLoading } = useReactionUsers(targetId, targetType);

  const reactions = data?.data?.reactions;

  // Reaction icon paths with color mappings
  const reactionConfig = {
    like: { icon: "/svg/like_react.svg", color: "#1877F2", bg: "#E7F3FF" },
    love: { icon: "/svg/love_react.svg", color: "#F02849", bg: "#FFE8EC" },
    haha: { icon: "/svg/haha_react.svg", color: "#F7B125", bg: "#FFF4E0" },
    angry: { icon: "/svg/angry_react.svg", color: "#F05424", bg: "#FFE8E0" },
  };

  // Get all users
  const getUsers = () => {
    if (!reactions) return [];
    return [
      ...reactions.like,
      ...reactions.love,
      ...reactions.haha,
      ...reactions.angry,
    ];
  };

  const users = getUsers();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[560px] p-0 gap-0 overflow-hidden rounded-2xl border-0 shadow-2xl bg-white">
        {/* Header with gradient */}
        <DialogHeader className="px-6 py-5 border-b border-gray-100 bg-gradient-to-br from-white to-gray-50/50">
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
            Reactions
          </DialogTitle>
        </DialogHeader>

        {/* User List with enhanced design */}
        <div 
          className="h-[440px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400"
          style={{
            background: "linear-gradient(to bottom, #FAFAFA 0%, #FFFFFF 100%)",
          }}
        >
          {isLoading ? (
            <div className="flex flex-col justify-center items-center py-20">
              <div className="relative">
                <div 
                  className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200"
                  style={{
                    borderTopColor: "#6366F1",
                  }}
                />
                <div 
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 rounded-full"
                  style={{
                    backgroundColor: "#EEF2FF",
                  }}
                />
              </div>
              <p className="mt-4 text-sm font-medium text-gray-500">Loading reactions...</p>
            </div>
          ) : users.length > 0 ? (
            <div className="py-2">
              {users.map((user, index) => {
                // Find the user's reaction type
                const userReactionType = Object.entries(reactions || {}).find(
                  ([_, userList]) => userList.some((u) => u._id === user._id)
                )?.[0] as ReactionType | undefined;

                const userReactionConfig = userReactionType ? reactionConfig[userReactionType] : null;

                return (
                  <div
                    key={user._id}
                    className="group flex items-center px-5 py-3 mx-2 rounded-xl transition-all duration-300 hover:shadow-md"
                    style={{
                      backgroundColor: "white",
                      animation: `slideIn 0.3s ease-out ${index * 0.05}s both`,
                    }}
                  >
                    <Link href="/profile" className="flex-shrink-0 relative">
                      <div className="relative">
                        {user.avatar ? (
                          <Image
                            src={user.avatar}
                            alt={`${user.firstName} ${user.lastName}`}
                            width={52}
                            height={52}
                            className="rounded-full object-cover ring-2 ring-gray-100 group-hover:ring-4 transition-all duration-300"
                          />
                        ) : (
                          <div
                            className="rounded-full ring-2 ring-gray-100 group-hover:ring-4 transition-all duration-300"
                            style={{
                              width: "52px",
                              height: "52px",
                              background: "#e5e7eb",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "20px",
                              fontWeight: "600",
                              color: "#4b5563",
                            }}
                          >
                            {user.firstName?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
                          </div>
                        )}
                        {/* Enhanced Reaction badge */}
                        {userReactionType && userReactionConfig && (
                          <div
                            className="absolute -bottom-1 -right-1 rounded-full transition-transform duration-300 group-hover:scale-110"
                            style={{
                              width: "24px",
                              height: "24px",
                              background: "white",
                              border: `2px solid ${userReactionConfig.color}`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              boxShadow: `0 2px 8px ${userReactionConfig.color}40`,
                            }}
                          >
                            <NextImage
                              src={userReactionConfig.icon}
                              alt={userReactionType}
                              width={16}
                              height={16}
                            />
                          </div>
                        )}
                      </div>
                    </Link>
                    <div className="flex-1 min-w-0" style={{ paddingLeft: "20px" }}>
                      <Link
                        href="/profile"
                        className="font-bold text-gray-900 group-hover:text-gray-700 block truncate transition-colors duration-200"
                        style={{ fontSize: "15px" }}
                      >
                        {user.firstName} {user.lastName}
                      </Link>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      {userReactionType && (
                        <p 
                          className="text-xs font-semibold mt-0.5 capitalize"
                          style={{ color: userReactionConfig?.color }}
                        >
                          Reacted with {userReactionType}
                        </p>
                      )}
                    </div>
                    {/* Hover arrow indicator */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        className="text-gray-400"
                      >
                        <path
                          d="M7.5 15L12.5 10L7.5 5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 px-6">
              <div 
                className="mb-6 p-6 rounded-full"
                style={{
                  backgroundColor: "#F3F4F6",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="64"
                  height="64"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  style={{ color: "#9CA3AF" }}
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">No reactions yet</h3>
              <p className="text-sm text-gray-500 text-center max-w-xs">
                Be the first to react and let others know how you feel!
              </p>
            </div>
          )}
        </div>

        <style jsx>{`
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateX(-10px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          .scrollbar-thin::-webkit-scrollbar {
            width: 6px;
          }

          .scrollbar-thin::-webkit-scrollbar-track {
            background: transparent;
          }

          .scrollbar-thin::-webkit-scrollbar-thumb {
            background-color: #D1D5DB;
            border-radius: 3px;
          }

          .scrollbar-thin::-webkit-scrollbar-thumb:hover {
            background-color: #9CA3AF;
          }
        `}</style>
      </DialogContent>
    </Dialog>
  );
}
