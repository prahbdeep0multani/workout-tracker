-- ===========================================
-- SEED DATA FOR WORKOUT TRACKER
-- ===========================================
-- Run this AFTER schema.sql

-- Enable UUID extension (idempotent)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===========================================
-- EXERCISES
-- ===========================================

-- ---- UPPER BODY: CHEST ----

INSERT INTO exercises (id, name, description, muscle_groups_primary, muscle_groups_secondary, equipment, difficulty, instructions, category, is_custom, created_by) VALUES
(uuid_generate_v4(),
 'Bench Press',
 'A classic compound chest exercise performed lying on a flat bench using a barbell.',
 ARRAY['Chest'],
 ARRAY['Triceps', 'Front Deltoids'],
 ARRAY['Barbell', 'Bench'],
 'intermediate',
 ARRAY[
   'Lie flat on a bench, grip the barbell slightly wider than shoulder-width with an overhand grip.',
   'Unrack the bar and hold it directly above your chest with arms fully extended.',
   'Lower the bar slowly to your mid-chest, keeping elbows at roughly a 45-degree angle from your torso.',
   'Press the bar back up explosively until arms are fully extended. Repeat for desired reps.'
 ],
 'Upper Body',
 FALSE,
 NULL),

(uuid_generate_v4(),
 'Incline Dumbbell Press',
 'A chest press variation performed on an incline bench using dumbbells, targeting the upper chest.',
 ARRAY['Upper Chest'],
 ARRAY['Triceps', 'Front Deltoids'],
 ARRAY['Dumbbells', 'Incline Bench'],
 'intermediate',
 ARRAY[
   'Set a bench to a 30-45 degree incline. Sit with a dumbbell in each hand resting on your thighs.',
   'Kick the dumbbells up as you lie back, holding them at chest level with palms facing forward.',
   'Press the dumbbells up and together until your arms are nearly fully extended above your upper chest.',
   'Lower them slowly back to chest level with control and repeat.'
 ],
 'Upper Body',
 FALSE,
 NULL),

(uuid_generate_v4(),
 'Push-Up',
 'A fundamental bodyweight exercise that targets the chest, shoulders, and triceps.',
 ARRAY['Chest'],
 ARRAY['Triceps', 'Front Deltoids', 'Core'],
 ARRAY['Bodyweight'],
 'beginner',
 ARRAY[
   'Start in a high plank position with hands placed slightly wider than shoulder-width, body forming a straight line.',
   'Brace your core and keep your body rigid throughout the movement.',
   'Lower your chest to the floor by bending your elbows at roughly 45 degrees from your torso.',
   'Push through your palms to extend your arms and return to the starting position.'
 ],
 'Upper Body',
 FALSE,
 NULL),

(uuid_generate_v4(),
 'Cable Fly',
 'An isolation chest exercise using a cable machine to create constant tension throughout the movement.',
 ARRAY['Chest'],
 ARRAY['Front Deltoids', 'Biceps'],
 ARRAY['Cable Machine'],
 'intermediate',
 ARRAY[
   'Set the cable pulleys to chest height. Stand in the center with a staggered stance and grip a handle in each hand.',
   'Start with arms extended out to your sides with a slight bend in the elbows.',
   'Bring both hands together in front of your chest in a wide hugging arc, squeezing your chest at the peak.',
   'Slowly return to the starting position under control, feeling the stretch in your chest.'
 ],
 'Upper Body',
 FALSE,
 NULL),

-- ---- UPPER BODY: BACK ----

(uuid_generate_v4(),
 'Pull-Up',
 'A compound bodyweight exercise that builds upper body and back strength by pulling your body up to a bar.',
 ARRAY['Lats', 'Upper Back'],
 ARRAY['Biceps', 'Rear Deltoids', 'Core'],
 ARRAY['Pull-Up Bar'],
 'intermediate',
 ARRAY[
   'Hang from a pull-up bar with an overhand grip slightly wider than shoulder-width, arms fully extended.',
   'Engage your lats and core, then pull your chest toward the bar by driving your elbows down and back.',
   'Continue pulling until your chin clears the bar or your chest touches it.',
   'Lower yourself slowly back to the starting position with full arm extension before the next rep.'
 ],
 'Upper Body',
 FALSE,
 NULL),

(uuid_generate_v4(),
 'Barbell Row',
 'A foundational compound back exercise performed by rowing a barbell toward the lower chest while hinged at the hips.',
 ARRAY['Lats', 'Middle Back', 'Rhomboids'],
 ARRAY['Biceps', 'Rear Deltoids', 'Erector Spinae'],
 ARRAY['Barbell'],
 'intermediate',
 ARRAY[
   'Stand with feet shoulder-width apart, hinge forward at the hips to about 45 degrees, and grasp the barbell with an overhand grip.',
   'Let the bar hang at arm''s length with your back flat and chest up.',
   'Pull the bar toward your lower chest/upper abdomen, driving your elbows back and squeezing your shoulder blades together.',
   'Lower the bar back to the starting position with control and repeat.'
 ],
 'Upper Body',
 FALSE,
 NULL),

(uuid_generate_v4(),
 'Dumbbell Row',
 'A unilateral back exercise performed with a single dumbbell, allowing for a full range of motion.',
 ARRAY['Lats', 'Middle Back'],
 ARRAY['Biceps', 'Rear Deltoids'],
 ARRAY['Dumbbells', 'Bench'],
 'beginner',
 ARRAY[
   'Place one hand and the same-side knee on a flat bench for support. Hold a dumbbell in the opposite hand with arm fully extended.',
   'Keep your back flat and parallel to the floor, core braced.',
   'Pull the dumbbell up toward your hip, driving your elbow back past your torso.',
   'Lower the dumbbell back to the start under control. Complete all reps on one side before switching.'
 ],
 'Upper Body',
 FALSE,
 NULL),

(uuid_generate_v4(),
 'Lat Pulldown',
 'A cable machine exercise that mimics the pull-up motion, great for building lat width.',
 ARRAY['Lats'],
 ARRAY['Biceps', 'Rear Deltoids', 'Rhomboids'],
 ARRAY['Cable Machine', 'Lat Pulldown Bar'],
 'beginner',
 ARRAY[
   'Sit at a lat pulldown station, adjust the thigh pads to secure your legs, and grip the bar wider than shoulder-width with an overhand grip.',
   'Lean back slightly and look up toward the bar.',
   'Pull the bar down toward your upper chest, driving your elbows down and back while squeezing your lats.',
   'Slowly return the bar to the top position, allowing your arms to fully extend and your lats to stretch.'
 ],
 'Upper Body',
 FALSE,
 NULL),

(uuid_generate_v4(),
 'Face Pull',
 'A cable exercise targeting the rear deltoids and upper back, excellent for shoulder health and posture.',
 ARRAY['Rear Deltoids', 'Rhomboids', 'Middle Trapezius'],
 ARRAY['Rotator Cuff', 'Upper Trapezius'],
 ARRAY['Cable Machine', 'Rope Attachment'],
 'beginner',
 ARRAY[
   'Set a cable pulley to forehead height and attach a rope handle. Grasp the rope with both hands, palms facing inward.',
   'Step back to create tension and stand with feet shoulder-width apart.',
   'Pull the rope toward your face, separating the ends of the rope and pulling your elbows back and out to the sides.',
   'Hold the peak contraction briefly, squeezing your rear deltoids, then return to start with control.'
 ],
 'Upper Body',
 FALSE,
 NULL),

-- ---- UPPER BODY: SHOULDERS ----

(uuid_generate_v4(),
 'Overhead Press',
 'A fundamental compound shoulder exercise pressing a barbell from shoulder height to overhead.',
 ARRAY['Front Deltoids', 'Lateral Deltoids'],
 ARRAY['Triceps', 'Upper Trapezius', 'Core'],
 ARRAY['Barbell'],
 'intermediate',
 ARRAY[
   'Stand with feet shoulder-width apart and grip the barbell just outside shoulder-width at collarbone height.',
   'Brace your core and glutes to maintain a neutral spine.',
   'Press the bar directly overhead until your arms are fully locked out, moving your head slightly back to allow the bar to pass.',
   'Lower the bar under control back to the starting position at your collarbone and repeat.'
 ],
 'Upper Body',
 FALSE,
 NULL),

