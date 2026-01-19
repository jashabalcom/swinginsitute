import { useState, useRef, useEffect } from "react";
import {
  Image as ImageIcon,
  Smile,
  BarChart3,
  X,
  Loader2,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { GifPicker } from "./GifPicker";
import { EmojiPicker } from "./EmojiPicker";
import { PollCreator } from "./PollCreator";
import { useGamification, POINT_VALUES } from "@/hooks/useGamification";

interface PollData {
  question: string;
  options: string[];
  allowMultiple: boolean;
  endsAt: Date | null;
}

interface PostComposerProps {
  channelId: string;
  onPostCreated?: () => void;
}

export function PostComposer({ channelId, onPostCreated }: PostComposerProps) {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const { awardPoints } = useGamification();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const [content, setContent] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [posting, setPosting] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [selectedGif, setSelectedGif] = useState<string | null>(null);
  const [showPollCreator, setShowPollCreator] = useState(false);
  const [pollData, setPollData] = useState<PollData | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [content]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload JPG, PNG, WebP, or GIF images.",
          variant: "destructive",
        });
        return false;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload images smaller than 10MB.",
          variant: "destructive",
        });
        return false;
      }
      return true;
    });

    if (selectedImages.length + validFiles.length > 4) {
      toast({
        title: "Too many images",
        description: "You can upload up to 4 images per post.",
        variant: "destructive",
      });
      return;
    }

    setSelectedImages([...selectedImages, ...validFiles]);
    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newPreviews]);
    setSelectedGif(null); // Clear GIF if images are selected
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(imagePreviews[index]);
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const handleGifSelect = (gifUrl: string) => {
    setSelectedGif(gifUrl);
    setSelectedImages([]);
    setImagePreviews([]);
  };

  const handleEmojiSelect = (emoji: string) => {
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newContent = content.slice(0, start) + emoji + content.slice(end);
      setContent(newContent);
      // Set cursor position after emoji
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + emoji.length;
        textarea.focus();
      }, 0);
    } else {
      setContent(content + emoji);
    }
  };

  const handleSubmit = async () => {
    if (!content.trim() && !selectedImages.length && !selectedGif && !pollData) return;
    if (!user || !channelId) return;

    setPosting(true);
    try {
      // Upload images if any
      const mediaUrls: string[] = [];
      for (const image of selectedImages) {
        const fileExt = image.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
        const filePath = `${user.id}/posts/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("chat-images")
          .upload(filePath, image);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("chat-images")
          .getPublicUrl(filePath);

        mediaUrls.push(urlData.publicUrl);
      }

      // Determine post type
      let postType = "text";
      if (pollData) postType = "poll";
      else if (mediaUrls.length > 0 || selectedGif) postType = "image";

      // Create post
      const { data: post, error: postError } = await supabase
        .from("posts")
        .insert({
          user_id: user.id,
          channel_id: channelId,
          content: content.trim(),
          post_type: postType,
          media_urls: mediaUrls,
          gif_url: selectedGif,
        })
        .select()
        .single();

      if (postError) throw postError;

      // Create poll if exists
      if (pollData && post) {
        await supabase.from("polls").insert({
          post_id: post.id,
          question: pollData.question,
          options: pollData.options,
          allow_multiple: pollData.allowMultiple,
          ends_at: pollData.endsAt?.toISOString(),
        });
      }

      // Award points
      awardPoints("create_post", post.id);

      // Reset form
      setContent("");
      setSelectedImages([]);
      setImagePreviews([]);
      setSelectedGif(null);
      setShowPollCreator(false);
      setPollData(null);
      setIsExpanded(false);

      toast({
        title: "Posted!",
        description: `You earned +${POINT_VALUES.create_post} points`,
      });

      onPostCreated?.();
    } catch (error) {
      console.error("Error creating post:", error);
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setPosting(false);
    }
  };

  const hasContent = content.trim() || selectedImages.length > 0 || selectedGif || pollData;

  return (
    <div className="p-4">
      <div className="flex gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={profile?.avatar_url || undefined} />
          <AvatarFallback className="bg-primary/20 text-primary">
            {(profile?.player_name || profile?.full_name || "?")[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <Textarea
            ref={textareaRef}
            placeholder="Share something with the community..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            className="min-h-[60px] resize-none border-none bg-transparent p-0 focus-visible:ring-0 placeholder:text-muted-foreground"
            rows={isExpanded ? 3 : 1}
          />

          {/* Image Previews */}
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-2 gap-2 mt-3">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1 bg-background/80 rounded-full hover:bg-background"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* GIF Preview */}
          {selectedGif && (
            <div className="relative mt-3 max-w-sm">
              <img src={selectedGif} alt="GIF" className="rounded-lg" />
              <button
                onClick={() => setSelectedGif(null)}
                className="absolute top-2 right-2 p-1 bg-background/80 rounded-full hover:bg-background"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Poll Creator */}
          {showPollCreator && (
            <div className="mt-3">
              <PollCreator
                onPollChange={setPollData}
                onRemove={() => {
                  setShowPollCreator(false);
                  setPollData(null);
                }}
              />
            </div>
          )}

          {/* Actions */}
          {isExpanded && (
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
              <div className="flex items-center gap-1">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageSelect}
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  multiple
                  className="hidden"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={posting || selectedGif !== null}
                >
                  <ImageIcon className="w-4 h-4" />
                </Button>

                <GifPicker
                  onSelect={handleGifSelect}
                  trigger={
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-xs"
                      disabled={posting || selectedImages.length > 0}
                    >
                      GIF
                    </Button>
                  }
                />

                <EmojiPicker
                  onSelect={handleEmojiSelect}
                  trigger={
                    <Button variant="ghost" size="icon" className="h-8 w-8" disabled={posting}>
                      <Smile className="w-4 h-4" />
                    </Button>
                  }
                />

                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-8 w-8 ${showPollCreator ? "text-primary" : ""}`}
                  onClick={() => setShowPollCreator(!showPollCreator)}
                  disabled={posting}
                >
                  <BarChart3 className="w-4 h-4" />
                </Button>
              </div>

              <Button
                size="sm"
                onClick={handleSubmit}
                disabled={!hasContent || posting}
              >
                {posting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Post
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
