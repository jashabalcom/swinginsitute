import { useState, useEffect, useRef, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";

interface Member {
  user_id: string;
  player_name: string | null;
  full_name: string | null;
  avatar_url: string | null;
}

interface MentionInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function MentionInput({
  value,
  onChange,
  onSubmit,
  placeholder,
  disabled,
  className,
}: MentionInputProps) {
  const [members, setMembers] = useState<Member[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const [mentionQuery, setMentionQuery] = useState("");
  const [cursorPosition, setCursorPosition] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchMembers() {
      const { data } = await supabase
        .from("profiles")
        .select("user_id, player_name, full_name, avatar_url")
        .eq("onboarding_completed", true);
      setMembers(data || []);
    }
    fetchMembers();
  }, []);

  const getDisplayName = (member: Member) => {
    return member.player_name || member.full_name || "Anonymous";
  };

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const filteredMembers = members.filter(member => {
    const name = getDisplayName(member).toLowerCase();
    return name.includes(mentionQuery.toLowerCase());
  }).slice(0, 5);

  const detectMention = useCallback((text: string, cursor: number) => {
    // Find the @ symbol before cursor
    const beforeCursor = text.slice(0, cursor);
    const atIndex = beforeCursor.lastIndexOf("@");
    
    if (atIndex === -1) {
      setShowSuggestions(false);
      return;
    }

    // Check if there's a space between @ and cursor
    const textAfterAt = beforeCursor.slice(atIndex + 1);
    if (textAfterAt.includes(" ")) {
      setShowSuggestions(false);
      return;
    }

    // Check if @ is at start or preceded by space
    if (atIndex > 0 && beforeCursor[atIndex - 1] !== " ") {
      setShowSuggestions(false);
      return;
    }

    setMentionQuery(textAfterAt);
    setShowSuggestions(true);
    setSuggestionIndex(0);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const newCursor = e.target.selectionStart || 0;
    onChange(newValue);
    setCursorPosition(newCursor);
    detectMention(newValue, newCursor);
  };

  const insertMention = (member: Member) => {
    const beforeCursor = value.slice(0, cursorPosition);
    const afterCursor = value.slice(cursorPosition);
    const atIndex = beforeCursor.lastIndexOf("@");
    
    const name = getDisplayName(member);
    const newValue = beforeCursor.slice(0, atIndex) + `@${name} ` + afterCursor;
    
    onChange(newValue);
    setShowSuggestions(false);
    
    // Focus back on input
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        const newCursor = atIndex + name.length + 2;
        inputRef.current.setSelectionRange(newCursor, newCursor);
      }
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (showSuggestions && filteredMembers.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSuggestionIndex(prev => Math.min(prev + 1, filteredMembers.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSuggestionIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        insertMention(filteredMembers[suggestionIndex]);
      } else if (e.key === "Escape") {
        setShowSuggestions(false);
      }
    } else if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  const handleClick = () => {
    if (inputRef.current) {
      const cursor = inputRef.current.selectionStart || 0;
      setCursorPosition(cursor);
      detectMention(value, cursor);
    }
  };

  return (
    <div ref={containerRef} className="relative flex-1">
      <Input
        ref={inputRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onClick={handleClick}
        placeholder={placeholder}
        disabled={disabled}
        className={className}
      />
      
      {showSuggestions && filteredMembers.length > 0 && (
        <div className="absolute bottom-full left-0 right-0 mb-1 bg-popover border border-border rounded-lg shadow-lg overflow-hidden z-50">
          <ScrollArea className="max-h-48">
            <div className="p-1">
              {filteredMembers.map((member, index) => {
                const name = getDisplayName(member);
                return (
                  <button
                    key={member.user_id}
                    onClick={() => insertMention(member)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded text-left transition-colors ${
                      index === suggestionIndex
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-muted"
                    }`}
                  >
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={member.avatar_url || undefined} />
                      <AvatarFallback className="text-xs bg-muted">
                        {getInitials(name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{name}</span>
                  </button>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}

// Helper to parse and render message content with highlighted mentions
export function renderMessageWithMentions(content: string): React.ReactNode {
  const mentionRegex = /@(\w+(?:\s\w+)?)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  while ((match = mentionRegex.exec(content)) !== null) {
    // Add text before the mention
    if (match.index > lastIndex) {
      parts.push(content.slice(lastIndex, match.index));
    }
    
    // Add highlighted mention
    parts.push(
      <span key={match.index} className="text-primary font-semibold">
        {match[0]}
      </span>
    );
    
    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < content.length) {
    parts.push(content.slice(lastIndex));
  }

  return parts.length > 0 ? parts : content;
}

// Extract mentioned usernames from content
export function extractMentions(content: string): string[] {
  const mentionRegex = /@(\w+(?:\s\w+)?)/g;
  const mentions: string[] = [];
  let match;

  while ((match = mentionRegex.exec(content)) !== null) {
    mentions.push(match[1]);
  }

  return mentions;
}
