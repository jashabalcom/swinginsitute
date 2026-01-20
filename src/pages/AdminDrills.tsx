import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  BookOpen,
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  Star,
  Clock,
  ChevronDown,
  ChevronRight,
  Save,
  X,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Drill {
  id: string;
  title: string;
  description: string | null;
  phase: string;
  week: number;
  duration_minutes: number | null;
  is_priority: boolean | null;
  video_url: string | null;
  sort_order: number | null;
}

const PHASES = [
  "Phase 1: Foundation",
  "Phase 2: Load & Timing",
  "Phase 3: Launch & Extension",
  "Phase 4: Contact & Adjustment",
  "Phase 5: Game Integration",
];

export default function AdminDrills() {
  const [drills, setDrills] = useState<Drill[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedPhases, setExpandedPhases] = useState<Set<string>>(new Set(PHASES));
  const [editingDrill, setEditingDrill] = useState<Drill | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<Drill | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    phase: PHASES[0],
    week: 1,
    duration_minutes: 20,
    is_priority: false,
    video_url: "",
  });

  const fetchDrills = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("drills")
        .select("*")
        .order("phase")
        .order("week")
        .order("sort_order");

      if (error) throw error;
      setDrills(data || []);
    } catch (error) {
      console.error("Error fetching drills:", error);
      toast.error("Failed to load drills");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrills();
  }, []);

  const togglePhase = (phase: string) => {
    const newExpanded = new Set(expandedPhases);
    if (newExpanded.has(phase)) {
      newExpanded.delete(phase);
    } else {
      newExpanded.add(phase);
    }
    setExpandedPhases(newExpanded);
  };

  const openCreateDialog = () => {
    setEditingDrill(null);
    setFormData({
      title: "",
      description: "",
      phase: PHASES[0],
      week: 1,
      duration_minutes: 20,
      is_priority: false,
      video_url: "",
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (drill: Drill) => {
    setEditingDrill(drill);
    setFormData({
      title: drill.title,
      description: drill.description || "",
      phase: drill.phase,
      week: drill.week,
      duration_minutes: drill.duration_minutes || 20,
      is_priority: drill.is_priority || false,
      video_url: drill.video_url || "",
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }

    try {
      if (editingDrill) {
        const { error } = await supabase
          .from("drills")
          .update({
            title: formData.title,
            description: formData.description || null,
            phase: formData.phase,
            week: formData.week,
            duration_minutes: formData.duration_minutes,
            is_priority: formData.is_priority,
            video_url: formData.video_url || null,
          })
          .eq("id", editingDrill.id);

        if (error) throw error;
        toast.success("Drill updated");
      } else {
        const { error } = await supabase.from("drills").insert({
          title: formData.title,
          description: formData.description || null,
          phase: formData.phase,
          week: formData.week,
          duration_minutes: formData.duration_minutes,
          is_priority: formData.is_priority,
          video_url: formData.video_url || null,
        });

        if (error) throw error;
        toast.success("Drill created");
      }

      setIsDialogOpen(false);
      fetchDrills();
    } catch (error) {
      console.error("Error saving drill:", error);
      toast.error("Failed to save drill");
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;

    try {
      const { error } = await supabase
        .from("drills")
        .delete()
        .eq("id", deleteConfirm.id);

      if (error) throw error;
      toast.success("Drill deleted");
      setDeleteConfirm(null);
      fetchDrills();
    } catch (error) {
      console.error("Error deleting drill:", error);
      toast.error("Failed to delete drill");
    }
  };

  const getDrillsByPhase = () => {
    const grouped: Record<string, Record<number, Drill[]>> = {};
    PHASES.forEach((phase) => {
      grouped[phase] = { 1: [], 2: [], 3: [] };
    });

    drills.forEach((drill) => {
      if (grouped[drill.phase]) {
        if (!grouped[drill.phase][drill.week]) {
          grouped[drill.phase][drill.week] = [];
        }
        grouped[drill.phase][drill.week].push(drill);
      }
    });

    return grouped;
  };

  const drillsByPhase = getDrillsByPhase();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-8 border-b border-border mb-8"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <BookOpen className="w-8 h-8 text-cyan-500" />
                  <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                    Drill Library
                  </h1>
                </div>
                <p className="text-muted-foreground">
                  Manage training drills for each phase and week
                </p>
              </div>
              <div className="flex gap-3">
                <Link to="/admin">
                  <Button variant="outline">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Admin
                  </Button>
                </Link>
                <Button onClick={openCreateDialog}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Drill
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            {PHASES.map((phase, index) => {
              const count = drills.filter((d) => d.phase === phase).length;
              return (
                <Card key={phase} className="bg-card border-border">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-foreground">{count}</p>
                    <p className="text-xs text-muted-foreground">Phase {index + 1}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Drills by Phase */}
          {loading ? (
            <Card className="bg-card border-border">
              <CardContent className="p-8 text-center text-muted-foreground">
                Loading drills...
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {PHASES.map((phase) => (
                <Card key={phase} className="bg-card border-border">
                  <CardHeader
                    className="cursor-pointer"
                    onClick={() => togglePhase(phase)}
                  >
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        {expandedPhases.has(phase) ? (
                          <ChevronDown className="w-5 h-5" />
                        ) : (
                          <ChevronRight className="w-5 h-5" />
                        )}
                        {phase}
                      </span>
                      <Badge variant="secondary">
                        {drills.filter((d) => d.phase === phase).length} drills
                      </Badge>
                    </CardTitle>
                  </CardHeader>

                  {expandedPhases.has(phase) && (
                    <CardContent className="pt-0">
                      <div className="space-y-6">
                        {[1, 2, 3].map((week) => (
                          <div key={week}>
                            <h4 className="text-sm font-semibold text-muted-foreground mb-3">
                              Week {week}
                            </h4>
                            {drillsByPhase[phase][week]?.length > 0 ? (
                              <div className="grid md:grid-cols-2 gap-3">
                                {drillsByPhase[phase][week].map((drill) => (
                                  <div
                                    key={drill.id}
                                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                                  >
                                    <div className="flex items-center gap-3 min-w-0">
                                      {drill.is_priority && (
                                        <Star className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                                      )}
                                      <div className="min-w-0">
                                        <p className="font-medium text-foreground truncate">
                                          {drill.title}
                                        </p>
                                        <p className="text-xs text-muted-foreground flex items-center gap-2">
                                          <Clock className="w-3 h-3" />
                                          {drill.duration_minutes || 0} min
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => openEditDialog(drill)}
                                      >
                                        <Pencil className="w-4 h-4" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setDeleteConfirm(drill)}
                                      >
                                        <Trash2 className="w-4 h-4 text-destructive" />
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground italic">
                                No drills for this week
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingDrill ? "Edit Drill" : "Add New Drill"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium text-foreground">Title</label>
              <Input
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Drill title"
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">
                Description
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Describe the drill and how to perform it..."
                rows={3}
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground">Phase</label>
                <Select
                  value={formData.phase}
                  onValueChange={(value) =>
                    setFormData({ ...formData, phase: value })
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PHASES.map((phase) => (
                      <SelectItem key={phase} value={phase}>
                        {phase}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Week</label>
                <Select
                  value={formData.week.toString()}
                  onValueChange={(value) =>
                    setFormData({ ...formData, week: parseInt(value) })
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Week 1</SelectItem>
                    <SelectItem value="2">Week 2</SelectItem>
                    <SelectItem value="3">Week 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">
                Duration (minutes)
              </label>
              <Input
                type="number"
                value={formData.duration_minutes}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    duration_minutes: parseInt(e.target.value) || 0,
                  })
                }
                min={0}
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">
                Video URL (optional)
              </label>
              <Input
                value={formData.video_url}
                onChange={(e) =>
                  setFormData({ ...formData, video_url: e.target.value })
                }
                placeholder="https://..."
                className="mt-1"
              />
            </div>

            <div className="flex items-center gap-3">
              <Switch
                checked={formData.is_priority}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, is_priority: checked })
                }
              />
              <label className="text-sm font-medium text-foreground">
                Priority Drill (required for phase completion)
              </label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              {editingDrill ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deleteConfirm}
        onOpenChange={() => setDeleteConfirm(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Drill</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteConfirm?.title}"? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}