(uuid_generate_v4(),
 'Dumbbell Lateral Raise',
 'An isolation exercise targeting the lateral deltoids to build shoulder width.',
 ARRAY['Lateral Deltoids'],
 ARRAY['Front Deltoids', 'Upper Trapezius'],
 ARRAY['Dumbbells'],
 'beginner',
 ARRAY[
   'Stand upright holding a dumbbell in each hand at your sides with a slight bend in the elbows, palms facing inward.',
   'Keeping a slight forward lean and the bend in your elbows, raise both arms out to the sides.',
   'Lift until your arms are parallel to the floor (shoulder height), leading with your elbows.',
   'Lower the dumbbells back to your sides slowly and with control. Avoid shrugging your traps.'
 ],
 'Upper Body',
 FALSE,
 NULL),

(uuid_generate_v4(),
 'Arnold Press',
 'A dumbbell shoulder press variation that incorporates a rotation, targeting all three heads of the deltoid.',
 ARRAY['Front Deltoids', 'Lateral Deltoids', 'Rear Deltoids'],
 ARRAY['Triceps', 'Upper Trapezius'],
 ARRAY['Dumbbells', 'Bench'],
 'intermediate',
 ARRAY[
   'Sit on a bench holding dumbbells at shoulder height with palms facing toward you, elbows bent.',
   'As you press the dumbbells upward, rotate your palms outward so that at the top your palms face away from you.',
   'Press until arms are fully extended overhead.',
   'Reverse the rotation as you lower the dumbbells back to the starting position, ending with palms facing you.'
 ],
 'Upper Body',
 FALSE,
 NULL),

(uuid_generate_v4(),
 'Front Raise',
 'An isolation exercise that targets the front (anterior) deltoid by raising a weight in front of the body.',
 ARRAY['Front Deltoids'],
 ARRAY['Lateral Deltoids', 'Upper Trapezius'],
 ARRAY['Dumbbells', 'Barbell', 'Plate'],
 'beginner',
 ARRAY[
   'Stand with feet shoulder-width apart holding dumbbells in front of your thighs, palms facing back.',
   'With a slight bend in the elbows, raise one or both arms forward to shoulder height.',
   'Pause briefly at the top, keeping your core tight and avoiding leaning back.',
   'Lower the weight(s) back to the starting position under control.'
 ],
 'Upper Body',
 FALSE,
 NULL),

-- ---- UPPER BODY: ARMS ----

(uuid_generate_v4(),
 'Barbell Curl',
 'A classic bicep exercise using a barbell for building arm size and strength.',
 ARRAY['Biceps'],
 ARRAY['Brachialis', 'Brachioradialis', 'Forearms'],
 ARRAY['Barbell'],
 'beginner',
 ARRAY[
   'Stand holding a barbell with an underhand (supinated) grip, hands shoulder-width apart, arms fully extended.',
   'Keep your elbows pinned to your sides and your upper arms stationary throughout the lift.',
   'Curl the bar upward toward your shoulders by contracting your biceps, stopping just before your forearms are vertical.',
   'Squeeze at the top, then lower the bar slowly back to full extension.'
 ],
 'Upper Body',
 FALSE,
 NULL),

(uuid_generate_v4(),
 'Dumbbell Hammer Curl',
 'A bicep curl variation with a neutral grip that also develops the brachialis and brachioradialis.',
 ARRAY['Biceps', 'Brachialis'],
 ARRAY['Brachioradialis', 'Forearms'],
 ARRAY['Dumbbells'],
 'beginner',
 ARRAY[
   'Stand holding a dumbbell in each hand at your sides with a neutral grip (palms facing each other), arms fully extended.',
   'Keep your elbows close to your sides and upper arms stationary.',
   'Curl both dumbbells upward simultaneously, maintaining the neutral grip throughout (no wrist rotation).',
   'Squeeze at the top of the movement, then lower slowly back to the start.'
 ],
 'Upper Body',
 FALSE,
 NULL),

(uuid_generate_v4(),
 'Tricep Pushdown',
 'A cable isolation exercise for the triceps, performed by pushing a bar or rope downward.',
 ARRAY['Triceps'],
 ARRAY['Forearms'],
 ARRAY['Cable Machine', 'Bar Attachment', 'Rope Attachment'],
 'beginner',
 ARRAY[
   'Stand at a cable machine with a bar or rope attachment set at a high position. Grip the attachment with an overhand grip, elbows bent to 90 degrees and pinned to your sides.',
   'Keep your upper arms stationary and brace your core.',
   'Push the attachment downward by extending your elbows until your arms are fully straight.',
   'Squeeze your triceps at the bottom, then allow the weight to rise back up slowly under control.'
 ],
 'Upper Body',
 FALSE,
 NULL),

(uuid_generate_v4(),
 'Skull Crusher',
 'A lying tricep extension using a barbell or EZ-bar, excellent for adding mass to the triceps.',
 ARRAY['Triceps'],
 ARRAY['Forearms'],
 ARRAY['Barbell', 'EZ-Bar', 'Bench'],
 'intermediate',
 ARRAY[
   'Lie on a flat bench and hold a barbell or EZ-bar with an overhand grip, arms fully extended above your chest.',
   'Without moving your upper arms, slowly bend your elbows and lower the bar toward your forehead or just above it.',
   'Stop just before the bar touches your forehead, keeping the weight under full control.',
   'Extend your elbows to press the bar back to the starting position, squeezing your triceps at the top.'
 ],
 'Upper Body',
 FALSE,
 NULL),

(uuid_generate_v4(),
 'Concentration Curl',
 'A seated isolation curl that maximizes the bicep peak contraction by bracing the arm against the thigh.',
 ARRAY['Biceps'],
 ARRAY['Brachialis'],
 ARRAY['Dumbbells', 'Bench'],
 'beginner',
 ARRAY[
   'Sit on a bench with legs spread. Hold a dumbbell in one hand and brace the back of your upper arm against the inside of your thigh.',
   'Let the arm hang straight down with the dumbbell just above the floor.',
   'Curl the dumbbell upward toward your shoulder, keeping your upper arm pinned against your thigh throughout.',
   'Squeeze hard at the top, then lower slowly back to the starting position.'
 ],
 'Upper Body',
 FALSE,
 NULL),

(uuid_generate_v4(),
 'Dips',
 'A compound bodyweight exercise performed on parallel bars, heavily targeting the triceps and lower chest.',
 ARRAY['Triceps', 'Lower Chest'],
 ARRAY['Front Deltoids', 'Core'],
 ARRAY['Parallel Bars', 'Dip Station'],
 'intermediate',
 ARRAY[
   'Grip the parallel bars and hold yourself up with arms fully extended, feet crossed behind you.',
   'Lean slightly forward to engage the chest more, or stay upright to emphasize triceps.',
   'Lower your body by bending your elbows until your upper arms are at least parallel to the floor.',
   'Push back up through your palms to fully extend your elbows and return to the starting position.'
 ],
 'Upper Body',
 FALSE,
 NULL),

(uuid_generate_v4(),
 'Preacher Curl',
 'A strict bicep curl performed on a preacher bench, which eliminates cheating by stabilizing the upper arms.',
 ARRAY['Biceps'],
 ARRAY['Brachialis', 'Brachioradialis'],
 ARRAY['Barbell', 'EZ-Bar', 'Preacher Bench'],
 'intermediate',
 ARRAY[
   'Sit at a preacher bench and rest the back of your upper arms against the padded surface. Hold the barbell or EZ-bar with an underhand grip.',
   'Start with arms nearly fully extended at the bottom of the pad.',
   'Curl the bar upward in a smooth arc until your forearms are vertical and your biceps are fully contracted.',
   'Slowly lower the bar back to the starting position, resisting the weight on the way down.'
 ],
 'Upper Body',
 FALSE,
 NULL),

-- ---- LOWER BODY: QUADS ----

