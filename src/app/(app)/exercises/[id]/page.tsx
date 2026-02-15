"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Dumbbell, Target, BarChart3 } from "lucide-react";
import type { Exercise, PersonalRecord } from "@/types/database";

export default function ExerciseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [prs, setPrs] = useState<PersonalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();

      const { data: exerciseData } = await supabase
        .from("exercises")
        .select("*")
        .eq("id", id)
        .single();

      if (exerciseData) {
        setExercise(exerciseData);

        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: prData } = await supabase
            .from("personal_records")
            .select("*")
            .eq("exercise_id", id)
            .eq("user_id", user.id)
            .order("date", { ascending: false });
          setPrs(prData || []);
        }
      }

      setLoading(false);
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-muted rounded w-1/3" />
        <div className="h-4 bg-muted rounded w-1/2" />
        <div className="h-64 bg-muted rounded" />
      </div>
    );
  }

  if (!exercise) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">Exercise not found</h2>
        <Button variant="outline" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  const difficultyColor = (d: string) => {
    switch (d) {
      case "beginner": return "bg-green-500/10 text-green-400 border-green-500/20";
      case "intermediate": return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      case "advanced": return "bg-red-500/10 text-red-400 border-red-500/20";
      default: return "";
    }
  };

  return (
    <div>
      <Button variant="ghost" size="sm" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{exercise.name}</h1>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className={difficultyColor(exercise.difficulty)}>
              {exercise.difficulty}
            </Badge>
            <Badge variant="secondary">{exercise.category}</Badge>
          </div>
        </div>
      </div>

      {exercise.description && (
        <p className="text-muted-foreground mb-6">{exercise.description}</p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Muscle Groups */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                Muscle Groups
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Primary</p>
                  <div className="flex flex-wrap gap-1">
                    {exercise.muscle_groups_primary.map((m) => (
                      <Badge key={m}>{m}</Badge>
                    ))}
                  </div>
                </div>
                {exercise.muscle_groups_secondary.length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Secondary</p>
                    <div className="flex flex-wrap gap-1">
                      {exercise.muscle_groups_secondary.map((m) => (
                        <Badge key={m} variant="outline">{m}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Instructions */}
          {exercise.instructions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Instructions</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3">
                  {exercise.instructions.map((step, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-semibold">
                        {i + 1}
                      </span>
                      <span className="text-sm text-muted-foreground">{step}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          )}

          {/* Equipment */}
          {exercise.equipment.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Dumbbell className="h-4 w-4 text-primary" />
                  Equipment Required
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {exercise.equipment.map((e) => (
                    <Badge key={e} variant="outline">{e}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar - Personal Records */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary" />
                Your Records
              </CardTitle>
            </CardHeader>
            <CardContent>
              {prs.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No records yet. Start logging workouts to track your progress!
                </p>
              ) : (
                <div className="space-y-3">
                  {prs.map((pr) => (
                    <div key={pr.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium capitalize">
                          {pr.record_type.replace("_", " ")}
                        </p>
                        <p className="text-xs text-muted-foreground">{pr.date}</p>
                      </div>
                      <span className="text-lg font-bold text-primary">
                        {pr.value}
                        {pr.record_type === "max_weight" ? " kg" : pr.record_type === "max_reps" ? " reps" : ""}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
