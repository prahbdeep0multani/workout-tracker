"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Dumbbell,
  ArrowRight,
  ArrowLeft,
  Loader2,
  User,
  Ruler,
  Target,
  Clock,
} from "lucide-react";
import { GOALS, EQUIPMENT_OPTIONS, FITNESS_LEVELS, DURATION_OPTIONS, GENDER_OPTIONS } from "@/lib/constants";
import type { FitnessLevel } from "@/types/database";
import { motion, AnimatePresence } from "framer-motion";

const STEPS = [
  { title: "Personal Info", description: "Tell us about yourself", icon: User },
  { title: "Body Stats", description: "Your current measurements", icon: Ruler },
  { title: "Fitness Goals", description: "What do you want to achieve?", icon: Target },
  { title: "Preferences", description: "Customize your experience", icon: Clock },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
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

  const updateField = (field: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleArrayField = (field: "goals" | "equipment", value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((v) => v !== value)
        : [...prev[field], value],
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      toast.error("You must be logged in");
      router.push("/login");
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        name: formData.name || null,
        age: formData.age ? parseInt(formData.age) : null,
        gender: formData.gender || null,
        height: formData.height ? parseFloat(formData.height) : null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        fitness_level: (formData.fitness_level as FitnessLevel) || null,
        goals: formData.goals,
        equipment: formData.equipment,
        training_frequency: formData.training_frequency ? parseInt(formData.training_frequency) : null,
        preferred_duration: formData.preferred_duration ? parseInt(formData.preferred_duration) : null,
        limitations: formData.limitations || null,
        onboarding_completed: true,
      })
      .eq("id", user.id);

    if (error) {
      toast.error("Failed to save profile: " + error.message);
      setLoading(false);
      return;
    }

    toast.success("Profile set up successfully!");
    router.push("/dashboard");
    router.refresh();
  };

  const canProceed = () => {
    switch (step) {
      case 0:
        return formData.name.trim().length > 0;
      case 1:
        return true; // Optional
      case 2:
        return formData.fitness_level !== "" && formData.goals.length > 0;
      case 3:
        return true; // Optional
      default:
        return true;
    }
  };

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center gap-2 mb-8">
          <Dumbbell className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold">FitTrack</span>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span>Step {step + 1} of {STEPS.length}</span>
            <span>{STEPS[step].title}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-xl">{STEPS[step].title}</CardTitle>
                <CardDescription>{STEPS[step].description}</CardDescription>
              </CardHeader>
              <CardContent>
                {step === 0 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        placeholder="Your name"
                        value={formData.name}
                        onChange={(e) => updateField("name", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="age">Age</Label>
                      <Input
                        id="age"
                        type="number"
                        placeholder="25"
                        min={13}
                        max={100}
                        value={formData.age}
                        onChange={(e) => updateField("age", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Gender</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {GENDER_OPTIONS.map((g) => (
                          <Button
                            key={g}
                            type="button"
                            variant={formData.gender === g ? "default" : "outline"}
                            size="sm"
                            onClick={() => updateField("gender", g)}
                          >
                            {g}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="height">Height (cm)</Label>
                      <Input
                        id="height"
                        type="number"
                        placeholder="175"
                        min={100}
                        max={250}
                        value={formData.height}
                        onChange={(e) => updateField("height", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="weight">Weight (kg)</Label>
                      <Input
                        id="weight"
                        type="number"
                        placeholder="70"
                        min={30}
                        max={300}
                        value={formData.weight}
                        onChange={(e) => updateField("weight", e.target.value)}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      These are optional and help us provide better recommendations.
                    </p>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label>Fitness Level *</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {FITNESS_LEVELS.map((level) => (
                          <Button
                            key={level}
                            type="button"
                            variant={formData.fitness_level === level ? "default" : "outline"}
                            size="sm"
                            onClick={() => updateField("fitness_level", level)}
                            className="capitalize"
                          >
                            {level}
                          </Button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Goals * (select one or more)</Label>
                      <div className="flex flex-wrap gap-2">
                        {GOALS.map((goal) => (
                          <Badge
                            key={goal}
                            variant={formData.goals.includes(goal) ? "default" : "outline"}
                            className={cn(
                              "cursor-pointer text-sm py-1.5 px-3",
                              formData.goals.includes(goal) && "bg-primary text-primary-foreground"
                            )}
                            onClick={() => toggleArrayField("goals", goal)}
                          >
                            {goal}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Available Equipment</Label>
                      <div className="flex flex-wrap gap-2">
                        {EQUIPMENT_OPTIONS.map((eq) => (
                          <Badge
                            key={eq}
                            variant={formData.equipment.includes(eq) ? "default" : "outline"}
                            className={cn(
                              "cursor-pointer text-sm py-1.5 px-3",
                              formData.equipment.includes(eq) && "bg-primary text-primary-foreground"
                            )}
                            onClick={() => toggleArrayField("equipment", eq)}
                          >
                            {eq}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Training Frequency (days/week)</Label>
                      <div className="grid grid-cols-7 gap-1">
                        {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                          <Button
                            key={d}
                            type="button"
                            variant={formData.training_frequency === String(d) ? "default" : "outline"}
                            size="sm"
                            onClick={() => updateField("training_frequency", String(d))}
                          >
                            {d}
                          </Button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Preferred Workout Duration</Label>
                      <div className="grid grid-cols-5 gap-2">
                        {DURATION_OPTIONS.map((d) => (
                          <Button
                            key={d}
                            type="button"
                            variant={formData.preferred_duration === String(d) ? "default" : "outline"}
                            size="sm"
                            onClick={() => updateField("preferred_duration", String(d))}
                          >
                            {d}m
                          </Button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="limitations">Injuries or Limitations</Label>
                      <Textarea
                        id="limitations"
                        placeholder="Any injuries or limitations we should know about?"
                        value={formData.limitations}
                        onChange={(e) => updateField("limitations", e.target.value)}
                        rows={3}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <Button
            variant="ghost"
            onClick={() => setStep((s) => s - 1)}
            disabled={step === 0}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          {step < STEPS.length - 1 ? (
            <Button onClick={() => setStep((s) => s + 1)} disabled={!canProceed()}>
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Complete Setup
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
