"use client";

import type React from "react";
import { Bold, Italic } from "lucide-react";
import { Button } from "@/components/ui/button";
interface EditorToolbarProps {
  onCommand: (command: "bold" | "italic") => void;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({ onCommand }) => {
  return (
    <div className="p-2 border-b border-border bg-card flex items-center space-x-2 rounded-t-md">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onCommand("bold")}
        aria-label="Bold"
        className="p-2 h-auto"
      >
        <Bold className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onCommand("italic")}
        aria-label="Italic"
        className="p-2 h-auto"
      >
        <Italic className="w-4 h-4" />
      </Button>
    </div>
  );
};
