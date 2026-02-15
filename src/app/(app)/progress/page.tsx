"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Trophy, Scale, BarChart3 } from "lucide-react";
import type { Workout, PersonalRecord, BodyMetric } from "@/types/database";
import { motion } from "framer-motion";

export default function ProgressPage() {
  const [workoutCount, setWorkoutCount] = useState(0);
  const [prCount, setPrCount] = useState(0);
  const [latestWeight, setLatestWeight] = useState<number | null>(null);
  const [totalVolume, setTotalVolume] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Workout count
      const { count } = await supabase
        .from("workouts")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);
      setWorkoutCount(count || 0);

      // PR count
      const { count: prs } = await supabase
        .from("personal_records")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);
      setPrCount(prs || 0);

      // Latest body weight
      const { data: metrics } = await supabase
        .from("body_metrics")
        .select("weight")
        .eq("user_id", user.id)
        .not("weight", "is", null)
        .order("date", { ascending: false })
        .limit(1);
      if (metrics?.[0]?.weight) setLatestWeight(metrics[0].weight);

      setLoading(false);
    };
    fetch();
  }, []);

  const cards = [
    {
      title: "Personal Records",
      description: "View your all-time bests",
      value: prCount,
      icon: Trophy,
      color: "text-yellow-500 bg-yellow-500/10",
      href: "/progress/personal-records",
    },
    {
      title: "Body Metrics",
      description: "Track weight and measurements",
      value: latestWeight ? `${latestWeight} kg` : "No data",
      icon: Scale,
      color: "text-blue-500 bg-blue-500/10",
      href: "/progress/body-metrics",
    },
    {
      title: "Statistics",
      description: "Detailed workout analytics",
      value: `${workoutCount} workouts`,
      icon: BarChart3,
      color: "text-green-500 bg-green-500/10",
      href: "/progress/statistics",
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Progress</h1>
        <p className="text-muted-foreground mt-1">Track your fitness journey</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cards.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Link href={card.href}>
              <Card className="hover:border-primary/30 transition-colors cursor-pointer h-full">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${card.color}`}>
                      <card.icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-base">{card.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold mb-1">{loading ? "..." : card.value}</p>
                  <p className="text-xs text-muted-foreground">{card.description}</p>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