(uuid_generate_v4(),
 'Squat',
 'The king of lower body exercises, a barbell back squat that builds total leg and core strength.',
 ARRAY['Quadriceps', 'Glutes'],
 ARRAY['Hamstrings', 'Calves', 'Core', 'Erector Spinae'],
 ARRAY['Barbell', 'Squat Rack'],
 'intermediate',
 ARRAY[
   'Position the barbell across your upper traps (high bar) or rear deltoids (low bar). Step back and stand with feet shoulder-width apart, toes turned slightly out.',
   'Take a deep breath, brace your core hard, and begin the descent by pushing your knees out and hinging slightly at the hips.',
   'Lower until your thighs are at least parallel to the floor, keeping your chest up and back neutral.',
   'Drive through your heels to stand back up, pushing your knees out and maintaining a neutral spine throughout.'
 ],
 'Lower Body',
 FALSE,
 NULL),

(uuid_generate_v4(),
 'Leg Press',
 'A machine-based compound exercise for the lower body, allowing heavy loading with reduced spinal stress.',
 ARRAY['Quadriceps', 'Glutes'],
 ARRAY['Hamstrings', 'Calves'],
 ARRAY['Leg Press Machine'],
 'beginner',
 ARRAY[
   'Sit in the leg press machine, place your feet shoulder-width apart on the platform, and release the safety handles.',
   'Bend your knees and lower the platform toward your chest until your knees form roughly a 90-degree angle.',
   'Press through your heels to fully extend your legs without locking out your knees at the top.',
   'Control the descent back to the starting position and repeat.'
 ],
 'Lower Body',
 FALSE,
 NULL),

(uuid_generate_v4(),
 'Leg Extension',
 'An isolation machine exercise that targets the quadriceps through knee extension.',
 ARRAY['Quadriceps'],
 ARRAY[],
 ARRAY['Leg Extension Machine'],
 'beginner',
 ARRAY[
   'Sit in the leg extension machine, adjust the pad to rest on your shins just above your ankles, and grip the handles.',
   'Starting with knees bent at 90 degrees, extend your legs upward by contracting your quads.',
   'Fully extend until your legs are straight and hold briefly at the top, squeezing the quads.',
   'Lower the weight slowly back to the starting position, maintaining full control.'
 ],
 'Lower Body',
 FALSE,
 NULL),

(uuid_generate_v4(),
 'Bulgarian Split Squat',
 'A demanding unilateral lower body exercise with the rear foot elevated on a bench.',
 ARRAY['Quadriceps', 'Glutes'],
 ARRAY['Hamstrings', 'Calves', 'Core'],
 ARRAY['Dumbbells', 'Bench'],
 'intermediate',
 ARRAY[
   'Stand a few feet in front of a bench and place the top of one foot on the bench behind you.',
   'Hold a dumbbell in each hand and stand upright with your front foot far enough forward that your knee won''t travel past your toes at the bottom.',
   'Lower your rear knee toward the floor by bending both knees, keeping your torso upright.',
   'Drive through the heel of your front foot to stand back up. Complete all reps before switching legs.'
 ],
 'Lower Body',
 FALSE,
 NULL),

-- ---- LOWER BODY: HAMSTRINGS ----

(uuid_generate_v4(),
 'Romanian Deadlift',
 'A hip-hinge movement that heavily loads the hamstrings and glutes through a large range of motion.',
 ARRAY['Hamstrings', 'Glutes'],
 ARRAY['Erector Spinae', 'Calves', 'Forearms'],
 ARRAY['Barbell', 'Dumbbells'],
 'intermediate',
 ARRAY[
   'Stand with feet hip-width apart, holding a barbell or dumbbells in front of your thighs with an overhand grip.',
   'Hinge at the hips, pushing them back while keeping your back flat and knees slightly bent.',
   'Lower the weight along your legs until you feel a deep stretch in your hamstrings, typically just below the knees.',
   'Drive your hips forward to return to standing, squeezing your glutes at the top.'
 ],
 'Lower Body',
 FALSE,
 NULL),

(uuid_generate_v4(),
 'Leg Curl',
 'A machine isolation exercise that targets the hamstrings through knee flexion.',
 ARRAY['Hamstrings'],
 ARRAY['Calves'],
 ARRAY['Leg Curl Machine'],
 'beginner',
 ARRAY[
   'Lie face down on the leg curl machine, position the pad just above your ankles, and grip the handles.',
   'Starting with legs nearly straight, curl your legs upward by contracting your hamstrings.',
   'Pull the pad as close to your glutes as possible and hold briefly at the top.',
   'Slowly lower the weight back to the starting position, resisting the weight the entire way.'
 ],
 'Lower Body',
 FALSE,
 NULL),

(uuid_generate_v4(),
 'Good Morning',
 'A barbell exercise that strengthens the hamstrings, glutes, and erector spinae through a hip hinge.',
 ARRAY['Hamstrings', 'Erector Spinae'],
 ARRAY['Glutes', 'Core'],
 ARRAY['Barbell', 'Squat Rack'],
 'intermediate',
 ARRAY[
   'Position a barbell across your upper traps as you would for a back squat. Stand with feet shoulder-width apart.',
   'With a slight bend in your knees and a braced, flat back, hinge forward at the hips.',
   'Lower your torso until it is nearly parallel to the floor, or until you feel a strong hamstring stretch.',
   'Drive your hips forward and return to an upright position, squeezing your glutes at the top.'
 ],
 'Lower Body',
 FALSE,
 NULL),

-- ---- LOWER BODY: GLUTES ----

(uuid_generate_v4(),
 'Hip Thrust',
 'A highly effective glute isolation exercise performed by thrusting the hips upward with a barbell across the lap.',
 ARRAY['Glutes'],
 ARRAY['Hamstrings', 'Core', 'Hip Flexors'],
 ARRAY['Barbell', 'Bench'],
 'intermediate',
 ARRAY[
   'Sit on the floor with your upper back against a bench, a barbell across your hips. Bend your knees with feet flat on the floor.',
   'Brace your core and drive your feet into the floor to thrust your hips upward.',
   'Rise until your body forms a straight line from shoulders to knees, squeezing your glutes hard at the top.',
   'Lower your hips back toward the floor under control and repeat without letting your hips fully touch the ground.'
 ],
 'Lower Body',
 FALSE,
 NULL),

(uuid_generate_v4(),
 'Glute Bridge',
 'A beginner-friendly glute activation exercise performed lying on your back.',
 ARRAY['Glutes'],
 ARRAY['Hamstrings', 'Core'],
 ARRAY['Bodyweight', 'Dumbbells'],
 'beginner',
 ARRAY[
   'Lie on your back with knees bent and feet flat on the floor, hip-width apart, arms at your sides.',
   'Press through your heels and squeeze your glutes to drive your hips up toward the ceiling.',
   'Rise until your body forms a straight line from your shoulders to your knees.',
   'Hold briefly at the top, then lower your hips back to the floor and repeat.'
 ],
 'Lower Body',
 FALSE,
 NULL),

-- ---- LOWER BODY: CALVES ----

(uuid_generate_v4(),
 'Standing Calf Raise',
 'An isolation exercise for the gastrocnemius muscle performed by rising onto the balls of your feet.',
 ARRAY['Calves', 'Gastrocnemius'],
 ARRAY['Soleus'],
 ARRAY['Calf Raise Machine', 'Dumbbells', 'Bodyweight'],
 'beginner',
 ARRAY[
   'Stand with the balls of your feet on the edge of a step or calf raise platform, heels hanging off the edge.',
   'Hold onto a support for balance if needed.',
   'Rise up onto your tiptoes as high as possible, squeezing your calves hard at the top.',
   'Slowly lower your heels below the level of the platform to stretch the calves, then repeat.'
 ],
 'Lower Body',
 FALSE,
 NULL),

(uuid_generate_v4(),
 'Seated Calf Raise',
 'A calf exercise performed seated that targets the soleus muscle beneath the gastrocnemius.',
 ARRAY['Calves', 'Soleus'],
 ARRAY['Gastrocnemius'],
 ARRAY['Seated Calf Raise Machine', 'Dumbbells', 'Bench'],
 'beginner',
 ARRAY[
   'Sit at a seated calf raise machine (or on a bench with a barbell across your lower thighs). Place the balls of your feet on the foot platform.',
   'Start with heels lowered as far as possible to achieve a full stretch.',
   'Push through the balls of your feet to raise your heels as high as possible, squeezing the calves at the top.',
   'Slowly lower back to the starting position for a full stretch and repeat.'
 ],
 'Lower Body',
 FALSE,
 NULL),

