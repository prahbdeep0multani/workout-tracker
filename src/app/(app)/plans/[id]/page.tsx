"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Dumbbell, Target, Play, Loader2 } from "lucide-react";
import type { WorkoutPlan } from "@/types/database";
import { toast } from "sonner";

export default function PlanDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [plan, setPlan] = useState<WorkoutPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [activating, setActivating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetch = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("workout_plans")
        .select("*, plan_workouts(*, workout_template:workout_templates(*, template_exercises(*, exercise:exercises(name))))")
        .eq("id", id)
        .single();
      setPlan(data);
      setLoading(false);
    };
    fetch();
  }, [id]);

  const handleActivate = async () => {
    setActivating(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("user_active_plans").insert({
      user_id: user.id,
      plan_id: id,
      start_date: new Date().toISOString().split("T")[0],
      current_week: 1,
      current_day: 1,
      completed: false,
    });

    if (error) {
      toast.error("Failed to activate plan");
    } else {
      toast.success("Plan activated!");
      router.push("/plans/active");
    }
    setActivating(false);
  };

  if (loading) return <div className="animate-pulse h-64 bg-muted rounded" />;

  if (!plan) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">Plan not found</h2>
        <Button variant="outline" onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  const planWorkouts = plan.plan_workouts || [];
  const weeks = [...new Set(planWorkouts.map((pw) => pw.week_number))].sort();

  return (
    <div>
      <Button variant="ghost" size="sm" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{plan.name}</h1>
          {plan.description && (
            <p className="text-muted-foreground mt-1">{plan.description}</p>
          )}
          <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
            <Badge variant="outline" className="capitalize">{plan.difficulty}</Badge>
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {plan.duration_weeks} weeks
            </span>
            <span className="flex items-center gap-1">
              <Dumbbell className="h-4 w-4" />
              {plan.frequency}x/week
            </span>
            <span className="flex items-center gap-1">
              <Target className="h-4 w-4" />
              {plan.goal}
            </span>
          </div>
        </div>
        <Button onClick={handleActivate} disabled={activating}>
          {activating ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Play className="mr-2 h-4 w-4" />
          )}
          Activate Plan
        </Button>
      </div>

      {plan.equipment_required?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <span className="text-sm text-muted-foreground mr-1">Equipment:</span>
          {plan.equipment_required.map((eq) => (
            <Badge key={eq} variant="secondary">{eq}</Badge>
          ))}
        </div>
      )}

      {/* Weekly Breakdown */}
      <div className="space-y-6">
        {weeks.slice(0, 2).map((week) => {
          const weekWorkouts = planWorkouts
            .filter((pw) => pw.week_number === week)
            .sort((a, b) => a.day_number - b.day_number);

          return (
            <div key={week}>
              <h2 className="text-lg font-semibold mb-3">Week {week}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {weekWorkouts.map((pw) => {
                  const template = pw.workout_template;
                  const exercises = template?.template_exercises || [];

                  return (
                    <Card key={pw.id}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">
                          Day {pw.day_number}: {template?.name || "Workout"}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-1">
                          {exercises.slice(0, 5).map((te, i) => (
                            <p key={i} className="text-xs text-muted-foreground">
                              {te.exercise?.name} — {te.target_sets}x{te.target_reps}
                            </p>
                          ))}
                          {exercises.length > 5 && (
                            <p className="text-xs text-muted-foreground">
                              +{exercises.length - 5} more
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          );
        })}
        {weeks.length > 2 && (
          <p className="text-sm text-muted-foreground">
            ...and {weeks.length - 2} more week{weeks.length - 2 > 1 ? "s" : ""} (weeks repeat the same pattern)
          </p>
        )}
      </div>
    </div>
  );
}
