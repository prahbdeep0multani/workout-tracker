"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, Plus, Scale, Loader2, Camera, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import type { BodyMetric } from "@/types/database";
import { format } from "date-fns";
import Link from "next/link";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function BodyMetricsPage() {
  const [metrics, setMetrics] = useState<BodyMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    weight: "",
    chest: "",
    waist: "",
    hips: "",
    arms: "",
    legs: "",
  });

  const fetchMetrics = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("body_metrics")
      .select("*")
      .eq("user_id", user.id)
      .order("date", { ascending: true });
    setMetrics(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const handleSubmit = async () => {
    setSaving(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    let photoUrl: string | null = null;
    if (photoFile) {
      const fileExt = photoFile.name.split(".").pop();
      const filePath = `${user.id}/${form.date}-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("body-metrics")
        .upload(filePath, photoFile);
      if (uploadError) {
        toast.error("Failed to upload photo, saving metrics without it");
      } else {
        const { data: urlData } = supabase.storage
          .from("body-metrics")
          .getPublicUrl(filePath);
        photoUrl = urlData.publicUrl;
      }
    }

    const { error } = await supabase.from("body_metrics").insert({
      user_id: user.id,
      date: form.date,
      weight: form.weight ? parseFloat(form.weight) : null,
      chest: form.chest ? parseFloat(form.chest) : null,
      waist: form.waist ? parseFloat(form.waist) : null,
      hips: form.hips ? parseFloat(form.hips) : null,
      arms: form.arms ? parseFloat(form.arms) : null,
      legs: form.legs ? parseFloat(form.legs) : null,
      photo_url: photoUrl,
    });

    if (error) {
      toast.error("Failed to save metrics");
    } else {
      toast.success("Metrics logged!");
      setDialogOpen(false);
      setPhotoFile(null);
      setPhotoPreview(null);
      setForm({ date: new Date().toISOString().split("T")[0], weight: "", chest: "", waist: "", hips: "", arms: "", legs: "" });
      fetchMetrics();
    }
    setSaving(false);
  };

  const weightData = metrics
    .filter((m) => m.weight != null)
    .map((m) => ({
      date: format(new Date(m.date), "MMM d"),
      weight: m.weight,
    }));

  return (
    <div>
      <Link href="/progress">
        <Button variant="ghost" size="sm" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </Link>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Body Metrics</h1>
          <p className="text-muted-foreground mt-1">Track your weight and measurements</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Log Metrics
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Log Body Metrics</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Date</Label>
                <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Weight (kg)</Label>
                  <Input type="number" placeholder="70" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Chest (cm)</Label>
                  <Input type="number" placeholder="100" value={form.chest} onChange={(e) => setForm({ ...form, chest: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Waist (cm)</Label>
                  <Input type="number" placeholder="80" value={form.waist} onChange={(e) => setForm({ ...form, waist: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Hips (cm)</Label>
                  <Input type="number" placeholder="95" value={form.hips} onChange={(e) => setForm({ ...form, hips: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Arms (cm)</Label>
                  <Input type="number" placeholder="35" value={form.arms} onChange={(e) => setForm({ ...form, arms: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Legs (cm)</Label>
                  <Input type="number" placeholder="55" value={form.legs} onChange={(e) => setForm({ ...form, legs: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Progress Photo</Label>
                {photoPreview ? (
                  <div className="relative">
                    <img src={photoPreview} alt="Preview" className="w-full h-40 object-cover rounded-lg" />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => { setPhotoFile(null); setPhotoPreview(null); }}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                    <Camera className="h-8 w-8 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">Click to upload a photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setPhotoFile(file);
                          setPhotoPreview(URL.createObjectURL(file));
                        }
                      }}
                    />
                  </label>
                )}
              </div>
              <Button className="w-full" onClick={handleSubmit} disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Weight Chart */}
      {weightData.length > 1 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Scale className="h-4 w-4 text-primary" />
              Weight Over Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weightData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" fontSize={12} stroke="hsl(var(--muted-foreground))" />
                  <YAxis fontSize={12} stroke="hsl(var(--muted-foreground))" domain={["auto", "auto"]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      color: "hsl(var(--card-foreground))",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--primary))", r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* History */}
      <h2 className="text-lg font-semibold mb-3">History</h2>
      {metrics.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Scale className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No metrics logged yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {[...metrics].reverse().map((m) => (
            <Card key={m.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {m.photo_url && (
                      <img src={m.photo_url} alt="Progress" className="w-12 h-12 rounded-lg object-cover" />
                    )}
                    <span className="text-sm font-medium">{format(new Date(m.date), "MMM d, yyyy")}</span>
                  </div>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    {m.weight && <span>Weight: <strong className="text-foreground">{m.weight} kg</strong></span>}
                    {m.chest && <span>Chest: {m.chest}</span>}
                    {m.waist && <span>Waist: {m.waist}</span>}
                    {m.arms && <span>Arms: {m.arms}</span>}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