-- ---- CORE ----

(uuid_generate_v4(),
 'Plank',
 'A foundational isometric core exercise that builds endurance and stability throughout the entire core.',
 ARRAY['Core', 'Transverse Abdominis'],
 ARRAY['Shoulders', 'Glutes', 'Erector Spinae'],
 ARRAY['Bodyweight'],
 'beginner',
 ARRAY[
   'Start in a forearm plank position: forearms on the floor, elbows directly below your shoulders, body forming a straight line from head to heels.',
   'Engage your core by pulling your belly button toward your spine, and squeeze your glutes.',
   'Keep your hips level — do not let them sag toward the floor or pike up toward the ceiling.',
   'Breathe normally and hold the position for the prescribed duration.'
 ],
 'Core',
 FALSE,
 NULL),

(uuid_generate_v4(),
 'Crunch',
 'A basic abdominal exercise targeting the rectus abdominis through spinal flexion.',
 ARRAY['Rectus Abdominis'],
 ARRAY['Obliques'],
 ARRAY['Bodyweight'],
 'beginner',
 ARRAY[
   'Lie on your back with knees bent, feet flat on the floor, and hands lightly touching your temples.',
   'Engage your core and curl your upper body off the floor by contracting your abs, lifting your shoulder blades.',
   'Focus on pulling your ribcage toward your pelvis rather than straining your neck.',
   'Lower back down with control until your shoulder blades lightly touch the floor and repeat.'
 ],
 'Core',
 FALSE,
 NULL),

(uuid_generate_v4(),
 'Russian Twist',
 'A rotational core exercise that targets the obliques and improves rotational strength.',
 ARRAY['Obliques'],
 ARRAY['Rectus Abdominis', 'Hip Flexors'],
 ARRAY['Bodyweight', 'Medicine Ball', 'Weight Plate'],
 'beginner',
 ARRAY[
   'Sit on the floor with knees bent and feet flat (or slightly elevated for more difficulty). Lean back slightly to engage your core.',
   'Clasp your hands together or hold a weight in front of your chest.',
   'Rotate your torso to one side, bringing your hands or the weight toward the floor beside your hip.',
   'Rotate to the other side in a controlled manner. Each side counts as one rep.'
 ],
 'Core',
 FALSE,
 NULL),

(uuid_generate_v4(),
 'Hanging Leg Raise',
 'An advanced core exercise that targets the lower abs and hip flexors while hanging from a bar.',
 ARRAY['Rectus Abdominis', 'Hip Flexors'],
 ARRAY['Obliques', 'Lats', 'Forearms'],
 ARRAY['Pull-Up Bar'],
 'advanced',
 ARRAY[
   'Hang from a pull-up bar with an overhand grip, arms fully extended and legs together.',
   'Brace your core and avoid swinging by keeping your body controlled.',
   'Raise your legs upward, keeping them straight (or bent for a modification) until they are at least parallel to the floor.',
   'Slowly lower your legs back to the starting position under control, avoiding swinging.'
 ],
 'Core',
 FALSE,
 NULL),

(uuid_generate_v4(),
 'Cable Crunch',
 'A weighted ab exercise using a cable machine for progressive overload on the rectus abdominis.',
 ARRAY['Rectus Abdominis'],
 ARRAY['Obliques'],
 ARRAY['Cable Machine', 'Rope Attachment'],
 'intermediate',
 ARRAY[
   'Attach a rope to a high cable pulley. Kneel facing the machine and grip the rope behind your neck or at your temples.',
   'Start with your torso upright and hips pushed back slightly.',
   'Contract your abs and crunch downward, rounding your spine and pulling your elbows toward your knees.',
   'Pause at the bottom, then slowly return to the starting position, keeping tension on the cable throughout.'
 ],
 'Core',
 FALSE,
 NULL),

(uuid_generate_v4(),
 'Ab Wheel Rollout',
 'A challenging core exercise using an ab wheel that targets the entire anterior core and builds anti-extension strength.',
 ARRAY['Rectus Abdominis', 'Transverse Abdominis'],
 ARRAY['Obliques', 'Lats', 'Shoulders'],
 ARRAY['Ab Wheel'],
 'advanced',
 ARRAY[
   'Kneel on the floor and grip the ab wheel with both hands, placing it directly below your shoulders.',
   'Brace your core tightly and slowly roll the wheel forward, extending your body toward the floor.',
   'Roll out as far as you can while maintaining a straight body and without letting your lower back cave.',
   'Pull the wheel back toward your knees by contracting your abs and lats to return to the starting position.'
 ],
 'Core',
 FALSE,
 NULL),

(uuid_generate_v4(),
 'Bicycle Crunch',
 'A dynamic core exercise that combines a crunch with a rotation, targeting both the rectus abdominis and obliques.',
 ARRAY['Rectus Abdominis', 'Obliques'],
 ARRAY['Hip Flexors'],
 ARRAY['Bodyweight'],
 'beginner',
 ARRAY[
   'Lie on your back with hands behind your head and legs lifted with knees bent at 90 degrees.',
   'Curl your upper back off the floor and begin pedaling: bring your right knee toward your chest while rotating your left elbow to meet it.',
   'Simultaneously extend your left leg out straight.',
   'Alternate sides in a controlled, fluid pedaling motion, keeping your lower back pressed to the floor.'
 ],
 'Core',
 FALSE,
 NULL),

(uuid_generate_v4(),
 'Dead Bug',
 'A core stability exercise that trains the deep stabilizing muscles while maintaining a neutral spine.',
 ARRAY['Transverse Abdominis', 'Rectus Abdominis'],
 ARRAY['Hip Flexors', 'Erector Spinae'],
 ARRAY['Bodyweight'],
 'beginner',
 ARRAY[
   'Lie on your back with arms extended straight up toward the ceiling and knees bent at 90 degrees, shins parallel to the floor.',
   'Press your lower back firmly into the floor and brace your core.',
   'Slowly lower your right arm overhead toward the floor while simultaneously extending your left leg straight, both moving toward the floor.',
   'Return to the starting position and repeat on the opposite side, keeping your lower back pressed to the floor throughout.'
 ],
 'Core',
 FALSE,
 NULL),

-- ---- CARDIO ----

(uuid_generate_v4(),
 'Treadmill Running',
 'A straightforward cardio exercise performed on a treadmill, scalable by adjusting speed and incline.',
 ARRAY['Cardiovascular System'],
 ARRAY['Quadriceps', 'Hamstrings', 'Calves', 'Glutes'],
 ARRAY['Treadmill'],
 'beginner',
 ARRAY[
   'Step onto the treadmill and start at a slow walking pace to warm up for 2-3 minutes.',
   'Gradually increase the speed to your target running pace.',
   'Maintain an upright posture, relaxed shoulders, and a midfoot strike.',
   'Cool down by gradually reducing speed to a walk for the final 2-3 minutes.'
 ],
 'Cardio',
 FALSE,
 NULL),

(uuid_generate_v4(),
 'Jump Rope',
 'A highly effective cardio and coordination exercise using a jump rope.',
 ARRAY['Cardiovascular System'],
 ARRAY['Calves', 'Shoulders', 'Forearms', 'Core'],
 ARRAY['Jump Rope'],
 'beginner',
 ARRAY[
   'Stand with feet hip-width apart, holding a handle in each hand with elbows close to your sides.',
   'Swing the rope overhead and jump with both feet as it passes under you, landing softly on the balls of your feet.',
   'Use your wrists to control the rotation of the rope, not your whole arms.',
   'Maintain a steady rhythm and a slight bend in your knees throughout.'
 ],
 'Cardio',
 FALSE,
 NULL),

