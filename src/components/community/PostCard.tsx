import { useState, useEffect, useCallback } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  Heart,
  MessageCircle,
  MoreHorizontal,
  Pin,
  Trash2,
  Send,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { LevelBadge } from "./LevelBadge";
import { PollDisplay } from "./PollDisplay";
import { renderMessageWithMentions } from "./MentionInput";
import { useGamification, POINT_VALUES } from "@/hooks/useGamification";

interface PostAuthor {
  user_id: string;
  player_name: string | null;
  full_name: string | null;
  avatar_url: string | null;
  level: number;
}

interface Comment {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  author?: PostAuthor;
}

interface Post {
  id: string;
  user_id: string;
  channel_id: string;
  content: string;
  post_type: string;
  media_urls: string[];
  gif_url: string | null;
  pinned: boolean;
  created_at: string;
  author?: PostAuthor;
  likes_count: number;
  comments_count: number;
  user_liked: boolean;
}

interface PostCardProps {
  post: Post;
  onDelete?: () => void;
}

export function PostCard({ post, onDelete }: PostCardProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const { awardPoints } = useGamification();
  
  const [liked, setLiked] = useState(post.user_liked);
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsCount, setCommentsCount] = useState(post.comments_count);
  const [newComment, setNewComment] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);
  const [postingComment, setPostingComment] = useState(false);

  const isOwner = user?.id === post.user_id;

  const fetchComments = useCallback(async () => {
    if (!showComments) return;
    setLoadingComments(true);

    const { data: commentsData } = await supabase
      .from("post_comments")
      .select("*")
      .eq("post_id", post.id)
      .is("parent_comment_id", null)
      .order("created_at", { ascending: true });

    if (commentsData) {
      const userIds = [...new Set(commentsData.map(c => c.user_id))];
      
      const [{ data: profilesData }, { data: pointsData }] = await Promise.all([
        supabase.from("profiles").select("user_id, player_name, full_name, avatar_url").in("user_id", userIds),
        supabase.from("user_points").select("user_id, level").in("user_id", userIds),
      ]);

      const profileMap = new Map(profilesData?.map(p => [p.user_id, p]));
      const pointsMap = new Map(pointsData?.map(p => [p.user_id, p.level]));

      const commentsWithAuthors: Comment[] = commentsData.map(c => ({
        ...c,
        author: {
          ...profileMap.get(c.user_id),
          user_id: c.user_id,
          level: pointsMap.get(c.user_id) || 1,
        } as PostAuthor,
      }));

      setComments(commentsWithAuthors);
    }
    setLoadingComments(false);
  }, [post.id, showComments]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleLike = async () => {
    if (!user) return;

    if (liked) {
      setLiked(false);
      setLikesCount(prev => prev - 1);
      await supabase
        .from("post_likes")
        .delete()
        .eq("post_id", post.id)
        .eq("user_id", user.id);
    } else {
      setLiked(true);
      setLikesCount(prev => prev + 1);
      await supabase.from("post_likes").insert({
        post_id: post.id,
        user_id: user.id,
      });
      
      // Award points to post author if not self-liking
      if (post.user_id !== user.id) {
        awardPoints("receive_like", post.id);
      }
    }
  };

  const handleComment = async () => {
    if (!user || !newComment.trim()) return;

    setPostingComment(true);
    try {
      const { data: comment, error } = await supabase
        .from("post_comments")
        .insert({
          post_id: post.id,
          user_id: user.id,
          content: newComment.trim(),
        })
        .select()
        .single();

      if (error) throw error;

      // Add to local state
      const { data: profileData } = await supabase
        .from("profiles")
        .select("user_id, player_name, full_name, avatar_url")
        .eq("user_id", user.id)
        .single();

      const { data: pointsData } = await supabase
        .from("user_points")
        .select("level")
        .eq("user_id", user.id)
        .single();

      setComments([
        ...comments,
        {
          ...comment,
          author: {
            ...profileData,
            user_id: user.id,
            level: pointsData?.level || 1,
          } as PostAuthor,
        },
      ]);
      setCommentsCount(prev => prev + 1);
      setNewComment("");

      // Award points
      awardPoints("comment", comment.id);

      toast({
        title: "Comment added!",
        description: `You earned +${POINT_VALUES.comment} points`,
      });
    } catch (error) {
      console.error("Error posting comment:", error);
      toast({
        title: "Error",
        description: "Failed to post comment.",
        variant: "destructive",
      });
    } finally {
      setPostingComment(false);
    }
  };

  const handleDelete = async () => {
    if (!isOwner) return;

    try {
      await supabase.from("posts").delete().eq("id", post.id);
      onDelete?.();
      toast({ title: "Post deleted" });
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <div className="bg-card rounded-xl border border-border p-4">
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={post.author?.avatar_url || undefined} />
          <AvatarFallback className="bg-primary/20 text-primary">
            {(post.author?.player_name || post.author?.full_name || "?")[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold truncate">
              {post.author?.player_name || post.author?.full_name || "Anonymous"}
            </span>
            <LevelBadge level={post.author?.level || 1} size="sm" />
            {post.pinned && <Pin className="w-3 h-3 text-primary" />}
          </div>
          <p className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
          </p>
        </div>

        {isOwner && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Content */}
      {post.content && (
        <div className="mb-3 whitespace-pre-wrap">
          {renderMessageWithMentions(post.content)}
        </div>
      )}

      {/* Media */}
      {post.media_urls && post.media_urls.length > 0 && (
        <div className={`grid gap-2 mb-3 ${post.media_urls.length > 1 ? "grid-cols-2" : ""}`}>
          {post.media_urls.map((url, index) => (
            <img
              key={index}
              src={url}
              alt="Post media"
              className="w-full rounded-lg object-cover max-h-96"
            />
          ))}
        </div>
      )}

      {/* GIF */}
      {post.gif_url && (
        <div className="mb-3">
          <img src={post.gif_url} alt="GIF" className="rounded-lg max-h-80" />
        </div>
      )}

      {/* Poll */}
      {post.post_type === "poll" && (
        <div className="mb-3">
          <PollDisplay postId={post.id} />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-4 pt-3 border-t border-border">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1.5 text-sm transition-colors ${
            liked ? "text-primary" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Heart className={`w-4 h-4 ${liked ? "fill-primary" : ""}`} />
          <span>{likesCount}</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          <span>{commentsCount}</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-border space-y-4">
          {loadingComments ? (
            <div className="flex justify-center py-4">
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              {/* Comment List */}
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-2">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={comment.author?.avatar_url || undefined} />
                    <AvatarFallback className="text-xs bg-muted">
                      {(comment.author?.player_name || comment.author?.full_name || "?")[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="bg-muted/50 rounded-lg px-3 py-2">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium">
                          {comment.author?.player_name || comment.author?.full_name || "Anonymous"}
                        </span>
                        <LevelBadge level={comment.author?.level || 1} size="sm" />
                      </div>
                      <p className="text-sm">{renderMessageWithMentions(comment.content)}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 ml-3">
                      {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              ))}

              {/* Comment Input */}
              <div className="flex gap-2">
                <Input
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleComment();
                    }
                  }}
                  disabled={postingComment}
                />
                <Button
                  size="icon"
                  onClick={handleComment}
                  disabled={!newComment.trim() || postingComment}
                >
                  {postingComment ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
