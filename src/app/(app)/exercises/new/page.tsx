"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ArrowLeft, Plus, Trash2, Loader2 } from "lucide-react";
import {
  EXERCISE_CATEGORIES,
  EQUIPMENT_OPTIONS,
  FITNESS_LEVELS,
  MUSCLE_GROUPS,
} from "@/lib/constants";
import type { FitnessLevel } from "@/types/database";

export default function NewExercisePage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState<FitnessLevel | "">("");
  const [primaryMuscles, setPrimaryMuscles] = useState<string[]>([]);
  const [secondaryMuscles, setSecondaryMuscles] = useState<string[]>([]);
  const [equipment, setEquipment] = useState<string[]>([]);
  const [instructions, setInstructions] = useState<string[]>([""]);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const toggleArray = (
    arr: string[],
    setArr: (v: string[]) => void,
    value: string
  ) => {
    setArr(
      arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]
    );
  };

  const updateInstruction = (index: number, value: string) => {
    setInstructions((prev) => prev.map((v, i) => (i === index ? value : v)));
  };

  const addInstruction = () => {
    setInstructions((prev) => [...prev, ""]);
  };

  const removeInstruction = (index: number) => {
    if (instructions.length <= 1) return;
    setInstructions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("Exercise name is required");
      return;
    }
    if (!category) {
      toast.error("Please select a category");
      return;
    }
    if (!difficulty) {
      toast.error("Please select a difficulty");
      return;
    }
    if (primaryMuscles.length === 0) {
      toast.error("Select at least one primary muscle group");
      return;
    }

    setSaving(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Not logged in");
      setSaving(false);
      return;
    }

    const { error } = await supabase.from("exercises").insert({
      name: name.trim(),
      description: description.trim() || null,
      category,
      difficulty,
      muscle_groups_primary: primaryMuscles,
      muscle_groups_secondary: secondaryMuscles,
      equipment,
      instructions: instructions.filter((i) => i.trim()),
      is_custom: true,
      created_by: user.id,
      video_url: null,
      image_url: null,
    });

    if (error) {
      toast.error("Failed to create exercise");
    } else {
      toast.success("Exercise created!");
      router.push("/exercises");
    }
    setSaving(false);
  };

  return (
    <div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.back()}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <h1 className="text-3xl font-bold tracking-tight mb-6">
        Create Custom Exercise
      </h1>

      <div className="max-w-2xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Basic Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Exercise Name *</Label>
              <Input
                placeholder="e.g., Single Arm Dumbbell Row"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Brief description of the exercise"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {EXERCISE_CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Difficulty *</Label>
                <Select
                  value={difficulty}
                  onValueChange={(v) => setDifficulty(v as FitnessLevel)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {FITNESS_LEVELS.map((l) => (
                      <SelectItem key={l} value={l} className="capitalize">
                        {l}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Muscle Groups</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Primary Muscles *</Label>
              <div className="flex flex-wrap gap-2">
                {MUSCLE_GROUPS.map((m) => (
                  <Badge
                    key={m}
                    variant={
                      primaryMuscles.includes(m) ? "default" : "outline"
                    }
                    className={cn(
                      "cursor-pointer py-1.5 px-3",
                      primaryMuscles.includes(m) &&
                        "bg-primary text-primary-foreground"
                    )}
                    onClick={() =>
                      toggleArray(primaryMuscles, setPrimaryMuscles, m)
                    }
                  >
                    {m}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Secondary Muscles</Label>
              <div className="flex flex-wrap gap-2">
                {MUSCLE_GROUPS.map((m) => (
                  <Badge
                    key={m}
                    variant={
                      secondaryMuscles.includes(m) ? "default" : "outline"
                    }
                    className={cn(
                      "cursor-pointer py-1.5 px-3",
                      secondaryMuscles.includes(m) &&
                        "bg-primary text-primary-foreground"
                    )}
                    onClick={() =>
                      toggleArray(secondaryMuscles, setSecondaryMuscles, m)
                    }
                  >
                    {m}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Equipment Required</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {EQUIPMENT_OPTIONS.map((eq) => (
                <Badge
                  key={eq}
                  variant={equipment.includes(eq) ? "default" : "outline"}
                  className={cn(
                    "cursor-pointer py-1.5 px-3",
                    equipment.includes(eq) &&
                      "bg-primary text-primary-foreground"
                  )}
                  onClick={() => toggleArray(equipment, setEquipment, eq)}
                >
                  {eq}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {instructions.map((instruction, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground w-6 text-center">
                  {i + 1}
                </span>
                <Input
                  placeholder={`Step ${i + 1}...`}
                  value={instruction}
                  onChange={(e) => updateInstruction(i, e.target.value)}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-muted-foreground hover:text-destructive"
                  onClick={() => removeInstruction(i)}
                  disabled={instructions.length <= 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={addInstruction}
              className="w-full"
            >
              <Plus className="mr-2 h-3.5 w-3.5" />
              Add Step
            </Button>
          </CardContent>
        </Card>

        <Button
          className="w-full"
          onClick={handleSubmit}
          disabled={saving}
        >
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Exercise
        </Button>
      </div>
    </div>
  );
}
