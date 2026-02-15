"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2, Play, Pause, Square, Search, CheckCircle2, Clock } from "lucide-react";
import { toast } from "sonner";
import type { Exercise } from "@/types/database";
import { motion } from "framer-motion";

interface LiveExerciseEntry {
  exercise: Exercise;
  sets: { reps: string; weight: string; rpe: string; completed: boolean }[];
}

export default function LiveWorkoutPage() {
  const [name, setName] = useState("");
  const [exercises, setExercises] = useState<LiveExerciseEntry[]>([]);
  const [allExercises, setAllExercises] = useState<Exercise[]>([]);
  const [exerciseSearch, setExerciseSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [restTimer, setRestTimer] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [saving, setSaving] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const restIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchExercises = async () => {
      const supabase = createClient();
      const { data } = await supabase.from("exercises").select("*").order("name");
      setAllExercises(data || []);
    };
    fetchExercises();
  }, []);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setElapsedSeconds((s) => s + 1);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  useEffect(() => {
    if (isResting && restTimer > 0) {
      restIntervalRef.current = setInterval(() => {
        setRestTimer((t) => {
          if (t <= 1) {
            setIsResting(false);
            toast.info("Rest complete!");
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => {
      if (restIntervalRef.current) clearInterval(restIntervalRef.current);
    };
  }, [isResting, restTimer]);

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
    return `${m}:${String(sec).padStart(2, "0")}`;
  };

  const startRest = (seconds: number) => {
    setRestTimer(seconds);
    setIsResting(true);
  };

  const addExercise = (exercise: Exercise) => {
    setExercises((prev) => [
      ...prev,
      { exercise, sets: [{ reps: "", weight: "", rpe: "", completed: false }] },
    ]);
    setDialogOpen(false);
    setExerciseSearch("");
    if (!isRunning) setIsRunning(true);
  };

  const toggleSetComplete = (ei: number, si: number) => {
    setExercises((prev) =>
      prev.map((e, i) =>
        i === ei
          ? {
              ...e,
              sets: e.sets.map((s, j) =>
                j === si ? { ...s, completed: !s.completed } : s
              ),
            }
          : e
      )
    );
  };

  const addSet = (ei: number) => {
    setExercises((prev) =>
      prev.map((e, i) =>
        i === ei
          ? { ...e, sets: [...e.sets, { reps: "", weight: "", rpe: "", completed: false }] }
          : e
      )
    );
  };

  const updateSet = (ei: number, si: number, field: string, value: string) => {
    setExercises((prev) =>
      prev.map((e, i) =>
        i === ei
          ? { ...e, sets: e.sets.map((s, j) => (j === si ? { ...s, [field]: value } : s)) }
          : e
      )
    );
  };

  const removeExercise = (index: number) => {
    setExercises((prev) => prev.filter((_, i) => i !== index));
  };

  const finishWorkout = async () => {
    if (!name.trim()) {
      toast.error("Give your workout a name");
      return;
    }
    if (exercises.length === 0) {
      toast.error("Add at least one exercise");
      return;
    }

    setSaving(true);
    setIsRunning(false);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const duration = Math.round(elapsedSeconds / 60);

    const { data: workout } = await supabase
      .from("workouts")
      .insert({
        user_id: user.id,
        name,
        date: new Date().toISOString().split("T")[0],
        duration,
        completed: true,
      })
      .select()
      .single();

    if (!workout) {
      toast.error("Failed to save workout");
      setSaving(false);
      return;
    }

    for (let i = 0; i < exercises.length; i++) {
      const entry = exercises[i];
      const { data: we } = await supabase
        .from("workout_exercises")
        .insert({
          workout_id: workout.id,
          exercise_id: entry.exercise.id,
          order: i,
        })
        .select()
        .single();

      if (we) {
        const completedSets = entry.sets
          .filter((s) => s.completed && (s.reps || s.weight))
          .map((s, si) => ({
            workout_exercise_id: we.id,
            set_number: si + 1,
            reps: s.reps ? parseInt(s.reps) : null,
            weight: s.weight ? parseFloat(s.weight) : null,
            rpe: s.rpe ? parseInt(s.rpe) : null,
            completed: true,
          }));

        if (completedSets.length > 0) {
          await supabase.from("sets").insert(completedSets);
        }

        // Check for PRs
        for (const set of completedSets) {
          if (set.weight) {
            const { data: existingPr } = await supabase
              .from("personal_records")
              .select("*")
              .eq("user_id", user.id)
              .eq("exercise_id", entry.exercise.id)
              .eq("record_type", "max_weight")
              .single();

            if (!existingPr || set.weight > existingPr.value) {
              const todayDate = new Date().toISOString().split("T")[0];
              if (existingPr) {
                await supabase
                  .from("personal_records")
                  .update({ value: set.weight, date: todayDate, workout_id: workout.id })
                  .eq("id", existingPr.id);
              } else {
                await supabase.from("personal_records").insert({
                  user_id: user.id,
                  exercise_id: entry.exercise.id,
                  record_type: "max_weight",
                  value: set.weight,
                  date: todayDate,
                  workout_id: workout.id,
                });
              }
              toast.success(`New PR! ${entry.exercise.name}: ${set.weight} kg`);
            }
          }
        }
      }
    }

    toast.success(`Workout saved! Duration: ${duration} min`);
    router.push(`/workouts/${workout.id}`);
  };

  const filteredExerciseList = allExercises.filter((e) =>
    e.name.toLowerCase().includes(exerciseSearch.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Live Workout</h1>
          <Input
            placeholder="Workout name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 max-w-xs"
          />
        </div>

        {/* Timer */}
        <div className="text-right">
          <div className="text-4xl font-mono font-bold text-primary">
            {formatTime(elapsedSeconds)}
          </div>
          <div className="flex gap-2 mt-2 justify-end">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsRunning(!isRunning)}
            >
              {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={finishWorkout}
              disabled={saving}
            >
              <Square className="mr-2 h-4 w-4" />
              Finish
            </Button>
          </div>
        </div>
      </div>

      {/* Rest Timer */}
      {isResting && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-primary animate-pulse" />
                <span className="font-medium">Rest Timer</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-mono font-bold text-primary">
                  {formatTime(restTimer)}
                </span>
                <Button variant="ghost" size="sm" onClick={() => setIsResting(false)}>
                  Skip
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Exercises */}
      <div className="space-y-4 mb-6">
        {exercises.map((entry, ei) => (
          <Card key={ei}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{entry.exercise.name}</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => removeExercise(ei)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-[32px_1fr_1fr_1fr_40px] gap-2 text-xs text-muted-foreground font-medium">
                <span />
                <span>Reps</span>
                <span>Weight (kg)</span>
                <span>RPE</span>
                <span />
              </div>
              {entry.sets.map((set, si) => (
                <div
                  key={si}
                  className="grid grid-cols-[32px_1fr_1fr_1fr_40px] gap-2 items-center"
                >
                  <button
                    onClick={() => {
                      toggleSetComplete(ei, si);
                      if (!set.completed) startRest(90);
                    }}
                    className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-colors ${
                      set.completed
                        ? "border-green-500 bg-green-500/10"
                        : "border-muted-foreground/30"
                    }`}
                  >
                    {set.completed && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                  </button>
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
                  <span className="text-xs text-muted-foreground text-center">{si + 1}</span>
                </div>
              ))}
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => addSet(ei)}>
                  <Plus className="mr-1 h-3.5 w-3.5" />
                  Add Set
                </Button>
                {!isResting && (
                  <Button variant="ghost" size="sm" onClick={() => startRest(90)}>
                    <Clock className="mr-1 h-3.5 w-3.5" />
                    Rest 90s
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Exercise */}
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
  );
}
