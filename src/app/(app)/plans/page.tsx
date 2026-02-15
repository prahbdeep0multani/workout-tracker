"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, Calendar, Dumbbell, Sparkles } from "lucide-react";
import type { WorkoutPlan } from "@/types/database";
import { motion } from "framer-motion";

export default function PlansPage() {
  const [plans, setPlans] = useState<WorkoutPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("workout_plans")
        .select("*")
        .order("difficulty");
      setPlans(data || []);
      setLoading(false);
    };
    fetch();
  }, []);

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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Workout Plans</h1>
          <p className="text-muted-foreground mt-1">Structured programs to reach your goals</p>
        </div>
        <Link href="/plans/suggested">
          <Button>
            <Sparkles className="mr-2 h-4 w-4" />
            Get Suggestions
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6"><div className="h-20 bg-muted rounded" /></CardContent>
            </Card>
          ))}
        </div>
      ) : plans.length === 0 ? (
        <div className="text-center py-16">
          <Target className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No plans available</h3>
          <p className="text-muted-foreground">Run the seed SQL to populate system plans</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={`/plans/${plan.id}`}>
                <Card className="hover:border-primary/30 transition-colors cursor-pointer h-full">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base leading-tight">{plan.name}</CardTitle>
                      <Badge variant="outline" className={difficultyColor(plan.difficulty)}>
                        {plan.difficulty}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {plan.description && (
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{plan.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {plan.duration_weeks} weeks
                      </span>
                      <span className="flex items-center gap-1">
                        <Dumbbell className="h-3.5 w-3.5" />
                        {plan.frequency}x/week
                      </span>
                      <span className="flex items-center gap-1">
                        <Target className="h-3.5 w-3.5" />
                        {plan.goal}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
