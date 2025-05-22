"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { User } from "@/contexts/UserContext";

const CHANNEL_NAME = "collab-editor-channel";
const DOC_STORAGE_KEY = "collab-document-content";

export interface CollabMessage {
  type: "CONTENT_UPDATE" | "USER_JOINED" | "USER_LEFT" | "CURSOR_UPDATE";
  payload: {
    userId: string;
    userName: string;
    userColor: string;
    content?: string;
  };
}

interface UseCollaborationOptions {
  currentUser: User | null;
  onContentChange?: (content: string, sourceUser: User) => void;
  onUserJoined?: (user: User) => void;
  onUserLeft?: (userId: string) => void;
}

export function useCollaboration({
  currentUser,
  onContentChange,
  onUserJoined,
  onUserLeft,
}: UseCollaborationOptions) {
  const channelRef = useRef<BroadcastChannel | null>(null);
  const [activeUsers, setActiveUsers] = useState<Map<string, User>>(new Map());

  useEffect(() => {
    if (typeof window !== "undefined") {
      channelRef.current = new BroadcastChannel(CHANNEL_NAME);

      const handleMessage = (event: MessageEvent<CollabMessage>) => {
        const { type, payload } = event.data;
        if (!currentUser || payload.userId === currentUser.id) return; // Ignore own messages

        switch (type) {
          case "CONTENT_UPDATE":
            if (payload.content && onContentChange) {
              onContentChange(payload.content, {
                id: payload.userId,
                name: payload.userName,
                color: payload.userColor,
              });
              localStorage.setItem(DOC_STORAGE_KEY, payload.content);
            }
            // Add user to active list if not present
            setActiveUsers((prev) =>
              new Map(prev).set(payload.userId, {
                id: payload.userId,
                name: payload.userName,
                color: payload.userColor,
              })
            );
            break;
          case "USER_JOINED":
            setActiveUsers((prev) =>
              new Map(prev).set(payload.userId, {
                id: payload.userId,
                name: payload.userName,
                color: payload.userColor,
              })
            );
            if (onUserJoined)
              onUserJoined({
                id: payload.userId,
                name: payload.userName,
                color: payload.userColor,
              });
            break;
          case "USER_LEFT":
            setActiveUsers((prev) => {
              const newMap = new Map(prev);
              newMap.delete(payload.userId);
              return newMap;
            });
            if (onUserLeft) onUserLeft(payload.userId);
            break;
        }
      };

      channelRef.current.addEventListener("message", handleMessage);

      // Announce user joining
      if (currentUser) {
        const joinMessage: CollabMessage = {
          type: "USER_JOINED",
          payload: {
            userId: currentUser.id,
            userName: currentUser.name,
            userColor: currentUser.color,
          },
        };
        channelRef.current.postMessage(joinMessage);

        setActiveUsers((prev) =>
          new Map(prev).set(currentUser.id, currentUser)
        );

        // Load initial content from localStorage
        const storedContent = localStorage.getItem(DOC_STORAGE_KEY);
        if (storedContent && onContentChange) {
          onContentChange(storedContent, currentUser);
        }
      }

      return () => {
        if (channelRef.current) {
          if (currentUser) {
            const leaveMessage: CollabMessage = {
              type: "USER_LEFT",
              payload: {
                userId: currentUser.id,
                userName: currentUser.name,
                userColor: currentUser.color,
              },
            };
            channelRef.current.postMessage(leaveMessage);
          }
          channelRef.current.removeEventListener("message", handleMessage);
          channelRef.current.close();
        }
      };
    }
  }, [currentUser, onContentChange, onUserJoined, onUserLeft]);

  const broadcastContent = useCallback(
    (content: string) => {
      if (channelRef.current && currentUser) {
        const message: CollabMessage = {
          type: "CONTENT_UPDATE",
          payload: {
            userId: currentUser.id,
            userName: currentUser.name,
            userColor: currentUser.color,
            content,
          },
        };
        channelRef.current.postMessage(message);
        localStorage.setItem(DOC_STORAGE_KEY, content);
      }
    },
    [currentUser]
  );

  return { broadcastContent, activeUsers: Array.from(activeUsers.values()) };
}
