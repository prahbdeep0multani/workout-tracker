"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dumbbell,
  Plus,
  Flame,
  Trophy,
  TrendingUp,
  Calendar,
  Clock,
  Target,
  Play,
} from "lucide-react";
import type { Profile, Workout, PersonalRecord } from "@/types/database";
import { format, differenceInCalendarDays, startOfWeek, endOfWeek } from "date-fns";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [recentPrs, setRecentPrs] = useState<(PersonalRecord & { exercise_name?: string })[]>([]);
  const [streak, setStreak] = useState(0);
  const [weeklyCount, setWeeklyCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      setProfile(profileData);

      // Fetch workouts
      const { data: workoutData } = await supabase
        .from("workouts")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: false })
        .limit(50);
      setWorkouts(workoutData || []);

      // Fetch recent PRs
      const { data: prData } = await supabase
        .from("personal_records")
        .select("*, exercise:exercises(name)")
        .eq("user_id", user.id)
        .order("date", { ascending: false })
        .limit(5);

      if (prData) {
        setRecentPrs(
          prData.map((pr) => ({
            ...pr,
            exercise_name: (pr.exercise as unknown as { name: string })?.name,
          }))
        );
      }

      // Calculate streak
      if (workoutData && workoutData.length > 0) {
        let currentStreak = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const sortedDates = [...new Set(workoutData.map((w) => w.date))].sort().reverse();

        for (let i = 0; i < sortedDates.length; i++) {
          const workoutDate = new Date(sortedDates[i]);
          workoutDate.setHours(0, 0, 0, 0);
          const daysDiff = differenceInCalendarDays(today, workoutDate);

          if (daysDiff <= i + 1) {
            currentStreak++;
          } else {
            break;
          }
        }
        setStreak(currentStreak);

        // Weekly count
        const weekStart = startOfWeek(today, { weekStartsOn: 1 });
        const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
        const thisWeek = workoutData.filter((w) => {
          const d = new Date(w.date);
          return d >= weekStart && d <= weekEnd;
        });
        setWeeklyCount(thisWeek.length);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 bg-muted rounded w-1/3 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-8 bg-muted rounded w-1/2 mb-2" />
                <div className="h-4 bg-muted rounded w-1/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back{profile?.name ? `, ${profile.name}` : ""}
          </h1>
          <p className="text-muted-foreground mt-1">
            {format(new Date(), "EEEE, MMMM d")} — Let&apos;s crush it today!
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/workouts/live">
            <Button variant="outline">
              <Play className="mr-2 h-4 w-4" />
              Start Session
            </Button>
          </Link>
          <Link href="/workouts/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Log Workout
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                  <Flame className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{streak}</p>
                  <p className="text-xs text-muted-foreground">Day Streak</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{weeklyCount}</p>
                  <p className="text-xs text-muted-foreground">This Week</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <Dumbbell className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{workouts.length}</p>
                  <p className="text-xs text-muted-foreground">Total Workouts</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <Trophy className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{recentPrs.length}</p>
                  <p className="text-xs text-muted-foreground">Recent PRs</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Workouts */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Recent Workouts</CardTitle>
              <Link href="/workouts" className="text-sm text-primary hover:underline">
                View All
              </Link>
            </CardHeader>
            <CardContent>
              {workouts.length === 0 ? (
                <div className="text-center py-8">
                  <Dumbbell className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">No workouts yet</p>
                  <Link href="/workouts/new">
                    <Button size="sm" variant="outline" className="mt-3">
                      Log Your First Workout
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {workouts.slice(0, 5).map((workout) => (
                    <Link key={workout.id} href={`/workouts/${workout.id}`}>
                      <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Dumbbell className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{workout.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(workout.date), "MMM d")}
                              {workout.duration && ` · ${workout.duration} min`}
                            </p>
                          </div>
                        </div>
                        {workout.completed && (
                          <Badge variant="outline" className="text-green-400 border-green-500/20 text-xs">
                            Done
                          </Badge>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Recent PRs */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Recent PRs</CardTitle>
              <Link href="/progress/personal-records" className="text-sm text-primary hover:underline">
                View All
              </Link>
            </CardHeader>
            <CardContent>
              {recentPrs.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No personal records yet
                </p>
              ) : (
                <div className="space-y-3">
                  {recentPrs.map((pr) => (
                    <div key={pr.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{pr.exercise_name}</p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {pr.record_type.replace("_", " ")} · {pr.date}
                        </p>
                      </div>
                      <span className="text-sm font-bold text-primary">
                        {pr.value}
                        {pr.record_type === "max_weight" ? " kg" : ""}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/plans/suggested" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <Target className="mr-2 h-4 w-4" />
                  Get Plan Suggestions
                </Button>
              </Link>
              <Link href="/progress" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  View Progress
                </Button>
              </Link>
              <Link href="/exercises" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <Dumbbell className="mr-2 h-4 w-4" />
                  Browse Exercises
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
