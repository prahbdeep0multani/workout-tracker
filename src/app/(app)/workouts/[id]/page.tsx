"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Calendar, Clock, Dumbbell, Edit, Trash2, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import type { Workout, WorkoutExercise } from "@/types/database";

export default function WorkoutDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [workoutExercises, setWorkoutExercises] = useState<WorkoutExercise[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchWorkout = async () => {
      const supabase = createClient();

      const { data: workoutData } = await supabase
        .from("workouts")
        .select("*")
        .eq("id", id)
        .single();

      if (workoutData) {
        setWorkout(workoutData);

        const { data: weData } = await supabase
          .from("workout_exercises")
          .select(`
            *,
            exercise:exercises(*),
            sets(*)
          `)
          .eq("workout_id", id)
          .order("order");

        setWorkoutExercises(weData || []);
      }

      setLoading(false);
    };

    fetchWorkout();
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this workout?")) return;

    const supabase = createClient();
    const { error } = await supabase.from("workouts").delete().eq("id", id);

    if (error) {
      toast.error("Failed to delete workout");
      return;
    }

    toast.success("Workout deleted");
    router.push("/workouts");
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-muted rounded w-1/3" />
        <div className="h-4 bg-muted rounded w-1/4" />
        <div className="h-64 bg-muted rounded" />
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">Workout not found</h2>
        <Button variant="outline" onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  const totalVolume = workoutExercises.reduce((acc, we) => {
    const sets = (we as WorkoutExercise & { sets: { reps: number; weight: number }[] }).sets || [];
    return acc + sets.reduce((sacc, s) => sacc + (s.reps || 0) * (s.weight || 0), 0);
  }, 0);

  const totalSets = workoutExercises.reduce((acc, we) => {
    return acc + ((we as WorkoutExercise & { sets: unknown[] }).sets?.length || 0);
  }, 0);

  return (
    <div>
      <Button variant="ghost" size="sm" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">{workout.name}</h1>
            {workout.completed && (
              <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Completed
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {format(new Date(workout.date), "EEEE, MMMM d, yyyy")}
            </span>
            {workout.duration && (
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {workout.duration} min
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={handleDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {workout.notes && (
        <p className="text-muted-foreground mb-6">{workout.notes}</p>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{workoutExercises.length}</p>
            <p className="text-xs text-muted-foreground">Exercises</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{totalSets}</p>
            <p className="text-xs text-muted-foreground">Total Sets</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{totalVolume.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Volume (kg)</p>
          </CardContent>
        </Card>
      </div>

      {/* Exercises */}
      <div className="space-y-4">
        {workoutExercises.map((we, i) => {
          const exercise = we.exercise;
          const sets = (we as WorkoutExercise & { sets: { set_number: number; reps: number; weight: number; rpe: number }[] }).sets || [];

          return (
            <Card key={we.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-muted-foreground">{i + 1}</span>
                  <CardTitle className="text-base">{exercise?.name}</CardTitle>
                  {exercise?.muscle_groups_primary[0] && (
                    <Badge variant="secondary" className="text-xs">
                      {exercise.muscle_groups_primary[0]}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">Set</TableHead>
                      <TableHead>Reps</TableHead>
                      <TableHead>Weight</TableHead>
                      <TableHead>RPE</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sets.map((s) => (
                      <TableRow key={s.set_number}>
                        <TableCell className="text-muted-foreground">{s.set_number}</TableCell>
                        <TableCell>{s.reps || "-"}</TableCell>
                        <TableCell>{s.weight ? `${s.weight} kg` : "-"}</TableCell>
                        <TableCell>{s.rpe || "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {we.notes && (
                  <p className="text-xs text-muted-foreground mt-2 italic">{we.notes}</p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