(uuid_generate_v4(),
 'Rowing Machine',
 'A full-body low-impact cardio exercise using an ergometer that trains both the upper and lower body.',
 ARRAY['Cardiovascular System'],
 ARRAY['Lats', 'Rhomboids', 'Quadriceps', 'Hamstrings', 'Core'],
 ARRAY['Rowing Machine'],
 'beginner',
 ARRAY[
   'Sit on the rowing machine, strap your feet in, and grip the handle with both hands.',
   'The drive begins with a leg push: push through your feet to extend your legs while keeping your arms straight.',
   'Once your legs are nearly extended, hinge back slightly at the hips, then pull the handle toward your lower ribs.',
   'Reverse the sequence to return: extend your arms, hinge forward at the hips, then bend your knees to slide back to the start.'
 ],
 'Cardio',
 FALSE,
 NULL),

(uuid_generate_v4(),
 'Cycling',
 'A low-impact cardio exercise performed on a stationary or outdoor bike.',
 ARRAY['Cardiovascular System'],
 ARRAY['Quadriceps', 'Hamstrings', 'Calves', 'Glutes'],
 ARRAY['Stationary Bike', 'Bicycle'],
 'beginner',
 ARRAY[
   'Adjust the seat height so your knee has a slight bend at the bottom of the pedal stroke.',
   'Begin pedaling at a comfortable cadence to warm up for 3-5 minutes.',
   'Adjust resistance as needed to maintain your target heart rate or perceived exertion level.',
   'Maintain an upright posture and engage your core lightly throughout the session.'
 ],
 'Cardio',
 FALSE,
 NULL),

(uuid_generate_v4(),
 'Burpee',
 'A demanding full-body bodyweight exercise that combines a squat, plank, push-up, and jump.',
 ARRAY['Cardiovascular System'],
 ARRAY['Quadriceps', 'Chest', 'Shoulders', 'Triceps', 'Core'],
 ARRAY['Bodyweight'],
 'intermediate',
 ARRAY[
   'Stand with feet shoulder-width apart, then squat down and place your hands on the floor in front of your feet.',
   'Jump or step your feet back into a high plank position.',
   'Perform a push-up (optional), then jump or step your feet back to your hands.',
   'Explosively jump upward, reaching your arms overhead, land softly, and immediately go into the next rep.'
 ],
 'Cardio',
 FALSE,
 NULL),

(uuid_generate_v4(),
 'Battle Ropes',
 'A high-intensity conditioning exercise using heavy ropes to develop power, endurance, and grip strength.',
 ARRAY['Cardiovascular System'],
 ARRAY['Shoulders', 'Core', 'Forearms', 'Back'],
 ARRAY['Battle Ropes'],
 'intermediate',
 ARRAY[
   'Stand facing the anchor point of the ropes with feet shoulder-width apart, knees slightly bent, and core braced.',
   'Grip one rope end in each hand with palms facing inward.',
   'Alternate raising and slamming each arm to create alternating waves down the rope, keeping a fast, powerful pace.',
   'Maintain your athletic stance throughout and breathe rhythmically for the prescribed duration.'
 ],
 'Cardio',
 FALSE,
 NULL),

-- ---- COMPOUND ----

(uuid_generate_v4(),
 'Deadlift',
 'One of the most effective compound exercises for total body strength, primarily targeting the posterior chain.',
 ARRAY['Hamstrings', 'Glutes', 'Erector Spinae'],
 ARRAY['Quadriceps', 'Lats', 'Traps', 'Core', 'Forearms'],
 ARRAY['Barbell'],
 'intermediate',
 ARRAY[
   'Stand with feet hip-width apart, toes under the barbell. Hinge at the hips and bend the knees to grip the bar just outside your legs with an overhand or mixed grip.',
   'Set your back flat, chest up, shoulders slightly in front of or over the bar, and take a deep breath into your belly.',
   'Drive your feet into the floor and push the floor away, keeping the bar close to your body as you stand up.',
   'Lock out at the top by fully extending hips and knees and standing tall. Hinge at the hips to lower the bar back to the floor under control.'
 ],
 'Compound',
 FALSE,
 NULL),

(uuid_generate_v4(),
 'Power Clean',
 'An Olympic-style compound lift that develops explosive power by pulling a barbell from the floor to the shoulders.',
 ARRAY['Quadriceps', 'Hamstrings', 'Glutes', 'Traps'],
 ARRAY['Calves', 'Core', 'Forearms', 'Shoulders'],
 ARRAY['Barbell'],
 'advanced',
 ARRAY[
   'Set up as you would for a deadlift: bar over mid-foot, hip-width stance, overhand grip just outside legs, flat back.',
   'Initiate the lift like a deadlift, keeping the bar close as you drive through the floor.',
   'When the bar reaches your hips, explosively extend your hips, knees, and ankles (triple extension) and shrug your shoulders.',
   'Pull yourself under the bar, catch it on your front deltoids in the rack position with elbows high, then stand to complete the rep.'
 ],
 'Compound',
 FALSE,
 NULL),

(uuid_generate_v4(),
 'Thruster',
 'A highly demanding compound movement combining a front squat with an overhead press in one fluid motion.',
 ARRAY['Quadriceps', 'Glutes', 'Front Deltoids'],
 ARRAY['Hamstrings', 'Triceps', 'Core', 'Upper Trapezius'],
 ARRAY['Barbell', 'Dumbbells', 'Kettlebells'],
 'intermediate',
 ARRAY[
   'Hold the barbell or dumbbells in the front rack position (at shoulder height, elbows high) with feet shoulder-width apart.',
   'Squat down until your thighs are at least parallel to the floor.',
   'Drive up explosively through your heels, using the upward momentum to press the bar or dumbbells overhead.',
   'Fully lock out your arms overhead, then lower back to the front rack position and descend into the next squat.'
 ],
 'Compound',
 FALSE,
 NULL),

(uuid_generate_v4(),
 'Clean and Press',
 'A compound barbell movement combining the power clean with a strict overhead press for full-body development.',
 ARRAY['Quadriceps', 'Hamstrings', 'Glutes', 'Shoulders'],
 ARRAY['Traps', 'Triceps', 'Core', 'Calves'],
 ARRAY['Barbell', 'Dumbbells'],
 'advanced',
 ARRAY[
   'Set up in a deadlift position with the bar on the floor and perform a power clean to bring the bar to the front rack position.',
   'Stand tall with the barbell resting on your front deltoids and elbows high.',
   'Take a breath, brace your core, and press the bar strictly overhead until arms are fully extended.',
   'Lower the bar back to the front rack position and either reset for the next clean or return the bar to the floor.'
 ],
 'Compound',
 FALSE,
 NULL),

(uuid_generate_v4(),
 'Kettlebell Swing',
 'A dynamic compound movement that develops explosive hip power, posterior chain strength, and cardiovascular endurance.',
 ARRAY['Glutes', 'Hamstrings'],
 ARRAY['Erector Spinae', 'Core', 'Shoulders', 'Forearms'],
 ARRAY['Kettlebell'],
 'intermediate',
 ARRAY[
   'Stand with feet slightly wider than shoulder-width and hold a kettlebell with both hands, arms hanging in front of you.',
   'Hinge at the hips and swing the kettlebell back between your legs, loading the hamstrings and glutes.',
   'Explosively drive your hips forward, squeezing your glutes, to propel the kettlebell up to chest or shoulder height.',
   'Allow the kettlebell to swing back down and guide it between your legs again, immediately loading into the next rep.'
 ],
 'Compound',
 FALSE,
 NULL),

(uuid_generate_v4(),
 'Lunge',
 'A fundamental unilateral lower body exercise that builds leg strength, balance, and coordination.',
 ARRAY['Quadriceps', 'Glutes'],
 ARRAY['Hamstrings', 'Calves', 'Core'],
 ARRAY['Bodyweight', 'Dumbbells', 'Barbell'],
 'beginner',
 ARRAY[
   'Stand upright with feet together, holding dumbbells at your sides or a barbell across your traps.',
   'Step forward with one foot, landing heel first, and lower your body until both knees form roughly 90-degree angles.',
   'Keep your front knee aligned over your front foot and your torso upright throughout.',
   'Push through your front heel to return to standing. Alternate legs or complete all reps on one side before switching.'
 ],
 'Compound',
 FALSE,
 NULL);

