"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Dumbbell, Target, Sparkles, Star } from "lucide-react";
import type { WorkoutPlan, Profile } from "@/types/database";
import { motion } from "framer-motion";

interface ScoredPlan extends WorkoutPlan {
  score: number;
}

function scorePlan(plan: WorkoutPlan, profile: Profile): number {
  let score = 0;

  // Goal match (40 points)
  if (profile.goals?.some((g) => plan.goal.toLowerCase().includes(g.toLowerCase()))) {
    score += 40;
  }

  // Frequency match (30 points exact, 15 within 1)
  if (profile.training_frequency) {
    if (plan.frequency === profile.training_frequency) {
      score += 30;
    } else if (Math.abs(plan.frequency - profile.training_frequency) <= 1) {
      score += 15;
    }
  }

  // Level match (20 points)
  if (profile.fitness_level === plan.difficulty) {
    score += 20;
  }

  // Equipment compatibility (10 points)
  if (profile.equipment && plan.equipment_required) {
    const hasAll = plan.equipment_required.every((eq) =>
      profile.equipment!.some((ue) => ue.toLowerCase().includes(eq.toLowerCase()))
    );
    if (hasAll) score += 10;
  }

  return score;
}

export default function SuggestedPlansPage() {
  const [plans, setPlans] = useState<ScoredPlan[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      setProfile(profileData);

      const { data: plansData } = await supabase
        .from("workout_plans")
        .select("*")
        .eq("is_system_plan", true);

      if (plansData && profileData) {
        const scored = plansData
          .map((plan) => ({
            ...plan,
            score: scorePlan(plan, profileData),
          }))
          .sort((a, b) => b.score - a.score);
        setPlans(scored);
      }

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
      <Link href="/plans">
        <Button variant="ghost" size="sm" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Plans
        </Button>
      </Link>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Suggested Plans</h1>
        </div>
        <p className="text-muted-foreground">
          Personalized recommendations based on your profile
        </p>
        {profile && (
          <div className="flex flex-wrap gap-2 mt-3">
            {profile.fitness_level && (
              <Badge variant="outline" className="capitalize">{profile.fitness_level}</Badge>
            )}
            {profile.goals?.map((g) => (
              <Badge key={g} variant="secondary">{g}</Badge>
            ))}
            {profile.training_frequency && (
              <Badge variant="outline">{profile.training_frequency}x/week</Badge>
            )}
          </div>
        )}
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6"><div className="h-24 bg-muted rounded" /></CardContent>
            </Card>
          ))}
        </div>
      ) : plans.length === 0 ? (
        <div className="text-center py-16">
          <Target className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No plans available</h3>
          <p className="text-muted-foreground">Complete your profile or run the seed SQL</p>
        </div>
      ) : (
        <div className="space-y-4">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link href={`/plans/${plan.id}`}>
                <Card className={`hover:border-primary/30 transition-colors cursor-pointer ${i === 0 ? "border-primary/30 bg-primary/5" : ""}`}>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {i === 0 && <Star className="h-4 w-4 text-primary fill-primary" />}
                          <h3 className="font-semibold">{plan.name}</h3>
                          <Badge variant="outline" className={difficultyColor(plan.difficulty)}>
                            {plan.difficulty}
                          </Badge>
                        </div>
                        {plan.description && (
                          <p className="text-sm text-muted-foreground mb-3">{plan.description}</p>
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
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-2xl font-bold text-primary">{plan.score}%</div>
                        <p className="text-xs text-muted-foreground">match</p>
                      </div>
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
