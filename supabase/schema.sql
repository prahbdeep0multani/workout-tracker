-- Workout Tracker Database Schema
-- Run this in the Supabase SQL editor to set up all tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===========================================
-- PROFILES
-- ===========================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  name TEXT,
  age INTEGER,
  gender TEXT,
  height NUMERIC, -- in cm
  weight NUMERIC, -- in kg
  profile_picture_url TEXT,
  fitness_level TEXT CHECK (fitness_level IN ('beginner', 'intermediate', 'advanced')),
  goals TEXT[] DEFAULT '{}',
  equipment TEXT[] DEFAULT '{}',
  training_frequency INTEGER, -- days per week
  limitations TEXT,
  preferred_duration INTEGER, -- minutes
  onboarding_completed BOOLEAN DEFAULT FALSE
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id) VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ===========================================
-- EXERCISES
-- ===========================================
CREATE TABLE exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  name TEXT NOT NULL,
  description TEXT,
  muscle_groups_primary TEXT[] DEFAULT '{}',
  muscle_groups_secondary TEXT[] DEFAULT '{}',
  equipment TEXT[] DEFAULT '{}',
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'beginner',
  instructions TEXT[] DEFAULT '{}',
  video_url TEXT,
  image_url TEXT,
  category TEXT,
  is_custom BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL
);

ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;

-- Everyone can view default exercises
CREATE POLICY "Anyone can view default exercises" ON exercises
  FOR SELECT USING (is_custom = FALSE);

-- Users can view their own custom exercises
CREATE POLICY "Users can view own custom exercises" ON exercises
  FOR SELECT USING (is_custom = TRUE AND created_by = auth.uid());

-- Users can create custom exercises
CREATE POLICY "Users can create custom exercises" ON exercises
  FOR INSERT WITH CHECK (is_custom = TRUE AND created_by = auth.uid());

-- Users can update their own custom exercises
CREATE POLICY "Users can update own custom exercises" ON exercises
  FOR UPDATE USING (is_custom = TRUE AND created_by = auth.uid());

-- Users can delete their own custom exercises
CREATE POLICY "Users can delete own custom exercises" ON exercises
  FOR DELETE USING (is_custom = TRUE AND created_by = auth.uid());

-- ===========================================
-- WORKOUTS
-- ===========================================
CREATE TABLE workouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  name TEXT NOT NULL,
  duration INTEGER, -- minutes
  notes TEXT,
  completed BOOLEAN DEFAULT FALSE
);

ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own workouts" ON workouts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own workouts" ON workouts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own workouts" ON workouts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own workouts" ON workouts
  FOR DELETE USING (auth.uid() = user_id);

-- ===========================================
-- WORKOUT EXERCISES
-- ===========================================
CREATE TABLE workout_exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workout_id UUID NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  "order" INTEGER NOT NULL DEFAULT 0,
  notes TEXT
);

ALTER TABLE workout_exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage workout exercises via workout" ON workout_exercises
  FOR ALL USING (
    EXISTS (SELECT 1 FROM workouts WHERE workouts.id = workout_exercises.workout_id AND workouts.user_id = auth.uid())
  );

-- ===========================================
-- SETS
-- ===========================================
CREATE TABLE sets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workout_exercise_id UUID NOT NULL REFERENCES workout_exercises(id) ON DELETE CASCADE,
  set_number INTEGER NOT NULL DEFAULT 1,
  reps INTEGER,
  weight NUMERIC,
  rest_seconds INTEGER,
  rpe INTEGER CHECK (rpe >= 1 AND rpe <= 10),
  completed BOOLEAN DEFAULT FALSE
);

ALTER TABLE sets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage sets via workout" ON sets
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM workout_exercises we
      JOIN workouts w ON w.id = we.workout_id
      WHERE we.id = sets.workout_exercise_id AND w.user_id = auth.uid()
    )
  );

-- ===========================================
-- PERSONAL RECORDS
-- ===========================================
CREATE TABLE personal_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  record_type TEXT CHECK (record_type IN ('max_weight', 'max_reps', 'max_volume')) NOT NULL,
  value NUMERIC NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  workout_id UUID REFERENCES workouts(id) ON DELETE SET NULL
);

ALTER TABLE personal_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own PRs" ON personal_records
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own PRs" ON personal_records
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own PRs" ON personal_records
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own PRs" ON personal_records
  FOR DELETE USING (auth.uid() = user_id);

