export type FitnessLevel = "beginner" | "intermediate" | "advanced";
export type RecordType = "max_weight" | "max_reps" | "max_volume";

export interface Profile {
  id: string;
  created_at: string;
  updated_at: string;
  name: string | null;
  age: number | null;
  gender: string | null;
  height: number | null;
  weight: number | null;
  profile_picture_url: string | null;
  fitness_level: FitnessLevel | null;
  goals: string[] | null;
  equipment: string[] | null;
  training_frequency: number | null;
  limitations: string | null;
  preferred_duration: number | null;
  onboarding_completed: boolean;
}

export interface Exercise {
  id: string;
  created_at: string;
  name: string;
  description: string | null;
  muscle_groups_primary: string[];
  muscle_groups_secondary: string[];
  equipment: string[];
  difficulty: FitnessLevel;
  instructions: string[];
  video_url: string | null;
  image_url: string | null;
  category: string;
  is_custom: boolean;
  created_by: string | null;
}

export interface Workout {
  id: string;
  created_at: string;
  user_id: string;
  date: string;
  name: string;
  duration: number | null;
  notes: string | null;
  completed: boolean;
}

export interface WorkoutExercise {
  id: string;
  workout_id: string;
  exercise_id: string;
  order: number;
  notes: string | null;
  exercise?: Exercise;
  sets?: ExerciseSet[];
}

export interface ExerciseSet {
  id: string;
  workout_exercise_id: string;
  set_number: number;
  reps: number | null;
  weight: number | null;
  rest_seconds: number | null;
  rpe: number | null;
  completed: boolean;
}

export interface PersonalRecord {
  id: string;
  user_id: string;
  exercise_id: string;
  record_type: RecordType;
  value: number;
  date: string;
  workout_id: string | null;
  exercise?: Exercise;
}

export interface BodyMetric {
  id: string;
  user_id: string;
  date: string;
  weight: number | null;
  chest: number | null;
  waist: number | null;
  hips: number | null;
  arms: number | null;
  legs: number | null;
  photo_url: string | null;
}

export interface WorkoutTemplate {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  is_public: boolean;
  created_at: string;
  template_exercises?: TemplateExercise[];
}

export interface TemplateExercise {
  id: string;
  template_id: string;
  exercise_id: string;
  order: number;
  target_sets: number;
  target_reps: number;
  target_weight: number | null;
  rest_seconds: number | null;
  exercise?: Exercise;
}

export interface WorkoutPlan {
  id: string;
  name: string;
  description: string | null;
  duration_weeks: number;
  difficulty: FitnessLevel;
  goal: string;
  frequency: number;
  created_by: string | null;
  is_system_plan: boolean;
  equipment_required: string[];
  plan_workouts?: PlanWorkout[];
}

export interface PlanWorkout {
  id: string;
  plan_id: string;
  day_number: number;
  workout_template_id: string;
  week_number: number;
  workout_template?: WorkoutTemplate;
}

export interface UserActivePlan {
  id: string;
  user_id: string;
  plan_id: string;
  start_date: string;
  current_week: number;
  current_day: number;
  completed: boolean;
  plan?: WorkoutPlan;
}

// Supabase Database type for client typing
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Partial<Profile> & { id: string };
        Update: Partial<Profile>;
      };
      exercises: {
        Row: Exercise;
        Insert: Omit<Exercise, "id" | "created_at">;
        Update: Partial<Exercise>;
      };
      workouts: {
        Row: Workout;
        Insert: Omit<Workout, "id" | "created_at">;
        Update: Partial<Workout>;
      };
      workout_exercises: {
        Row: WorkoutExercise;
        Insert: Omit<WorkoutExercise, "id">;
        Update: Partial<WorkoutExercise>;
      };
      sets: {
        Row: ExerciseSet;
        Insert: Omit<ExerciseSet, "id">;
        Update: Partial<ExerciseSet>;
      };
      personal_records: {
        Row: PersonalRecord;
        Insert: Omit<PersonalRecord, "id">;
        Update: Partial<PersonalRecord>;
      };
      body_metrics: {
        Row: BodyMetric;
        Insert: Omit<BodyMetric, "id">;
        Update: Partial<BodyMetric>;
      };
      workout_templates: {
        Row: WorkoutTemplate;
        Insert: Omit<WorkoutTemplate, "id" | "created_at">;
        Update: Partial<WorkoutTemplate>;
      };
      template_exercises: {
        Row: TemplateExercise;
        Insert: Omit<TemplateExercise, "id">;
        Update: Partial<TemplateExercise>;
      };
      workout_plans: {
        Row: WorkoutPlan;
        Insert: Omit<WorkoutPlan, "id">;
        Update: Partial<WorkoutPlan>;
      };
      plan_workouts: {
        Row: PlanWorkout;
        Insert: Omit<PlanWorkout, "id">;
        Update: Partial<PlanWorkout>;
      };
      user_active_plans: {
        Row: UserActivePlan;
        Insert: Omit<UserActivePlan, "id">;
        Update: Partial<UserActivePlan>;
      };
    };
  };
}
