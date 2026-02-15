"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Calendar, Dumbbell, Target, CheckCircle2 } from "lucide-react";
import type { UserActivePlan } from "@/types/database";
import { toast } from "sonner";
import { format } from "date-fns";

export default function ActivePlanPage() {
  const [activePlan, setActivePlan] = useState<UserActivePlan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("user_active_plans")
        .select("*, plan:workout_plans(*, plan_workouts(*, workout_template:workout_templates(*, template_exercises(*, exercise:exercises(name)))))")
        .eq("user_id", user.id)
        .eq("completed", false)
        .order("start_date", { ascending: false })
        .limit(1)
        .single();

      setActivePlan(data);
      setLoading(false);
    };
    fetch();
  }, []);

  const advanceDay = async () => {
    if (!activePlan) return;
    const supabase = createClient();
    const plan = activePlan.plan;
    if (!plan) return;

    let newDay = activePlan.current_day + 1;
    let newWeek = activePlan.current_week;
    let completed = false;

    if (newDay > plan.frequency) {
      newDay = 1;
      newWeek++;
    }
    if (newWeek > plan.duration_weeks) {
      completed = true;
    }

    const { error } = await supabase
      .from("user_active_plans")
      .update({ current_day: newDay, current_week: newWeek, completed })
      .eq("id", activePlan.id);

    if (error) {
      toast.error("Failed to update progress");
      return;
    }

    if (completed) {
      toast.success("Congratulations! Plan completed!");
    } else {
      toast.success("Progress updated!");
    }

    setActivePlan((prev) => prev ? { ...prev, current_day: newDay, current_week: newWeek, completed } : null);
  };

  if (loading) return <div className="animate-pulse h-64 bg-muted rounded" />;

  if (!activePlan) {
    return (
      <div className="text-center py-16">
        <Target className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">No active plan</h3>
        <p className="text-muted-foreground mb-6">Browse plans and activate one to get started</p>
        <Link href="/plans">
          <Button>Browse Plans</Button>
        </Link>
      </div>
    );
  }

  const plan = activePlan.plan;
  if (!plan) return null;

  const totalDays = plan.duration_weeks * plan.frequency;
  const completedDays = ((activePlan.current_week - 1) * plan.frequency) + (activePlan.current_day - 1);
  const progressPercent = Math.round((completedDays / totalDays) * 100);

  // Get today's workout
  const todayWorkouts = (plan.plan_workouts || []).filter(
    (pw) => pw.week_number === activePlan.current_week && pw.day_number === activePlan.current_day
  );

  return (
    <div>
      <Link href="/plans">
        <Button variant="ghost" size="sm" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Plans
        </Button>
      </Link>

      <h1 className="text-3xl font-bold tracking-tight mb-1">{plan.name}</h1>
      <p className="text-muted-foreground mb-6">
        Started {format(new Date(activePlan.start_date), "MMM d, yyyy")}
      </p>

      {/* Progress */}
      <Card className="mb-6">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              Week {activePlan.current_week} · Day {activePlan.current_day}
            </span>
            <span className="text-sm text-muted-foreground">{progressPercent}% complete</span>
          </div>
          <Progress value={progressPercent} className="h-3" />
          <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
            <span>{completedDays} days done</span>
            <span>{totalDays - completedDays} days remaining</span>
          </div>
        </CardContent>
      </Card>

      {/* Today's Workout */}
      <h2 className="text-lg font-semibold mb-3">Today&apos;s Workout</h2>
      {todayWorkouts.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">No workout scheduled for today</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {todayWorkouts.map((pw) => {
            const template = pw.workout_template;
            const exercises = template?.template_exercises || [];

            return (
              <Card key={pw.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{template?.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    {exercises.map((te, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <span>{te.exercise?.name}</span>
                        <span className="text-muted-foreground">
                          {te.target_sets}x{te.target_reps}
                          {te.target_weight ? ` @ ${te.target_weight}kg` : ""}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Link href="/workouts/live" className="flex-1">
                      <Button className="w-full">Start Workout</Button>
                    </Link>
                    <Button variant="outline" onClick={advanceDay}>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Mark Done
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
