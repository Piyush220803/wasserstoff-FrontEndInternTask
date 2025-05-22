"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { useUser } from "@/hooks/useUser";
import { useCollaboration, type CollabMessage } from "@/hooks/useCollaboration";
import type { User as UserType } from "@/contexts/UserContext";
import { EditorToolbar } from "./EditorToolbar";
import { ActiveUsersList } from "./ActiveUsersList";
import { useToast } from "@/hooks/use-toast";

export function CollaborativeEditor() {
  const { user: currentUser } = useUser();
  const editorRef = useRef<HTMLDivElement>(null);
  const [lastEditor, setLastEditor] = useState<UserType | null>(null);
  const { toast } = useToast();

  const handleIncomingContentChange = useCallback(
    (newContent: string, sourceUser: UserType) => {
      if (editorRef.current && editorRef.current.innerHTML !== newContent) {
        const selection = window.getSelection();
        const range =
          selection && selection.rangeCount > 0
            ? selection.getRangeAt(0)
            : null;
        const startOffset = range?.startOffset;

        editorRef.current.innerHTML = newContent;
        setLastEditor(sourceUser);

        if (
          range &&
          startOffset !== undefined &&
          editorRef.current.firstChild
        ) {
          try {
          } catch (error) {
            console.warn("Could not restore cursor position:", error);
          }
        }

        if (currentUser && sourceUser.id !== currentUser.id) {
          toast({
            title: "Content Updated",
            description: `${sourceUser.name} made changes.`,
            duration: 2000,
          });
        }
      }
    },
    [currentUser, toast]
  );

  const handleUserJoined = useCallback(
    (joinedUser: UserType) => {
      if (currentUser && joinedUser.id !== currentUser.id) {
        toast({
          description: `${joinedUser.name} joined the session.`,
          duration: 3000,
        });
      }
    },
    [currentUser, toast]
  );

  const handleUserLeft = useCallback(
    (leftUserId: string) => {
      toast({
        description: `A user left the session.`,
        duration: 3000,
      });
    },
    [toast]
  );

  const { broadcastContent, activeUsers } = useCollaboration({
    currentUser,
    onContentChange: handleIncomingContentChange,
    onUserJoined: handleUserJoined,
    onUserLeft: handleUserLeft,
  });

  const handleInput = (event: React.FormEvent<HTMLDivElement>) => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      broadcastContent(newContent);
      if (currentUser) setLastEditor(currentUser);
    }
  };

  const handleToolbarCommand = (command: "bold" | "italic") => {
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand(command, false, undefined);
      const newContent = editorRef.current.innerHTML;
      broadcastContent(newContent);
      if (currentUser) setLastEditor(currentUser);
    }
  };

  useEffect(() => {
    if (editorRef.current && !editorRef.current.innerHTML) {
      const storedContent = localStorage.getItem("collab-document-content");
      if (storedContent) {
        editorRef.current.innerHTML = storedContent;
      } else {
        editorRef.current.innerHTML =
          "<p>Start typing your collaborative document...</p>";
      }
    }
  }, []);

  if (!currentUser) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        Loading user information...
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-12rem)]">
      <div className="flex-grow flex flex-col bg-card shadow-lg rounded-md border border-border">
        <EditorToolbar onCommand={handleToolbarCommand} />
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          className="flex-grow p-4 overflow-y-auto focus:outline-none prose dark:prose-invert max-w-none"
          suppressContentEditableWarning={true}
          style={{ minHeight: "200px" }}
          aria-label="Collaborative text editor"
        />
        {lastEditor && (
          <div className="p-2 border-t border-border text-xs text-muted-foreground">
            Last change by:{" "}
            <span style={{ color: lastEditor.color, fontWeight: "bold" }}>
              {lastEditor.name}
            </span>
          </div>
        )}
      </div>
      <div className="w-full lg:w-64 p-4 bg-card shadow-lg rounded-md border border-border h-full overflow-y-auto">
        <ActiveUsersList users={activeUsers} />
      </div>
    </div>
  );
}
