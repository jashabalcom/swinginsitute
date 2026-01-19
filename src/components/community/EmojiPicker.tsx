import { useState, forwardRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Smile } from "lucide-react";

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
  trigger?: React.ReactNode;
}

const EMOJI_CATEGORIES = {
  "Smileys": ["😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂", "🙂", "😊", "😇", "🥰", "😍", "🤩", "😘", "😗", "😚", "😋", "😛", "😜", "🤪", "😝", "🤑", "🤗", "🤭", "🤫", "🤔", "🤐", "🤨", "😐", "😑", "😶", "😏", "😒", "🙄", "😬", "🤥", "😌", "😔", "😪", "🤤", "😴", "😷", "🤒", "🤕", "🤢", "🤮", "🤧", "🥵", "🥶", "🥴", "😵", "🤯"],
  "Gestures": ["👋", "🤚", "🖐️", "✋", "🖖", "👌", "🤌", "🤏", "✌️", "🤞", "🤟", "🤘", "🤙", "👈", "👉", "👆", "🖕", "👇", "☝️", "👍", "👎", "✊", "👊", "🤛", "🤜", "👏", "🙌", "👐", "🤲", "🤝", "🙏", "💪", "🦾"],
  "Sports": ["⚾", "🥎", "🏀", "🏈", "🎾", "🏐", "🏉", "🎱", "🏓", "🏸", "🏒", "🥅", "⛳", "🏌️", "🏋️", "🤺", "🏆", "🥇", "🥈", "🥉", "🏅", "🎖️", "🏇", "⚽", "🥊", "🤼"],
  "Celebration": ["🎉", "🎊", "🎈", "🎁", "🎀", "🎇", "🎆", "✨", "🌟", "💫", "⭐", "🔥", "💥", "💯", "🎯", "🚀", "💪", "👑", "🏆", "🥳"],
  "Hearts": ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝"],
  "Objects": ["📸", "📷", "🎥", "📹", "🎬", "📺", "📱", "💻", "⌨️", "🖥️", "🖨️", "🎮", "🕹️", "🎧", "🎤", "🎵", "🎶", "🎼", "📚", "📖", "✏️", "📝"],
};

// Forward ref button for use with PopoverTrigger asChild
const EmojiTriggerButton = forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<typeof Button>>(
  (props, ref) => (
    <Button ref={ref} variant="ghost" size="icon" className="h-8 w-8" {...props}>
      <Smile className="w-4 h-4" />
    </Button>
  )
);
EmojiTriggerButton.displayName = "EmojiTriggerButton";

export function EmojiPicker({ onSelect, trigger }: EmojiPickerProps) {
  const [open, setOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<keyof typeof EMOJI_CATEGORIES>("Smileys");

  const handleSelect = (emoji: string) => {
    onSelect(emoji);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {trigger || <EmojiTriggerButton />}
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        {/* Category Tabs */}
        <div className="flex border-b border-border overflow-x-auto">
          {Object.keys(EMOJI_CATEGORIES).map((category) => (
            <Button
              key={category}
              variant="ghost"
              size="sm"
              className={`flex-shrink-0 px-3 py-2 rounded-none border-b-2 ${
                activeCategory === category
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground"
              }`}
              onClick={() => setActiveCategory(category as keyof typeof EMOJI_CATEGORIES)}
            >
              {EMOJI_CATEGORIES[category as keyof typeof EMOJI_CATEGORIES][0]}
            </Button>
          ))}
        </div>

        {/* Emoji Grid */}
        <ScrollArea className="h-48">
          <div className="p-2">
            <p className="text-xs font-medium text-muted-foreground mb-2">
              {activeCategory}
            </p>
            <div className="grid grid-cols-8 gap-1">
              {EMOJI_CATEGORIES[activeCategory].map((emoji, index) => (
                <button
                  key={`${emoji}-${index}`}
                  onClick={() => handleSelect(emoji)}
                  className="w-8 h-8 flex items-center justify-center text-xl hover:bg-muted rounded transition-colors"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