-- ===========================================
-- WORKOUT TEMPLATES (system templates, user_id = NULL, is_public = TRUE)
-- ===========================================

INSERT INTO workout_templates (id, user_id, name, description, is_public) VALUES
('00000001-0000-0000-0000-000000000001', NULL, 'Beginner Full Body A',         'Full body workout focusing on foundational compound movements - Workout A.',    TRUE),
('00000001-0000-0000-0000-000000000002', NULL, 'Beginner Full Body B',         'Full body workout with slight variation in exercises - Workout B.',              TRUE),
('00000001-0000-0000-0000-000000000003', NULL, 'Beginner Full Body C',         'Full body workout with a cardio emphasis to round out the week - Workout C.',   TRUE),
('00000001-0000-0000-0000-000000000004', NULL, 'Push Day (Intermediate)',       'Intermediate push day targeting chest, shoulders, and triceps.',                 TRUE),
('00000001-0000-0000-0000-000000000005', NULL, 'Pull Day (Intermediate)',       'Intermediate pull day targeting back and biceps.',                               TRUE),
('00000001-0000-0000-0000-000000000006', NULL, 'Leg Day (Intermediate)',        'Intermediate leg day targeting quads, hamstrings, glutes, and calves.',          TRUE),
('00000001-0000-0000-0000-000000000007', NULL, 'Upper Body (Beginner)',         'Beginner upper body day for upper/lower split.',                                 TRUE),
('00000001-0000-0000-0000-000000000008', NULL, 'Lower Body (Beginner)',         'Beginner lower body day for upper/lower split.',                                 TRUE);


-- ===========================================
-- TEMPLATE EXERCISES
-- ===========================================

-- ---- Beginner Full Body A ----
INSERT INTO template_exercises (template_id, exercise_id, "order", target_sets, target_reps, rest_seconds) VALUES
('00000001-0000-0000-0000-000000000001', (SELECT id FROM exercises WHERE name = 'Squat'),            1, 3, 8,  120),
('00000001-0000-0000-0000-000000000001', (SELECT id FROM exercises WHERE name = 'Push-Up'),          2, 3, 10, 90),
('00000001-0000-0000-0000-000000000001', (SELECT id FROM exercises WHERE name = 'Dumbbell Row'),     3, 3, 10, 90),
('00000001-0000-0000-0000-000000000001', (SELECT id FROM exercises WHERE name = 'Glute Bridge'),     4, 3, 12, 60),
('00000001-0000-0000-0000-000000000001', (SELECT id FROM exercises WHERE name = 'Plank'),            5, 3, 30, 60),
('00000001-0000-0000-0000-000000000001', (SELECT id FROM exercises WHERE name = 'Standing Calf Raise'), 6, 3, 15, 60);

-- ---- Beginner Full Body B ----
INSERT INTO template_exercises (template_id, exercise_id, "order", target_sets, target_reps, rest_seconds) VALUES
('00000001-0000-0000-0000-000000000002', (SELECT id FROM exercises WHERE name = 'Leg Press'),             1, 3, 10, 120),
('00000001-0000-0000-0000-000000000002', (SELECT id FROM exercises WHERE name = 'Dumbbell Lateral Raise'), 2, 3, 12, 60),
('00000001-0000-0000-0000-000000000002', (SELECT id FROM exercises WHERE name = 'Lat Pulldown'),          3, 3, 10, 90),
('00000001-0000-0000-0000-000000000002', (SELECT id FROM exercises WHERE name = 'Romanian Deadlift'),     4, 3, 10, 90),
('00000001-0000-0000-0000-000000000002', (SELECT id FROM exercises WHERE name = 'Crunch'),                5, 3, 15, 60),
('00000001-0000-0000-0000-000000000002', (SELECT id FROM exercises WHERE name = 'Seated Calf Raise'),     6, 3, 15, 60);

-- ---- Beginner Full Body C ----
INSERT INTO template_exercises (template_id, exercise_id, "order", target_sets, target_reps, rest_seconds) VALUES
('00000001-0000-0000-0000-000000000003', (SELECT id FROM exercises WHERE name = 'Lunge'),                1, 3, 10, 90),
('00000001-0000-0000-0000-000000000003', (SELECT id FROM exercises WHERE name = 'Push-Up'),              2, 3, 12, 60),
('00000001-0000-0000-0000-000000000003', (SELECT id FROM exercises WHERE name = 'Dumbbell Row'),         3, 3, 12, 60),
('00000001-0000-0000-0000-000000000003', (SELECT id FROM exercises WHERE name = 'Bicycle Crunch'),       4, 3, 20, 60),
('00000001-0000-0000-0000-000000000003', (SELECT id FROM exercises WHERE name = 'Burpee'),               5, 3, 8,  90),
('00000001-0000-0000-0000-000000000003', (SELECT id FROM exercises WHERE name = 'Dead Bug'),             6, 3, 10, 60);

-- ---- Push Day (Intermediate) ----
INSERT INTO template_exercises (template_id, exercise_id, "order", target_sets, target_reps, rest_seconds) VALUES
('00000001-0000-0000-0000-000000000004', (SELECT id FROM exercises WHERE name = 'Bench Press'),             1, 4, 8,  120),
('00000001-0000-0000-0000-000000000004', (SELECT id FROM exercises WHERE name = 'Incline Dumbbell Press'),  2, 3, 10, 90),
('00000001-0000-0000-0000-000000000004', (SELECT id FROM exercises WHERE name = 'Overhead Press'),          3, 3, 8,  120),
('00000001-0000-0000-0000-000000000004', (SELECT id FROM exercises WHERE name = 'Dumbbell Lateral Raise'),  4, 3, 12, 60),
('00000001-0000-0000-0000-000000000004', (SELECT id FROM exercises WHERE name = 'Cable Fly'),               5, 3, 12, 60),
('00000001-0000-0000-0000-000000000004', (SELECT id FROM exercises WHERE name = 'Tricep Pushdown'),         6, 3, 12, 60),
('00000001-0000-0000-0000-000000000004', (SELECT id FROM exercises WHERE name = 'Skull Crusher'),           7, 3, 10, 60);

-- ---- Pull Day (Intermediate) ----
INSERT INTO template_exercises (template_id, exercise_id, "order", target_sets, target_reps, rest_seconds) VALUES
('00000001-0000-0000-0000-000000000005', (SELECT id FROM exercises WHERE name = 'Barbell Row'),            1, 4, 8,  120),
('00000001-0000-0000-0000-000000000005', (SELECT id FROM exercises WHERE name = 'Pull-Up'),                2, 3, 6,  120),
('00000001-0000-0000-0000-000000000005', (SELECT id FROM exercises WHERE name = 'Lat Pulldown'),           3, 3, 10, 90),
('00000001-0000-0000-0000-000000000005', (SELECT id FROM exercises WHERE name = 'Face Pull'),              4, 3, 15, 60),
('00000001-0000-0000-0000-000000000005', (SELECT id FROM exercises WHERE name = 'Barbell Curl'),           5, 3, 10, 60),
('00000001-0000-0000-0000-000000000005', (SELECT id FROM exercises WHERE name = 'Dumbbell Hammer Curl'),   6, 3, 10, 60),
('00000001-0000-0000-0000-000000000005', (SELECT id FROM exercises WHERE name = 'Preacher Curl'),          7, 3, 10, 60);

-- ---- Leg Day (Intermediate) ----
INSERT INTO template_exercises (template_id, exercise_id, "order", target_sets, target_reps, rest_seconds) VALUES
('00000001-0000-0000-0000-000000000006', (SELECT id FROM exercises WHERE name = 'Squat'),                  1, 4, 8,  180),
('00000001-0000-0000-0000-000000000006', (SELECT id FROM exercises WHERE name = 'Romanian Deadlift'),      2, 3, 10, 120),
('00000001-0000-0000-0000-000000000006', (SELECT id FROM exercises WHERE name = 'Bulgarian Split Squat'),  3, 3, 10, 90),
('00000001-0000-0000-0000-000000000006', (SELECT id FROM exercises WHERE name = 'Hip Thrust'),             4, 3, 12, 90),
('00000001-0000-0000-0000-000000000006', (SELECT id FROM exercises WHERE name = 'Leg Curl'),               5, 3, 12, 60),
('00000001-0000-0000-0000-000000000006', (SELECT id FROM exercises WHERE name = 'Leg Extension'),          6, 3, 15, 60),
('00000001-0000-0000-0000-000000000006', (SELECT id FROM exercises WHERE name = 'Standing Calf Raise'),    7, 4, 15, 60);

