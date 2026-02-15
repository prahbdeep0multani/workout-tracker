"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2, ArrowLeft, Loader2, Search } from "lucide-react";
import { toast } from "sonner";
import type { Exercise } from "@/types/database";

interface TemplateEntry {
  exercise: Exercise;
  target_sets: string;
  target_reps: string;
  target_weight: string;
  rest_seconds: string;
}

export default function NewTemplatePage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [entries, setEntries] = useState<TemplateEntry[]>([]);
  const [allExercises, setAllExercises] = useState<Exercise[]>([]);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetch = async () => {
      const supabase = createClient();
      const { data } = await supabase.from("exercises").select("*").order("name");
      setAllExercises(data || []);
    };
    fetch();
  }, []);

  const addExercise = (exercise: Exercise) => {
    setEntries((prev) => [
      ...prev,
      { exercise, target_sets: "3", target_reps: "10", target_weight: "", rest_seconds: "90" },
    ]);
    setDialogOpen(false);
    setSearch("");
  };

  const updateEntry = (i: number, field: string, value: string) => {
    setEntries((prev) => prev.map((e, idx) => (idx === i ? { ...e, [field]: value } : e)));
  };

  const removeEntry = (i: number) => {
    setEntries((prev) => prev.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("Enter a template name");
      return;
    }
    if (entries.length === 0) {
      toast.error("Add at least one exercise");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: template, error } = await supabase
      .from("workout_templates")
      .insert({ user_id: user.id, name, description: description || null, is_public: false })
      .select()
      .single();

    if (error || !template) {
      toast.error("Failed to create template");
      setLoading(false);
      return;
    }

    const templateExercises = entries.map((e, i) => ({
      template_id: template.id,
      exercise_id: e.exercise.id,
      order: i,
      target_sets: parseInt(e.target_sets) || 3,
      target_reps: parseInt(e.target_reps) || 10,
      target_weight: e.target_weight ? parseFloat(e.target_weight) : null,
      rest_seconds: e.rest_seconds ? parseInt(e.rest_seconds) : null,
    }));

    await supabase.from("template_exercises").insert(templateExercises);

    toast.success("Template created!");
    router.push("/templates");
  };

  const filtered = allExercises.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <Button variant="ghost" size="sm" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <h1 className="text-3xl font-bold tracking-tight mb-6">Create Template</h1>

      <div className="max-w-2xl space-y-6">
        <Card>
          <CardContent className="p-5 space-y-4">
            <div className="space-y-2">
              <Label>Template Name</Label>
              <Input placeholder="e.g., My Push Day" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Description (optional)</Label>
              <Textarea placeholder="Describe this template..." value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
            </div>
          </CardContent>
        </Card>

        {entries.map((entry, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="font-medium text-sm">{entry.exercise.name}</p>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeEntry(i)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">Sets</Label>
                  <Input value={entry.target_sets} onChange={(e) => updateEntry(i, "target_sets", e.target.value)} className="h-8" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Reps</Label>
                  <Input value={entry.target_reps} onChange={(e) => updateEntry(i, "target_reps", e.target.value)} className="h-8" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Weight (kg)</Label>
                  <Input value={entry.target_weight} onChange={(e) => updateEntry(i, "target_weight", e.target.value)} className="h-8" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Rest (s)</Label>
                  <Input value={entry.rest_seconds} onChange={(e) => updateEntry(i, "rest_seconds", e.target.value)} className="h-8" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full h-12 border-dashed">
              <Plus className="mr-2 h-4 w-4" />
              Add Exercise
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[70vh]">
            <DialogHeader>
              <DialogTitle>Add Exercise</DialogTitle>
            </DialogHeader>
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
            </div>
            <div className="overflow-y-auto max-h-[50vh] space-y-1">
              {filtered.map((ex) => (
                <button key={ex.id} onClick={() => addExercise(ex)} className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-muted transition-colors">
                  <span className="font-medium text-sm">{ex.name}</span>
                  <p className="text-xs text-muted-foreground">{ex.muscle_groups_primary.join(", ")}</p>
                </button>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        <Button className="w-full" onClick={handleSubmit} disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Template
        </Button>
      </div>
    </div>
  );
}
