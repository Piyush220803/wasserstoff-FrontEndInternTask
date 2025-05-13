// src/contexts/UserContext.tsx
"use client";

import React, { createContext, useState, useEffect, useCallback } from 'react';
import type { FC, ReactNode, FormEvent } from 'react'; // Import FC, ReactNode, FormEvent if used explicitly, else React.FC etc. is fine

export interface User {
  id: string;
  name: string;
  color: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  promptForUsername: () => void;
  isPrompting: boolean;
}

const USER_COLORS = [
  '#FF6B6B', '#4ECDC4', '#F9A825', '#7E57C2', '#26A69A',
  '#EC407A', '#5C6BC0', '#FF7043', '#66BB6A', '#AB47BC'
];

function getRandomColor(): string {
  return USER_COLORS[Math.floor(Math.random() * USER_COLORS.length)];
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [isPrompting, setIsPrompting] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const storedUser = sessionStorage.getItem('collabUser');
    if (storedUser) {
      setUserState(JSON.parse(storedUser));
    }
    setIsInitialized(true); 
  }, []);

  const setUser = useCallback((newUser: User | null) => {
    setUserState(newUser);
    if (newUser) {
      sessionStorage.setItem('collabUser', JSON.stringify(newUser));
    } else {
      sessionStorage.removeItem('collabUser');
    }
  }, []);
  
  const promptForUsername = useCallback(() => {
    setIsPrompting(true);
  }, []);

  const handleSetUser = (name: string) => {
    if (name.trim()) {
      const newUser: User = {
        id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        name: name.trim(),
        color: getRandomColor(),
      };
      setUser(newUser);
      setIsPrompting(false);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, promptForUsername, isPrompting }}>
      {children}
      {isInitialized && isPrompting && !user && (
        <UserPromptModal onSetUsername={handleSetUser} />
      )}
    </UserContext.Provider>
  );
};

// UserPromptModal Component (kept in the same file for simplicity or move to components/auth)
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button"; // Using shadcn button for prompt
import { Label } from "@/components/ui/label"; // Import shadcn Label

interface UserPromptModalProps {
  onSetUsername: (name: string) => void;
}

const UserPromptModal: React.FC<UserPromptModalProps> = ({ onSetUsername }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSetUsername(name);
  };

  return (
    <Dialog open={true} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[425px]" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Welcome to CollabText!</DialogTitle>
          <DialogDescription>
            Please enter your name to join the collaborative session.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right col-span-1">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
              autoFocus
            />
          </div>
          <Button type="submit" disabled={!name.trim()}>Join Session</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