-- ---- Upper Body (Beginner) - for Upper/Lower split ----
INSERT INTO template_exercises (template_id, exercise_id, "order", target_sets, target_reps, rest_seconds) VALUES
('00000001-0000-0000-0000-000000000007', (SELECT id FROM exercises WHERE name = 'Push-Up'),              1, 3, 10, 90),
('00000001-0000-0000-0000-000000000007', (SELECT id FROM exercises WHERE name = 'Dumbbell Row'),         2, 3, 10, 90),
('00000001-0000-0000-0000-000000000007', (SELECT id FROM exercises WHERE name = 'Dumbbell Lateral Raise'), 3, 3, 12, 60),
('00000001-0000-0000-0000-000000000007', (SELECT id FROM exercises WHERE name = 'Lat Pulldown'),         4, 3, 10, 90),
('00000001-0000-0000-0000-000000000007', (SELECT id FROM exercises WHERE name = 'Barbell Curl'),         5, 3, 10, 60),
('00000001-0000-0000-0000-000000000007', (SELECT id FROM exercises WHERE name = 'Tricep Pushdown'),      6, 3, 12, 60);

-- ---- Lower Body (Beginner) - for Upper/Lower split ----
INSERT INTO template_exercises (template_id, exercise_id, "order", target_sets, target_reps, rest_seconds) VALUES
('00000001-0000-0000-0000-000000000008', (SELECT id FROM exercises WHERE name = 'Squat'),              1, 3, 10, 120),
('00000001-0000-0000-0000-000000000008', (SELECT id FROM exercises WHERE name = 'Romanian Deadlift'),  2, 3, 10, 90),
('00000001-0000-0000-0000-000000000008', (SELECT id FROM exercises WHERE name = 'Lunge'),              3, 3, 10, 90),
('00000001-0000-0000-0000-000000000008', (SELECT id FROM exercises WHERE name = 'Glute Bridge'),       4, 3, 12, 60),
('00000001-0000-0000-0000-000000000008', (SELECT id FROM exercises WHERE name = 'Standing Calf Raise'), 5, 3, 15, 60),
('00000001-0000-0000-0000-000000000008', (SELECT id FROM exercises WHERE name = 'Plank'),              6, 3, 30, 60);


-- ===========================================
-- WORKOUT PLANS (system plans)
-- ===========================================

INSERT INTO workout_plans (id, name, description, duration_weeks, difficulty, goal, frequency, created_by, is_system_plan, equipment_required) VALUES
('00000002-0000-0000-0000-000000000001',
 'Beginner Full Body Program',
 'A 4-week full body program for beginners, training three days per week. Each session hits all major muscle groups with fundamental exercises to build a solid strength foundation.',
 4,
 'beginner',
 'General fitness',
 3,
 NULL,
 TRUE,
 ARRAY['Dumbbells', 'Gym access']),

('00000002-0000-0000-0000-000000000002',
 'Intermediate Push/Pull/Legs',
 'An 8-week Push/Pull/Legs split for intermediate lifters training six days per week. Designed to maximize muscle gain through high training volume and frequency.',
 8,
 'intermediate',
 'Muscle gain',
 6,
 NULL,
 TRUE,
 ARRAY['Gym access', 'Barbell', 'Dumbbells']),

('00000002-0000-0000-0000-000000000003',
 'Beginner Upper/Lower Split',
 'A 6-week upper/lower split for beginners, training four days per week. Alternates between upper and lower body sessions for balanced muscle development and adequate recovery.',
 6,
 'beginner',
 'Muscle gain',
 4,
 NULL,
 TRUE,
 ARRAY['Dumbbells', 'Gym access']);


-- ===========================================
-- PLAN WORKOUTS
-- ===========================================

-- ================================================================
-- Plan 1: Beginner Full Body Program
-- 3 days/week (Mon=day1, Wed=day2, Fri=day3), 4 weeks
-- Week 1 through Week 4: A, B, C rotation
-- ================================================================

-- Week 1
INSERT INTO plan_workouts (plan_id, day_number, workout_template_id, week_number) VALUES
('00000002-0000-0000-0000-000000000001', 1, '00000001-0000-0000-0000-000000000001', 1),
('00000002-0000-0000-0000-000000000001', 2, '00000001-0000-0000-0000-000000000002', 1),
('00000002-0000-0000-0000-000000000001', 3, '00000001-0000-0000-0000-000000000003', 1);

-- Week 2
INSERT INTO plan_workouts (plan_id, day_number, workout_template_id, week_number) VALUES
('00000002-0000-0000-0000-000000000001', 1, '00000001-0000-0000-0000-000000000002', 2),
('00000002-0000-0000-0000-000000000001', 2, '00000001-0000-0000-0000-000000000003', 2),
('00000002-0000-0000-0000-000000000001', 3, '00000001-0000-0000-0000-000000000001', 2);

-- Week 3
INSERT INTO plan_workouts (plan_id, day_number, workout_template_id, week_number) VALUES
('00000002-0000-0000-0000-000000000001', 1, '00000001-0000-0000-0000-000000000003', 3),
('00000002-0000-0000-0000-000000000001', 2, '00000001-0000-0000-0000-000000000001', 3),
('00000002-0000-0000-0000-000000000001', 3, '00000001-0000-0000-0000-000000000002', 3);

-- Week 4
INSERT INTO plan_workouts (plan_id, day_number, workout_template_id, week_number) VALUES
('00000002-0000-0000-0000-000000000001', 1, '00000001-0000-0000-0000-000000000001', 4),
('00000002-0000-0000-0000-000000000001', 2, '00000001-0000-0000-0000-000000000002', 4),
('00000002-0000-0000-0000-000000000001', 3, '00000001-0000-0000-0000-000000000003', 4);


-- ================================================================
-- Plan 2: Intermediate Push/Pull/Legs
-- 6 days/week (day1=Push, day2=Pull, day3=Legs, day4=Push, day5=Pull, day6=Legs), 8 weeks
-- ================================================================

-- Week 1
INSERT INTO plan_workouts (plan_id, day_number, workout_template_id, week_number) VALUES
('00000002-0000-0000-0000-000000000002', 1, '00000001-0000-0000-0000-000000000004', 1),
('00000002-0000-0000-0000-000000000002', 2, '00000001-0000-0000-0000-000000000005', 1),
('00000002-0000-0000-0000-000000000002', 3, '00000001-0000-0000-0000-000000000006', 1),
('00000002-0000-0000-0000-000000000002', 4, '00000001-0000-0000-0000-000000000004', 1),
('00000002-0000-0000-0000-000000000002', 5, '00000001-0000-0000-0000-000000000005', 1),
('00000002-0000-0000-0000-000000000002', 6, '00000001-0000-0000-0000-000000000006', 1);

-- Week 2
INSERT INTO plan_workouts (plan_id, day_number, workout_template_id, week_number) VALUES
('00000002-0000-0000-0000-000000000002', 1, '00000001-0000-0000-0000-000000000004', 2),
('00000002-0000-0000-0000-000000000002', 2, '00000001-0000-0000-0000-000000000005', 2),
('00000002-0000-0000-0000-000000000002', 3, '00000001-0000-0000-0000-000000000006', 2),
('00000002-0000-0000-0000-000000000002', 4, '00000001-0000-0000-0000-000000000004', 2),
('00000002-0000-0000-0000-000000000002', 5, '00000001-0000-0000-0000-000000000005', 2),
('00000002-0000-0000-0000-000000000002', 6, '00000001-0000-0000-0000-000000000006', 2);

