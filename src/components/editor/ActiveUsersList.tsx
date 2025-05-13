// src/components/editor/ActiveUsersList.tsx
"use client";

import type React from 'react';
import type { User } from '@/contexts/UserContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar'; // Using shadcn Avatar

interface ActiveUsersListProps {
  users: User[];
}

const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase() || '?';
}

export const ActiveUsersList: React.FC<ActiveUsersListProps> = ({ users }) => {
  if (!users.length) {
    return <p className="text-sm text-muted-foreground">No active users.</p>;
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-foreground">Active Users ({users.length})</h3>
      <ul className="space-y-1">
        {users.map((user) => (
          <li key={user.id} className="flex items-center space-x-2 text-xs">
            <Avatar className="h-5 w-5 text-xs">
              <AvatarFallback style={{ backgroundColor: user.color, color: 'white' }}>
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <span className="text-muted-foreground">{user.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
