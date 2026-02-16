-- ===========================================
-- ROW LEVEL SECURITY & TRIGGERS
-- ===========================================
-- Run this AFTER `prisma db push` to enable RLS and create triggers.
-- These features are not supported by Prisma and must be applied via SQL.

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===========================================
-- PROFILES
-- ===========================================
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
  INSERT INTO public.profiles (id) VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
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
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view default exercises" ON exercises
  FOR SELECT USING (is_custom = FALSE);

CREATE POLICY "Users can view own custom exercises" ON exercises
  FOR SELECT USING (is_custom = TRUE AND created_by = auth.uid());

CREATE POLICY "Users can create custom exercises" ON exercises
  FOR INSERT WITH CHECK (is_custom = TRUE AND created_by = auth.uid());

CREATE POLICY "Users can update own custom exercises" ON exercises
  FOR UPDATE USING (is_custom = TRUE AND created_by = auth.uid());

CREATE POLICY "Users can delete own custom exercises" ON exercises
  FOR DELETE USING (is_custom = TRUE AND created_by = auth.uid());

-- ===========================================
-- WORKOUTS
-- ===========================================
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
ALTER TABLE workout_exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage workout exercises via workout" ON workout_exercises
  FOR ALL USING (
    EXISTS (SELECT 1 FROM workouts WHERE workouts.id = workout_exercises.workout_id AND workouts.user_id = auth.uid())
  );

-- ===========================================
-- SETS
-- ===========================================
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
-- STORAGE BUCKET (for body metrics photos)
-- ===========================================
-- Run in Supabase Dashboard > Storage or via SQL:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('body-metrics', 'body-metrics', false);
