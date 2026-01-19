import { useState, useRef } from "react";
import { Camera, Loader2, Trash2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AvatarUploadProps {
  userId: string;
  currentAvatarUrl: string | null;
  displayName: string;
  onAvatarChange: (url: string | null) => void;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "w-12 h-12",
  md: "w-20 h-20",
  lg: "w-32 h-32",
};

const iconSizes = {
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-10 h-10",
};

export function AvatarUpload({
  userId,
  currentAvatarUrl,
  displayName,
  onAvatarChange,
  size = "lg",
}: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPG, PNG, or WebP image.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    // Create preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // Upload file
    await uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      // Delete old avatar if exists
      if (currentAvatarUrl) {
        const oldPath = currentAvatarUrl.split("/avatars/")[1];
        if (oldPath) {
          await supabase.storage.from("avatars").remove([oldPath]);
        }
      }

      // Upload new avatar
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      const publicUrl = urlData.publicUrl;

      // Update profile
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("user_id", userId);

      if (updateError) throw updateError;

      onAvatarChange(publicUrl);
      toast({
        title: "Avatar updated",
        description: "Your profile picture has been updated successfully.",
      });
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast({
        title: "Upload failed",
        description: "Failed to upload avatar. Please try again.",
        variant: "destructive",
      });
      setPreviewUrl(null);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    if (!currentAvatarUrl) return;

    setUploading(true);
    try {
      // Extract file path from URL
      const oldPath = currentAvatarUrl.split("/avatars/")[1];
      if (oldPath) {
        await supabase.storage.from("avatars").remove([oldPath]);
      }

      // Update profile
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: null })
        .eq("user_id", userId);

      if (updateError) throw updateError;

      onAvatarChange(null);
      setPreviewUrl(null);
      toast({
        title: "Avatar removed",
        description: "Your profile picture has been removed.",
      });
    } catch (error) {
      console.error("Error removing avatar:", error);
      toast({
        title: "Remove failed",
        description: "Failed to remove avatar. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const displayUrl = previewUrl || currentAvatarUrl;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative group">
        <div
          className={`${sizeClasses[size]} rounded-full overflow-hidden bg-muted flex items-center justify-center border-2 border-border`}
        >
          {displayUrl ? (
            <img
              src={displayUrl}
              alt={displayName}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className={`font-display font-bold text-muted-foreground ${size === "lg" ? "text-3xl" : size === "md" ? "text-xl" : "text-sm"}`}>
              {initials || <User className={iconSizes[size]} />}
            </span>
          )}

          {uploading && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded-full">
              <Loader2 className={`${iconSizes[size]} animate-spin text-primary`} />
            </div>
          )}
        </div>

        {/* Upload button overlay */}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="absolute inset-0 rounded-full bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
        >
          <Camera className={iconSizes[size]} />
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground"
        >
          <Camera className="w-4 h-4 mr-2" />
          {currentAvatarUrl ? "Change Photo" : "Upload Photo"}
        </Button>

        {currentAvatarUrl && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemoveAvatar}
            disabled={uploading}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
