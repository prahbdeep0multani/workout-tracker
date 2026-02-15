"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2, ArrowLeft, Loader2, Search, GripVertical } from "lucide-react";
import { toast } from "sonner";
import type { Exercise } from "@/types/database";

interface WorkoutExerciseEntry {
  exercise: Exercise;
  sets: { reps: string; weight: string; rpe: string }[];
  notes: string;
}

export default function NewWorkoutPage() {
  return (
    <Suspense fallback={<div className="animate-pulse h-64 bg-muted rounded" />}>
      <NewWorkoutContent />
    </Suspense>
  );
}

function NewWorkoutContent() {
  const [name, setName] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState("");
  const [exercises, setExercises] = useState<WorkoutExerciseEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [allExercises, setAllExercises] = useState<Exercise[]>([]);
  const [exerciseSearch, setExerciseSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchExercises = async () => {
      const supabase = createClient();
      const { data } = await supabase.from("exercises").select("*").order("name");
      setAllExercises(data || []);

      // Load template if provided
      const templateId = searchParams.get("template");
      if (templateId && data) {
        const { data: templateData } = await supabase
          .from("workout_templates")
          .select("*, template_exercises(*, exercise:exercises(*))")
          .eq("id", templateId)
          .single();

        if (templateData) {
          setName(templateData.name);
          const sortedExercises = (templateData.template_exercises || [])
            .sort((a: { order: number }, b: { order: number }) => a.order - b.order);
          setExercises(
            sortedExercises.map((te: { exercise: Exercise; target_sets: number; target_reps: number; target_weight: number | null }) => ({
              exercise: te.exercise,
              sets: Array.from({ length: te.target_sets }, () => ({
                reps: te.target_reps ? String(te.target_reps) : "",
                weight: te.target_weight ? String(te.target_weight) : "",
                rpe: "",
              })),
              notes: "",
            }))
          );
        }
      }
    };
    fetchExercises();
  }, [searchParams]);

  const addExercise = (exercise: Exercise) => {
    setExercises((prev) => [
      ...prev,
      {
        exercise,
        sets: [{ reps: "", weight: "", rpe: "" }],
        notes: "",
      },
    ]);
    setDialogOpen(false);
    setExerciseSearch("");
  };

  const removeExercise = (index: number) => {
    setExercises((prev) => prev.filter((_, i) => i !== index));
  };

  const addSet = (exerciseIndex: number) => {
    setExercises((prev) =>
      prev.map((e, i) =>
        i === exerciseIndex
          ? { ...e, sets: [...e.sets, { reps: "", weight: "", rpe: "" }] }
          : e
      )
    );
  };

  const removeSet = (exerciseIndex: number, setIndex: number) => {
    setExercises((prev) =>
      prev.map((e, i) =>
        i === exerciseIndex
          ? { ...e, sets: e.sets.filter((_, si) => si !== setIndex) }
          : e
      )
    );
  };

  const updateSet = (exerciseIndex: number, setIndex: number, field: string, value: string) => {
    setExercises((prev) =>
      prev.map((e, i) =>
        i === exerciseIndex
          ? {
              ...e,
              sets: e.sets.map((s, si) =>
                si === setIndex ? { ...s, [field]: value } : s
              ),
            }
          : e
      )
    );
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("Please enter a workout name");
      return;
    }
    if (exercises.length === 0) {
      toast.error("Add at least one exercise");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Not logged in");
      return;
    }

    // Create workout
    const { data: workout, error: workoutError } = await supabase
      .from("workouts")
      .insert({
        user_id: user.id,
        name,
        date,
        notes: notes || null,
        completed: true,
      })
      .select()
      .single();

    if (workoutError || !workout) {
      toast.error("Failed to create workout");
      setLoading(false);
      return;
    }

    // Create workout exercises and sets
    for (let i = 0; i < exercises.length; i++) {
      const entry = exercises[i];

      const { data: we } = await supabase
        .from("workout_exercises")
        .insert({
          workout_id: workout.id,
          exercise_id: entry.exercise.id,
          order: i,
          notes: entry.notes || null,
        })
        .select()
        .single();

      if (we) {
        const setsToInsert = entry.sets
          .filter((s) => s.reps || s.weight)
          .map((s, si) => ({
            workout_exercise_id: we.id,
            set_number: si + 1,
            reps: s.reps ? parseInt(s.reps) : null,
            weight: s.weight ? parseFloat(s.weight) : null,
            rpe: s.rpe ? parseInt(s.rpe) : null,
            completed: true,
          }));

        if (setsToInsert.length > 0) {
          await supabase.from("sets").insert(setsToInsert);
        }

        // Check for PRs
        for (const set of setsToInsert) {
          if (set.weight) {
            const { data: existingPr } = await supabase
              .from("personal_records")
              .select("*")
              .eq("user_id", user.id)
              .eq("exercise_id", entry.exercise.id)
              .eq("record_type", "max_weight")
              .single();

            if (!existingPr || set.weight > existingPr.value) {
              if (existingPr) {
                await supabase
                  .from("personal_records")
                  .update({ value: set.weight, date, workout_id: workout.id })
                  .eq("id", existingPr.id);
              } else {
                await supabase.from("personal_records").insert({
                  user_id: user.id,
                  exercise_id: entry.exercise.id,
                  record_type: "max_weight",
                  value: set.weight,
                  date,
                  workout_id: workout.id,
                });
              }
            }
          }
        }
      }
    }

    // Calculate duration (estimate from sets)
    const totalSets = exercises.reduce((acc, e) => acc + e.sets.length, 0);
    const estimatedDuration = Math.max(totalSets * 3, 15); // ~3 min per set, minimum 15
    await supabase
      .from("workouts")
      .update({ duration: estimatedDuration })
      .eq("id", workout.id);

    toast.success("Workout logged!");
    router.push(`/workouts/${workout.id}`);
  };

  const filteredExerciseList = allExercises.filter((e) =>
    e.name.toLowerCase().includes(exerciseSearch.toLowerCase())
  );

  return (
    <div>
      <Button variant="ghost" size="sm" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <h1 className="text-3xl font-bold tracking-tight mb-6">Log Workout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Workout Info */}
          <Card>
            <CardContent className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Workout Name</Label>
                  <Input
                    placeholder="e.g., Upper Body Strength"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Notes (optional)</Label>
                <Textarea
                  placeholder="How did the workout feel?"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Exercises */}
          {exercises.map((entry, ei) => (
            <Card key={ei}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                    <CardTitle className="text-base">{entry.exercise.name}</CardTitle>
                    <Badge variant="secondary" className="text-xs">
                      {entry.exercise.muscle_groups_primary[0]}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeExercise(ei)}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Set headers */}
                <div className="grid grid-cols-[40px_1fr_1fr_1fr_40px] gap-2 text-xs text-muted-foreground font-medium">
                  <span>Set</span>
                  <span>Reps</span>
                  <span>Weight (kg)</span>
                  <span>RPE</span>
                  <span />
                </div>
                {/* Sets */}
                {entry.sets.map((set, si) => (
                  <div key={si} className="grid grid-cols-[40px_1fr_1fr_1fr_40px] gap-2 items-center">
                    <span className="text-sm font-medium text-muted-foreground text-center">
                      {si + 1}
                    </span>
                    <Input
                      type="number"
                      placeholder="10"
                      value={set.reps}
                      onChange={(e) => updateSet(ei, si, "reps", e.target.value)}
                      className="h-9"
                    />
                    <Input
                      type="number"
                      placeholder="0"
                      value={set.weight}
                      onChange={(e) => updateSet(ei, si, "weight", e.target.value)}
                      className="h-9"
                    />
                    <Input
                      type="number"
                      placeholder="7"
                      min={1}
                      max={10}
                      value={set.rpe}
                      onChange={(e) => updateSet(ei, si, "rpe", e.target.value)}
                      className="h-9"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSet(ei, si)}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      disabled={entry.sets.length <= 1}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addSet(ei)}
                  className="w-full"
                >
                  <Plus className="mr-2 h-3.5 w-3.5" />
                  Add Set
                </Button>
              </CardContent>
            </Card>
          ))}

          {/* Add Exercise Button */}
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full h-14 border-dashed">
                <Plus className="mr-2 h-5 w-5" />
                Add Exercise
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[70vh]">
              <DialogHeader>
                <DialogTitle>Add Exercise</DialogTitle>
              </DialogHeader>
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search exercises..."
                  value={exerciseSearch}
                  onChange={(e) => setExerciseSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="overflow-y-auto max-h-[50vh] space-y-1">
                {filteredExerciseList.map((ex) => (
                  <button
                    key={ex.id}
                    onClick={() => addExercise(ex)}
                    className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-muted transition-colors"
                  >
                    <span className="font-medium text-sm">{ex.name}</span>
                    <div className="flex gap-1 mt-0.5">
                      {ex.muscle_groups_primary.map((m) => (
                        <span key={m} className="text-xs text-muted-foreground">{m}</span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Sidebar - Summary */}
        <div>
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle className="text-base">Workout Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Exercises</span>
                <span className="font-medium">{exercises.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Sets</span>
                <span className="font-medium">
                  {exercises.reduce((acc, e) => acc + e.sets.length, 0)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Volume</span>
                <span className="font-medium">
                  {exercises
                    .reduce(
                      (acc, e) =>
                        acc +
                        e.sets.reduce(
                          (sacc, s) =>
                            sacc + (parseFloat(s.reps || "0") * parseFloat(s.weight || "0")),
                          0
                        ),
                      0
                    )
                    .toFixed(0)}{" "}
                  kg
                </span>
              </div>
              <Button
                className="w-full mt-4"
                onClick={handleSubmit}
                disabled={loading || exercises.length === 0}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Workout
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
