import { useState, useEffect, useCallback, forwardRef } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Gif {
  id: string;
  url: string;
  preview: string;
  title: string;
}

interface GifPickerProps {
  onSelect: (gifUrl: string) => void;
  trigger?: React.ReactNode;
}

// Use environment variable or fallback to public beta key
const GIPHY_API_KEY = import.meta.env.VITE_GIPHY_API_KEY || "dc6zaTOxFJmzC";

// Forward ref button for use with PopoverTrigger asChild
const GifTriggerButton = forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<typeof Button>>(
  (props, ref) => (
    <Button ref={ref} variant="ghost" size="sm" className="h-8 px-2 text-xs" {...props}>
      GIF
    </Button>
  )
);
GifTriggerButton.displayName = "GifTriggerButton";

export function GifPicker({ onSelect, trigger }: GifPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [gifs, setGifs] = useState<Gif[]>([]);
  const [loading, setLoading] = useState(false);
  const [trending, setTrending] = useState<Gif[]>([]);

  // Fetch trending GIFs on mount
  useEffect(() => {
    async function fetchTrending() {
      try {
        const response = await fetch(
          `https://api.giphy.com/v1/gifs/trending?api_key=${GIPHY_API_KEY}&limit=20&rating=g`
        );
        const data = await response.json();
        const formattedGifs: Gif[] = data.data.map((gif: { id: string; title: string; images: { fixed_height: { url: string }; fixed_height_small: { url: string } } }) => ({
          id: gif.id,
          url: gif.images.fixed_height.url,
          preview: gif.images.fixed_height_small.url,
          title: gif.title,
        }));
        setTrending(formattedGifs);
      } catch (error) {
        console.error("Error fetching trending GIFs:", error);
      }
    }

    if (open && trending.length === 0) {
      fetchTrending();
    }
  }, [open, trending.length]);

  // Search GIFs
  const searchGifs = useCallback(async (query: string) => {
    if (!query.trim()) {
      setGifs([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${encodeURIComponent(query)}&limit=20&rating=g`
      );
      const data = await response.json();
      const formattedGifs: Gif[] = data.data.map((gif: { id: string; title: string; images: { fixed_height: { url: string }; fixed_height_small: { url: string } } }) => ({
        id: gif.id,
        url: gif.images.fixed_height.url,
        preview: gif.images.fixed_height_small.url,
        title: gif.title,
      }));
      setGifs(formattedGifs);
    } catch (error) {
      console.error("Error searching GIFs:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      searchGifs(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search, searchGifs]);

  const handleSelect = (gifUrl: string) => {
    onSelect(gifUrl);
    setOpen(false);
    setSearch("");
    setGifs([]);
  };

  const displayGifs = search ? gifs : trending;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {trigger || <GifTriggerButton />}
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <div className="p-3 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search GIFs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 h-8"
              />
            </div>
            {search && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setSearch("")}
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        <ScrollArea className="h-64">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : displayGifs.length > 0 ? (
            <div className="grid grid-cols-2 gap-1 p-2">
              {displayGifs.map((gif) => (
                <button
                  key={gif.id}
                  onClick={() => handleSelect(gif.url)}
                  className="relative aspect-video rounded overflow-hidden hover:ring-2 ring-primary transition-all"
                >
                  <img
                    src={gif.preview}
                    alt={gif.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          ) : search ? (
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
              No GIFs found
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
              Loading trending GIFs...
            </div>
          )}
        </ScrollArea>

        <div className="p-2 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            Powered by GIPHY
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}
