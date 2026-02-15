"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Trophy } from "lucide-react";
import type { PersonalRecord } from "@/types/database";
import { format } from "date-fns";
import { motion } from "framer-motion";

export default function PersonalRecordsPage() {
  const [records, setRecords] = useState<(PersonalRecord & { exercise_name?: string })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("personal_records")
        .select("*, exercise:exercises(name)")
        .eq("user_id", user.id)
        .order("date", { ascending: false });

      if (data) {
        setRecords(
          data.map((pr) => ({
            ...pr,
            exercise_name: (pr.exercise as unknown as { name: string })?.name,
          }))
        );
      }
      setLoading(false);
    };
    fetch();
  }, []);

  const typeLabel = (t: string) => {
    switch (t) {
      case "max_weight": return "Max Weight";
      case "max_reps": return "Max Reps";
      case "max_volume": return "Max Volume";
      default: return t;
    }
  };

  const typeUnit = (t: string) => {
    switch (t) {
      case "max_weight": return "kg";
      case "max_reps": return "reps";
      case "max_volume": return "kg";
      default: return "";
    }
  };

  return (
    <div>
      <Link href="/progress">
        <Button variant="ghost" size="sm" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </Link>

      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Personal Records</h1>
        <p className="text-muted-foreground mt-1">Your all-time bests</p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-5">
                <div className="h-5 bg-muted rounded w-1/3 mb-2" />
                <div className="h-4 bg-muted rounded w-1/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : records.length === 0 ? (
        <div className="text-center py-16">
          <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No personal records yet</h3>
          <p className="text-muted-foreground mb-6">
            Log workouts to automatically track your PRs
          </p>
          <Link href="/workouts/new">
            <Button>Log a Workout</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {records.map((pr, i) => (
            <motion.div
              key={pr.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                        <Trophy className="h-5 w-5 text-yellow-500" />
                      </div>
                      <div>
                        <p className="font-medium">{pr.exercise_name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Badge variant="secondary" className="text-xs">
                            {typeLabel(pr.record_type)}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(pr.date), "MMM d, yyyy")}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-primary">{pr.value}</span>
                      <span className="text-sm text-muted-foreground ml-1">{typeUnit(pr.record_type)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
