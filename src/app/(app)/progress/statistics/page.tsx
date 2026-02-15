"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, BarChart3, Dumbbell, Calendar, Clock, TrendingUp } from "lucide-react";
import { format, startOfWeek, eachDayOfInterval, subDays } from "date-fns";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const CHART_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export default function StatisticsPage() {
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    avgDuration: 0,
    totalVolume: 0,
    avgWorkoutsPerWeek: 0,
  });
  const [weeklyData, setWeeklyData] = useState<{ day: string; count: number }[]>([]);
  const [muscleData, setMuscleData] = useState<{ name: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get all workouts
      const { data: workouts } = await supabase
        .from("workouts")
        .select("*")
        .eq("user_id", user.id)
        .order("date");

      if (workouts) {
        const totalWorkouts = workouts.length;
        const totalDuration = workouts.reduce((acc, w) => acc + (w.duration || 0), 0);
        const avgDuration = totalWorkouts > 0 ? Math.round(totalDuration / totalWorkouts) : 0;

        // Weeks of training
        if (workouts.length > 1) {
          const firstDate = new Date(workouts[0].date);
          const lastDate = new Date(workouts[workouts.length - 1].date);
          const weeks = Math.max(1, Math.ceil((lastDate.getTime() - firstDate.getTime()) / (7 * 24 * 60 * 60 * 1000)));
          setStats((prev) => ({ ...prev, avgWorkoutsPerWeek: Math.round((totalWorkouts / weeks) * 10) / 10 }));
        }

        setStats((prev) => ({ ...prev, totalWorkouts, avgDuration }));

        // Weekly distribution (last 4 weeks)
        const last28Days = eachDayOfInterval({
          start: subDays(new Date(), 27),
          end: new Date(),
        });
        const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        const dayCounts = dayNames.map((day) => ({ day, count: 0 }));

        workouts
          .filter((w) => new Date(w.date) >= subDays(new Date(), 27))
          .forEach((w) => {
            const dayIndex = (new Date(w.date).getDay() + 6) % 7; // Monday = 0
            dayCounts[dayIndex].count++;
          });
        setWeeklyData(dayCounts);
      }

      // Get muscle group distribution
      const { data: workoutExercises } = await supabase
        .from("workout_exercises")
        .select("exercise:exercises(muscle_groups_primary), workout:workouts!inner(user_id)")
        .eq("workout.user_id", user.id);

      if (workoutExercises) {
        const muscleCounts: Record<string, number> = {};
        workoutExercises.forEach((we) => {
          const muscles = (we.exercise as unknown as { muscle_groups_primary: string[] })?.muscle_groups_primary || [];
          muscles.forEach((m) => {
            muscleCounts[m] = (muscleCounts[m] || 0) + 1;
          });
        });
        const sorted = Object.entries(muscleCounts)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 8);
        setMuscleData(sorted);
      }

      setLoading(false);
    };
    fetch();
  }, []);

  return (
    <div>
      <Link href="/progress">
        <Button variant="ghost" size="sm" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </Link>

      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Statistics</h1>
        <p className="text-muted-foreground mt-1">Your workout analytics</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <Dumbbell className="h-5 w-5 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold">{stats.totalWorkouts}</p>
            <p className="text-xs text-muted-foreground">Total Workouts</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-5 w-5 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold">{stats.avgDuration}</p>
            <p className="text-xs text-muted-foreground">Avg Duration (min)</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Calendar className="h-5 w-5 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold">{stats.avgWorkoutsPerWeek}</p>
            <p className="text-xs text-muted-foreground">Avg/Week</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-5 w-5 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold">{muscleData.length}</p>
            <p className="text-xs text-muted-foreground">Muscle Groups Hit</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="distribution" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="distribution">Weekly Distribution</TabsTrigger>
          <TabsTrigger value="muscles">Muscle Groups</TabsTrigger>
        </TabsList>

        <TabsContent value="distribution">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Weekly Distribution (Last 4 Weeks)</CardTitle>
            </CardHeader>
            <CardContent>
              {weeklyData.length > 0 ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="day" fontSize={12} stroke="hsl(var(--muted-foreground))" />
                      <YAxis fontSize={12} stroke="hsl(var(--muted-foreground))" allowDecimals={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                          color: "hsl(var(--card-foreground))",
                        }}
                      />
                      <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">No data yet</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="muscles">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Muscle Group Focus</CardTitle>
            </CardHeader>
            <CardContent>
              {muscleData.length > 0 ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={muscleData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, percent }: { name?: string; percent?: number }) => `${name || ""} ${((percent || 0) * 100).toFixed(0)}%`}
                        labelLine={false}
                        fontSize={10}
                      >
                        {muscleData.map((_, i) => (
                          <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                          color: "hsl(var(--card-foreground))",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">No data yet</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
