"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  User,
  Pencil,
  Loader2,
  Mail,
  Ruler,
  Target,
  Dumbbell,
  Calendar,
  Clock,
  LogOut,
} from "lucide-react";
import {
  GOALS,
  EQUIPMENT_OPTIONS,
  FITNESS_LEVELS,
  DURATION_OPTIONS,
  GENDER_OPTIONS,
} from "@/lib/constants";
import type { Profile, FitnessLevel } from "@/types/database";
import { format } from "date-fns";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    height: "",
    weight: "",
    fitness_level: "" as FitnessLevel | "",
    goals: [] as string[],
    equipment: [] as string[],
    training_frequency: "",
    preferred_duration: "",
    limitations: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setEmail(user.email || "");

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (data) {
        setProfile(data);
        setForm({
          name: data.name || "",
          age: data.age?.toString() || "",
          gender: data.gender || "",
          height: data.height?.toString() || "",
          weight: data.weight?.toString() || "",
          fitness_level: data.fitness_level || "",
          goals: data.goals || [],
          equipment: data.equipment || [],
          training_frequency: data.training_frequency?.toString() || "",
          preferred_duration: data.preferred_duration?.toString() || "",
          limitations: data.limitations || "",
        });
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const toggleArrayField = (field: "goals" | "equipment", value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((v) => v !== value)
        : [...prev[field], value],
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const updates = {
      name: form.name || null,
      age: form.age ? parseInt(form.age) : null,
      gender: form.gender || null,
      height: form.height ? parseFloat(form.height) : null,
      weight: form.weight ? parseFloat(form.weight) : null,
      fitness_level: (form.fitness_level as FitnessLevel) || null,
      goals: form.goals,
      equipment: form.equipment,
      training_frequency: form.training_frequency ? parseInt(form.training_frequency) : null,
      preferred_duration: form.preferred_duration ? parseInt(form.preferred_duration) : null,
      limitations: form.limitations || null,
    };

    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", user.id);

    if (error) {
      toast.error("Failed to update profile");
    } else {
      toast.success("Profile updated!");
      setProfile((prev) => prev ? { ...prev, ...updates } : null);
      setEditOpen(false);
    }
    setSaving(false);
  };

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 bg-muted rounded w-1/3 animate-pulse" />
        <div className="h-64 bg-muted rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground mt-1">Manage your account and fitness settings</p>
        </div>
        <Sheet open={editOpen} onOpenChange={setEditOpen}>
          <SheetTrigger asChild>
            <Button>
              <Pencil className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          </SheetTrigger>
          <SheetContent className="overflow-y-auto w-full sm:max-w-lg">
            <SheetHeader>
              <SheetTitle>Edit Profile</SheetTitle>
            </SheetHeader>
            <div className="space-y-6 m-6">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Personal Info</h3>
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Age</Label>
                    <Input type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} placeholder="25" />
                  </div>
                  <div className="space-y-2">
                    <Label>Gender</Label>
                    <div className="grid grid-cols-2 gap-1">
                      {GENDER_OPTIONS.map((g) => (
                        <Button key={g} type="button" variant={form.gender === g ? "default" : "outline"} size="sm" className="text-xs" onClick={() => setForm({ ...form, gender: g })}>
                          {g}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Height (cm)</Label>
                    <Input type="number" value={form.height} onChange={(e) => setForm({ ...form, height: e.target.value })} placeholder="175" />
                  </div>
                  <div className="space-y-2">
                    <Label>Weight (kg)</Label>
                    <Input type="number" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} placeholder="70" />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Fitness Info</h3>
                <div className="space-y-2">
                  <Label>Fitness Level</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {FITNESS_LEVELS.map((level) => (
                      <Button key={level} type="button" variant={form.fitness_level === level ? "default" : "outline"} size="sm" className="capitalize" onClick={() => setForm({ ...form, fitness_level: level })}>
                        {level}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Goals</Label>
                  <div className="flex flex-wrap gap-2">
                    {GOALS.map((goal) => (
                      <Badge key={goal} variant={form.goals.includes(goal) ? "default" : "outline"} className={cn("cursor-pointer text-sm py-1.5 px-3", form.goals.includes(goal) && "bg-primary text-primary-foreground")} onClick={() => toggleArrayField("goals", goal)}>
                        {goal}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Available Equipment</Label>
                  <div className="flex flex-wrap gap-2">
                    {EQUIPMENT_OPTIONS.map((eq) => (
                      <Badge key={eq} variant={form.equipment.includes(eq) ? "default" : "outline"} className={cn("cursor-pointer text-sm py-1.5 px-3", form.equipment.includes(eq) && "bg-primary text-primary-foreground")} onClick={() => toggleArrayField("equipment", eq)}>
                        {eq}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Preferences</h3>
                <div className="space-y-2">
                  <Label>Training Frequency (days/week)</Label>
                  <div className="grid grid-cols-7 gap-1">
                    {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                      <Button key={d} type="button" variant={form.training_frequency === String(d) ? "default" : "outline"} size="sm" onClick={() => setForm({ ...form, training_frequency: String(d) })}>
                        {d}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Preferred Duration (min)</Label>
                  <div className="grid grid-cols-5 gap-2">
                    {DURATION_OPTIONS.map((d) => (
                      <Button key={d} type="button" variant={form.preferred_duration === String(d) ? "default" : "outline"} size="sm" onClick={() => setForm({ ...form, preferred_duration: String(d) })}>
                        {d}m
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Injuries / Limitations</Label>
                  <Textarea value={form.limitations} onChange={(e) => setForm({ ...form, limitations: e.target.value })} placeholder="Any injuries or limitations?" rows={3} />
                </div>
              </div>

              <Button className="w-full" onClick={handleSave} disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <User className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-xl font-bold">{profile?.name || "No Name"}</h2>
              <p className="text-sm text-muted-foreground mt-1 flex items-center justify-center gap-1">
                <Mail className="h-3.5 w-3.5" />
                {email}
              </p>
              {profile?.fitness_level && (
                <Badge className="mt-3 capitalize">{profile.fitness_level}</Badge>
              )}
              <p className="text-xs text-muted-foreground mt-3">
                Member since {profile?.created_at ? format(new Date(profile.created_at), "MMM yyyy") : "N/A"}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <div className="lg:col-span-2 space-y-4">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Ruler className="h-4 w-4 text-primary" />
                  Body Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Age</p>
                    <p className="text-lg font-semibold">{profile?.age || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Gender</p>
                    <p className="text-lg font-semibold">{profile?.gender || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Height</p>
                    <p className="text-lg font-semibold">{profile?.height ? `${profile.height} cm` : "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Weight</p>
                    <p className="text-lg font-semibold">{profile?.weight ? `${profile.weight} kg` : "—"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" />
                  Fitness Goals
                </CardTitle>
              </CardHeader>
              <CardContent>
                {profile?.goals && profile.goals.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.goals.map((goal) => (
                      <Badge key={goal} variant="secondary">{goal}</Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No goals set</p>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Dumbbell className="h-4 w-4 text-primary" />
                  Equipment & Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Available Equipment</p>
                  {profile?.equipment && profile.equipment.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {profile.equipment.map((eq) => (
                        <Badge key={eq} variant="outline">{eq}</Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">None set</p>
                  )}
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Training Frequency</p>
                      <p className="text-sm font-medium">{profile?.training_frequency ? `${profile.training_frequency} days/week` : "—"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Preferred Duration</p>
                      <p className="text-sm font-medium">{profile?.preferred_duration ? `${profile.preferred_duration} min` : "—"}</p>
                    </div>
                  </div>
                </div>
                {profile?.limitations && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Limitations</p>
                      <p className="text-sm">{profile.limitations}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <div className="lg:hidden">
            <Button variant="outline" className="w-full" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
