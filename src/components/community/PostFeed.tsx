import { useState, useEffect, useCallback, useRef } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { PostCard } from "./PostCard";

interface PostAuthor {
  user_id: string;
  player_name: string | null;
  full_name: string | null;
  avatar_url: string | null;
  level: number;
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

interface PostFeedProps {
  channelId: string;
  refreshTrigger?: number;
}

export function PostFeed({ channelId, refreshTrigger }: PostFeedProps) {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const fetchPosts = useCallback(async (reset = false) => {
    if (!channelId) return;
    
    if (reset) {
      setLoading(true);
      setPosts([]);
    } else {
      setLoadingMore(true);
    }

    const offset = reset ? 0 : posts.length;
    const limit = 10;

    const { data: postsData, error } = await supabase
      .from("posts")
      .select("*")
      .eq("channel_id", channelId)
      .order("pinned", { ascending: false })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("Error fetching posts:", error);
      setLoading(false);
      setLoadingMore(false);
      return;
    }

    if (!postsData || postsData.length === 0) {
      setHasMore(false);
      setLoading(false);
      setLoadingMore(false);
      return;
    }

    // Get unique user IDs
    const userIds = [...new Set(postsData.map(p => p.user_id))];
    const postIds = postsData.map(p => p.id);

    // Fetch related data in parallel
    const [
      { data: profilesData },
      { data: pointsData },
      { data: likesData },
      { data: commentsData },
      { data: userLikesData },
    ] = await Promise.all([
      supabase.from("profiles").select("user_id, player_name, full_name, avatar_url").in("user_id", userIds),
      supabase.from("user_points").select("user_id, level").in("user_id", userIds),
      supabase.from("post_likes").select("post_id").in("post_id", postIds),
      supabase.from("post_comments").select("post_id").in("post_id", postIds),
      user ? supabase.from("post_likes").select("post_id").in("post_id", postIds).eq("user_id", user.id) : Promise.resolve({ data: [] }),
    ]);

    const profileMap = new Map(profilesData?.map(p => [p.user_id, p]));
    const pointsMap = new Map(pointsData?.map(p => [p.user_id, p.level]));
    const userLikedSet = new Set(userLikesData?.map(l => l.post_id));

    // Count likes and comments per post
    const likesCountMap = new Map<string, number>();
    likesData?.forEach(l => {
      likesCountMap.set(l.post_id, (likesCountMap.get(l.post_id) || 0) + 1);
    });

    const commentsCountMap = new Map<string, number>();
    commentsData?.forEach(c => {
      commentsCountMap.set(c.post_id, (commentsCountMap.get(c.post_id) || 0) + 1);
    });

    const enrichedPosts: Post[] = postsData.map(post => ({
      ...post,
      media_urls: post.media_urls || [],
      author: {
        ...profileMap.get(post.user_id),
        user_id: post.user_id,
        level: pointsMap.get(post.user_id) || 1,
      } as PostAuthor,
      likes_count: likesCountMap.get(post.id) || 0,
      comments_count: commentsCountMap.get(post.id) || 0,
      user_liked: userLikedSet.has(post.id),
    }));

    if (reset) {
      setPosts(enrichedPosts);
    } else {
      setPosts(prev => [...prev, ...enrichedPosts]);
    }

    setHasMore(postsData.length === limit);
    setLoading(false);
    setLoadingMore(false);
  }, [channelId, posts.length, user]);

  // Initial fetch and refresh
  useEffect(() => {
    fetchPosts(true);
  }, [channelId, refreshTrigger]);

  // Real-time subscription
  useEffect(() => {
    if (!channelId) return;

    const channel = supabase
      .channel(`posts:${channelId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "posts",
          filter: `channel_id=eq.${channelId}`,
        },
        () => {
          // Refetch to get the new post with all data
          fetchPosts(true);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "posts",
        },
        (payload) => {
          setPosts(prev => prev.filter(p => p.id !== payload.old.id));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [channelId, fetchPosts]);

  // Infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
          fetchPosts(false);
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loadingMore, loading, fetchPosts]);

  const handlePostDelete = (postId: string) => {
    setPosts(posts.filter(p => p.id !== postId));
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No posts yet. Be the first to share something!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onDelete={() => handlePostDelete(post.id)}
        />
      ))}

      {/* Load More Trigger */}
      <div ref={loadMoreRef} className="h-10 flex items-center justify-center">
        {loadingMore && <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />}
        {!hasMore && posts.length > 0 && (
          <p className="text-sm text-muted-foreground">You've reached the end</p>
        )}
      </div>
    </div>
  );
}