-- ===========================================
-- BODY METRICS
-- ===========================================
CREATE TABLE body_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  weight NUMERIC,
  chest NUMERIC,
  waist NUMERIC,
  hips NUMERIC,
  arms NUMERIC,
  legs NUMERIC,
  photo_url TEXT
);

ALTER TABLE body_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own body metrics" ON body_metrics
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own body metrics" ON body_metrics
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own body metrics" ON body_metrics
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own body metrics" ON body_metrics
  FOR DELETE USING (auth.uid() = user_id);

-- ===========================================
-- WORKOUT TEMPLATES
-- ===========================================
CREATE TABLE workout_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE workout_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own templates" ON workout_templates
  FOR SELECT USING (auth.uid() = user_id OR is_public = TRUE OR user_id IS NULL);

CREATE POLICY "Users can create own templates" ON workout_templates
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own templates" ON workout_templates
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own templates" ON workout_templates
  FOR DELETE USING (auth.uid() = user_id);

-- ===========================================
-- TEMPLATE EXERCISES
-- ===========================================
CREATE TABLE template_exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  template_id UUID NOT NULL REFERENCES workout_templates(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  "order" INTEGER NOT NULL DEFAULT 0,
  target_sets INTEGER NOT NULL DEFAULT 3,
  target_reps INTEGER NOT NULL DEFAULT 10,
  target_weight NUMERIC,
  rest_seconds INTEGER
);

ALTER TABLE template_exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage template exercises via template" ON template_exercises
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM workout_templates wt
      WHERE wt.id = template_exercises.template_id
      AND (wt.user_id = auth.uid() OR wt.is_public = TRUE OR wt.user_id IS NULL)
    )
  );

-- ===========================================
-- WORKOUT PLANS
-- ===========================================
CREATE TABLE workout_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  duration_weeks INTEGER NOT NULL DEFAULT 4,
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')) NOT NULL,
  goal TEXT NOT NULL,
  frequency INTEGER NOT NULL, -- days per week
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  is_system_plan BOOLEAN DEFAULT FALSE,
  equipment_required TEXT[] DEFAULT '{}'
);

ALTER TABLE workout_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view system plans" ON workout_plans
  FOR SELECT USING (is_system_plan = TRUE);

CREATE POLICY "Users can view own plans" ON workout_plans
  FOR SELECT USING (created_by = auth.uid());

CREATE POLICY "Users can create plans" ON workout_plans
  FOR INSERT WITH CHECK (created_by = auth.uid());

-- ===========================================
-- PLAN WORKOUTS
-- ===========================================
CREATE TABLE plan_workouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plan_id UUID NOT NULL REFERENCES workout_plans(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL,
  workout_template_id UUID NOT NULL REFERENCES workout_templates(id) ON DELETE CASCADE,
  week_number INTEGER NOT NULL DEFAULT 1
);

ALTER TABLE plan_workouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view plan workouts for system plans" ON plan_workouts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM workout_plans wp
      WHERE wp.id = plan_workouts.plan_id
      AND (wp.is_system_plan = TRUE OR wp.created_by = auth.uid())
    )
  );

-- ===========================================
-- USER ACTIVE PLANS
-- ===========================================
CREATE TABLE user_active_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES workout_plans(id) ON DELETE CASCADE,
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  current_week INTEGER NOT NULL DEFAULT 1,
  current_day INTEGER NOT NULL DEFAULT 1,
  completed BOOLEAN DEFAULT FALSE
);

ALTER TABLE user_active_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own active plans" ON user_active_plans
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own active plans" ON user_active_plans
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own active plans" ON user_active_plans
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own active plans" ON user_active_plans
  FOR DELETE USING (auth.uid() = user_id);

-- ===========================================
-- INDEXES
-- ===========================================
CREATE INDEX idx_workouts_user_id ON workouts(user_id);
CREATE INDEX idx_workouts_date ON workouts(date);
CREATE INDEX idx_workout_exercises_workout_id ON workout_exercises(workout_id);
CREATE INDEX idx_sets_workout_exercise_id ON sets(workout_exercise_id);
CREATE INDEX idx_personal_records_user_id ON personal_records(user_id);
CREATE INDEX idx_personal_records_exercise_id ON personal_records(exercise_id);
CREATE INDEX idx_body_metrics_user_id ON body_metrics(user_id);
CREATE INDEX idx_body_metrics_date ON body_metrics(date);
CREATE INDEX idx_exercises_category ON exercises(category);
CREATE INDEX idx_exercises_difficulty ON exercises(difficulty);
