"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Play, Dumbbell } from "lucide-react";
import type { WorkoutTemplate, TemplateExercise } from "@/types/database";

export default function TemplateDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [template, setTemplate] = useState<WorkoutTemplate | null>(null);
  const [exercises, setExercises] = useState<TemplateExercise[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetch = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("workout_templates")
        .select("*, template_exercises(*, exercise:exercises(*))")
        .eq("id", id)
        .single();

      if (data) {
        setTemplate(data);
        setExercises(
          (data.template_exercises || []).sort(
            (a: TemplateExercise, b: TemplateExercise) => a.order - b.order
          )
        );
      }
      setLoading(false);
    };
    fetch();
  }, [id]);

  if (loading) {
    return <div className="animate-pulse h-64 bg-muted rounded" />;
  }

  if (!template) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">Template not found</h2>
        <Button variant="outline" onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  return (
    <div>
      <Button variant="ghost" size="sm" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{template.name}</h1>
          {template.description && (
            <p className="text-muted-foreground mt-1">{template.description}</p>
          )}
        </div>
        <Link href={`/workouts/new?template=${id}`}>
          <Button>
            <Play className="mr-2 h-4 w-4" />
            Start Workout
          </Button>
        </Link>
      </div>

      <div className="space-y-3">
        {exercises.map((te, i) => {
          const ex = te.exercise;
          return (
            <Card key={te.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-muted-foreground w-6">{i + 1}</span>
                    <div>
                      <p className="font-medium text-sm">{ex?.name}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                        <span>{te.target_sets} sets x {te.target_reps} reps</span>
                        {te.target_weight && <span>@ {te.target_weight} kg</span>}
                        {te.rest_seconds && <span>· {te.rest_seconds}s rest</span>}
                      </div>
                    </div>
                  </div>
                  {ex?.muscle_groups_primary[0] && (
                    <Badge variant="secondary" className="text-xs">
                      {ex.muscle_groups_primary[0]}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