-- Week 3
INSERT INTO plan_workouts (plan_id, day_number, workout_template_id, week_number) VALUES
('00000002-0000-0000-0000-000000000002', 1, '00000001-0000-0000-0000-000000000004', 3),
('00000002-0000-0000-0000-000000000002', 2, '00000001-0000-0000-0000-000000000005', 3),
('00000002-0000-0000-0000-000000000002', 3, '00000001-0000-0000-0000-000000000006', 3),
('00000002-0000-0000-0000-000000000002', 4, '00000001-0000-0000-0000-000000000004', 3),
('00000002-0000-0000-0000-000000000002', 5, '00000001-0000-0000-0000-000000000005', 3),
('00000002-0000-0000-0000-000000000002', 6, '00000001-0000-0000-0000-000000000006', 3);

-- Week 4
INSERT INTO plan_workouts (plan_id, day_number, workout_template_id, week_number) VALUES
('00000002-0000-0000-0000-000000000002', 1, '00000001-0000-0000-0000-000000000004', 4),
('00000002-0000-0000-0000-000000000002', 2, '00000001-0000-0000-0000-000000000005', 4),
('00000002-0000-0000-0000-000000000002', 3, '00000001-0000-0000-0000-000000000006', 4),
('00000002-0000-0000-0000-000000000002', 4, '00000001-0000-0000-0000-000000000004', 4),
('00000002-0000-0000-0000-000000000002', 5, '00000001-0000-0000-0000-000000000005', 4),
('00000002-0000-0000-0000-000000000002', 6, '00000001-0000-0000-0000-000000000006', 4);

-- Week 5
INSERT INTO plan_workouts (plan_id, day_number, workout_template_id, week_number) VALUES
('00000002-0000-0000-0000-000000000002', 1, '00000001-0000-0000-0000-000000000004', 5),
('00000002-0000-0000-0000-000000000002', 2, '00000001-0000-0000-0000-000000000005', 5),
('00000002-0000-0000-0000-000000000002', 3, '00000001-0000-0000-0000-000000000006', 5),
('00000002-0000-0000-0000-000000000002', 4, '00000001-0000-0000-0000-000000000004', 5),
('00000002-0000-0000-0000-000000000002', 5, '00000001-0000-0000-0000-000000000005', 5),
('00000002-0000-0000-0000-000000000002', 6, '00000001-0000-0000-0000-000000000006', 5);

-- Week 6
INSERT INTO plan_workouts (plan_id, day_number, workout_template_id, week_number) VALUES
('00000002-0000-0000-0000-000000000002', 1, '00000001-0000-0000-0000-000000000004', 6),
('00000002-0000-0000-0000-000000000002', 2, '00000001-0000-0000-0000-000000000005', 6),
('00000002-0000-0000-0000-000000000002', 3, '00000001-0000-0000-0000-000000000006', 6),
('00000002-0000-0000-0000-000000000002', 4, '00000001-0000-0000-0000-000000000004', 6),
('00000002-0000-0000-0000-000000000002', 5, '00000001-0000-0000-0000-000000000005', 6),
('00000002-0000-0000-0000-000000000002', 6, '00000001-0000-0000-0000-000000000006', 6);

-- Week 7
INSERT INTO plan_workouts (plan_id, day_number, workout_template_id, week_number) VALUES
('00000002-0000-0000-0000-000000000002', 1, '00000001-0000-0000-0000-000000000004', 7),
('00000002-0000-0000-0000-000000000002', 2, '00000001-0000-0000-0000-000000000005', 7),
('00000002-0000-0000-0000-000000000002', 3, '00000001-0000-0000-0000-000000000006', 7),
('00000002-0000-0000-0000-000000000002', 4, '00000001-0000-0000-0000-000000000004', 7),
('00000002-0000-0000-0000-000000000002', 5, '00000001-0000-0000-0000-000000000005', 7),
('00000002-0000-0000-0000-000000000002', 6, '00000001-0000-0000-0000-000000000006', 7);

-- Week 8
INSERT INTO plan_workouts (plan_id, day_number, workout_template_id, week_number) VALUES
('00000002-0000-0000-0000-000000000002', 1, '00000001-0000-0000-0000-000000000004', 8),
('00000002-0000-0000-0000-000000000002', 2, '00000001-0000-0000-0000-000000000005', 8),
('00000002-0000-0000-0000-000000000002', 3, '00000001-0000-0000-0000-000000000006', 8),
('00000002-0000-0000-0000-000000000002', 4, '00000001-0000-0000-0000-000000000004', 8),
('00000002-0000-0000-0000-000000000002', 5, '00000001-0000-0000-0000-000000000005', 8),
('00000002-0000-0000-0000-000000000002', 6, '00000001-0000-0000-0000-000000000006', 8);


-- ================================================================
-- Plan 3: Beginner Upper/Lower Split
-- 4 days/week (day1=Upper, day2=Lower, day3=Upper, day4=Lower), 6 weeks
-- ================================================================

-- Week 1
INSERT INTO plan_workouts (plan_id, day_number, workout_template_id, week_number) VALUES
('00000002-0000-0000-0000-000000000003', 1, '00000001-0000-0000-0000-000000000007', 1),
('00000002-0000-0000-0000-000000000003', 2, '00000001-0000-0000-0000-000000000008', 1),
('00000002-0000-0000-0000-000000000003', 3, '00000001-0000-0000-0000-000000000007', 1),
('00000002-0000-0000-0000-000000000003', 4, '00000001-0000-0000-0000-000000000008', 1);

-- Week 2
INSERT INTO plan_workouts (plan_id, day_number, workout_template_id, week_number) VALUES
('00000002-0000-0000-0000-000000000003', 1, '00000001-0000-0000-0000-000000000007', 2),
('00000002-0000-0000-0000-000000000003', 2, '00000001-0000-0000-0000-000000000008', 2),
('00000002-0000-0000-0000-000000000003', 3, '00000001-0000-0000-0000-000000000007', 2),
('00000002-0000-0000-0000-000000000003', 4, '00000001-0000-0000-0000-000000000008', 2);

-- Week 3
INSERT INTO plan_workouts (plan_id, day_number, workout_template_id, week_number) VALUES
('00000002-0000-0000-0000-000000000003', 1, '00000001-0000-0000-0000-000000000007', 3),
('00000002-0000-0000-0000-000000000003', 2, '00000001-0000-0000-0000-000000000008', 3),
('00000002-0000-0000-0000-000000000003', 3, '00000001-0000-0000-0000-000000000007', 3),
('00000002-0000-0000-0000-000000000003', 4, '00000001-0000-0000-0000-000000000008', 3);

-- Week 4
INSERT INTO plan_workouts (plan_id, day_number, workout_template_id, week_number) VALUES
('00000002-0000-0000-0000-000000000003', 1, '00000001-0000-0000-0000-000000000007', 4),
('00000002-0000-0000-0000-000000000003', 2, '00000001-0000-0000-0000-000000000008', 4),
('00000002-0000-0000-0000-000000000003', 3, '00000001-0000-0000-0000-000000000007', 4),
('00000002-0000-0000-0000-000000000003', 4, '00000001-0000-0000-0000-000000000008', 4);

-- Week 5
INSERT INTO plan_workouts (plan_id, day_number, workout_template_id, week_number) VALUES
('00000002-0000-0000-0000-000000000003', 1, '00000001-0000-0000-0000-000000000007', 5),
('00000002-0000-0000-0000-000000000003', 2, '00000001-0000-0000-0000-000000000008', 5),
('00000002-0000-0000-0000-000000000003', 3, '00000001-0000-0000-0000-000000000007', 5),
('00000002-0000-0000-0000-000000000003', 4, '00000001-0000-0000-0000-000000000008', 5);

-- Week 6
INSERT INTO plan_workouts (plan_id, day_number, workout_template_id, week_number) VALUES
('00000002-0000-0000-0000-000000000003', 1, '00000001-0000-0000-0000-000000000007', 6),
('00000002-0000-0000-0000-000000000003', 2, '00000001-0000-0000-0000-000000000008', 6),
('00000002-0000-0000-0000-000000000003', 3, '00000001-0000-0000-0000-000000000007', 6),
('00000002-0000-0000-0000-000000000003', 4, '00000001-0000-0000-0000-000000000008', 6);
