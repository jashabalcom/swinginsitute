-- Seed sample lessons for all modules
-- Level 1: Inner Diamond modules
INSERT INTO lessons (module_id, title, description, video_duration_seconds, is_preview, sort_order) VALUES
-- Identity & Confidence
('9cf65813-0c59-4aa6-883f-6789415369e4', 'What Makes an Elite Hitter', 'Discover the mental traits that separate good hitters from great ones.', 480, true, 1),
('9cf65813-0c59-4aa6-883f-6789415369e4', 'Building Your Hitter Identity', 'Create your personal hitter identity and develop unshakeable confidence.', 720, false, 2),
('9cf65813-0c59-4aa6-883f-6789415369e4', 'Confidence Routines', 'Master pre-game and at-bat routines that lock in your confidence.', 600, false, 3),
('9cf65813-0c59-4aa6-883f-6789415369e4', 'The Inner Diamond Mindset', 'Learn the four pillars of mental excellence in hitting.', 540, false, 4),

-- Self-Belief & Visualization  
('d7c6d797-2734-4548-8189-6dc6fca181c8', 'The Power of Visualization', 'Learn how pro hitters use mental imagery to dominate at the plate.', 600, true, 1),
('d7c6d797-2734-4548-8189-6dc6fca181c8', 'Building Unshakeable Self-Belief', 'Develop the deep belief in yourself that drives elite performance.', 720, false, 2),
('d7c6d797-2734-4548-8189-6dc6fca181c8', 'Mental Rehearsal Techniques', 'Practice visualization drills used by MLB players.', 480, false, 3),

-- Handling Failure & Pressure
('6b640aa9-bb9f-4363-a4bd-42e5df2ce245', 'Reframing Failure', 'Turn strikeouts and slumps into fuel for growth.', 540, true, 1),
('6b640aa9-bb9f-4363-a4bd-42e5df2ce245', 'Thriving Under Pressure', 'Learn to embrace high-pressure at-bats.', 660, false, 2),
('6b640aa9-bb9f-4363-a4bd-42e5df2ce245', 'The Reset Routine', 'Master the 10-second reset between pitches.', 420, false, 3),

-- Emotional Control
('91ac0fac-9ddf-41ba-9f98-303cb407e39f', 'Controlling Your Emotions', 'Stay calm and focused no matter the situation.', 480, true, 1),
('91ac0fac-9ddf-41ba-9f98-303cb407e39f', 'The Breathing Protocol', 'Use breathing techniques to control your nervous system.', 360, false, 2),
('91ac0fac-9ddf-41ba-9f98-303cb407e39f', 'Managing Frustration', 'Turn anger into fuel instead of letting it destroy your at-bats.', 540, false, 3),

-- Focus & Consistency
('f2ef24a3-6230-42c4-a596-b4acd3bc5317', 'Elite-Level Focus', 'Train your focus like elite hitters do.', 600, true, 1),
('f2ef24a3-6230-42c4-a596-b4acd3bc5317', 'Building Consistency', 'Create daily habits that build consistent performance.', 540, false, 2),
('f2ef24a3-6230-42c4-a596-b4acd3bc5317', 'The Focus Funnel', 'Learn to narrow your focus as the pitch approaches.', 480, false, 3),

-- Parent Partnership
('decf69d8-f8c9-4a23-8e4a-819f9f803932', 'The Role of Parents', 'How parents can support without adding pressure.', 600, true, 1),
('decf69d8-f8c9-4a23-8e4a-819f9f803932', 'Communication Strategies', 'Build better communication around baseball performance.', 720, false, 2),
('decf69d8-f8c9-4a23-8e4a-819f9f803932', 'Supporting Through Slumps', 'Help your player navigate the inevitable struggles.', 540, false, 3),

-- Level 2: Swing Mechanics Mastery modules
-- Foundation of a Pro Swing
('73f04a1e-6a03-4ae1-acd6-b46a1d57e196', 'The Athletic Stance', 'Build a solid foundation with the perfect athletic stance.', 360, true, 1),
('73f04a1e-6a03-4ae1-acd6-b46a1d57e196', 'Weight Distribution Basics', 'Master proper weight distribution for explosive power.', 600, false, 2),
('73f04a1e-6a03-4ae1-acd6-b46a1d57e196', 'Grip and Hand Position', 'Learn the grip that maximizes bat speed and control.', 480, false, 3),
('73f04a1e-6a03-4ae1-acd6-b46a1d57e196', 'The Ready Position Drill', 'Practice the ready position until it becomes automatic.', 720, false, 4),

-- Stance & Balance
('9e03542f-90fe-4710-84ab-ca3c0b34c8ed', 'Finding Your Stance', 'Discover the stance that works for your body.', 540, true, 1),
('9e03542f-90fe-4710-84ab-ca3c0b34c8ed', 'Balance Through the Swing', 'Maintain elite balance from load to finish.', 600, false, 2),
('9e03542f-90fe-4710-84ab-ca3c0b34c8ed', 'Common Stance Mistakes', 'Fix the most common stance errors that kill power.', 480, false, 3),

-- Load & Separation
('897ebe31-886f-496e-a06c-eddcef4908e9', 'The Pro Load', 'Master the loading phase that creates power.', 600, true, 1),
('897ebe31-886f-496e-a06c-eddcef4908e9', 'Hip-Shoulder Separation', 'Unlock elite bat speed through proper separation.', 720, false, 2),
('897ebe31-886f-496e-a06c-eddcef4908e9', 'Timing Your Load', 'Perfect the timing of your load to different pitch speeds.', 540, false, 3),

-- Rotation & Power
('50c7da71-5534-4fc1-ab94-b5b88770ceda', 'Rotational Mechanics', 'Understand the physics of rotational hitting.', 660, true, 1),
('50c7da71-5534-4fc1-ab94-b5b88770ceda', 'Ground Force Connection', 'Use the ground to generate explosive power.', 540, false, 2),
('50c7da71-5534-4fc1-ab94-b5b88770ceda', 'The Power Sequence', 'Master the hip-torso-arm sequence.', 600, false, 3),
('50c7da71-5534-4fc1-ab94-b5b88770ceda', 'Power Drills', 'Practice drills that build rotational power.', 720, false, 4),

-- Extension & Finish
('221db4c7-1300-4e6d-972d-ffb4eaa12581', 'The Launch Position', 'Get into the perfect launch position for power.', 480, true, 1),
('221db4c7-1300-4e6d-972d-ffb4eaa12581', 'Extension Through Contact', 'Maximize power with proper extension.', 600, false, 2),
('221db4c7-1300-4e6d-972d-ffb4eaa12581', 'The Finish', 'Complete your swing with an elite finish.', 420, false, 3),

-- Common Swing Flaws
('8d033151-3279-4493-9c93-1d500d44a6dd', 'Diagnosing Your Swing', 'Learn to identify common swing flaws.', 540, true, 1),
('8d033151-3279-4493-9c93-1d500d44a6dd', 'Fixing the Uppercut', 'Correct excessive uppercut swing paths.', 480, false, 2),
('8d033151-3279-4493-9c93-1d500d44a6dd', 'Eliminating the Rollover', 'Fix the rollover that causes weak grounders.', 540, false, 3),
('8d033151-3279-4493-9c93-1d500d44a6dd', 'Correcting Casting', 'Fix the cast that kills bat speed.', 480, false, 4),

-- Level 4: Baseball IQ & Pro Track modules
-- Reading Pitchers
('9f843aab-cb05-4cdc-88ed-3cd06e596aa8', 'Pitcher Tell Signs', 'Learn to read pitcher body language and tells.', 720, true, 1),
('9f843aab-cb05-4cdc-88ed-3cd06e596aa8', 'Pitch Recognition Training', 'Train your eyes to recognize pitches early.', 600, false, 2),
('9f843aab-cb05-4cdc-88ed-3cd06e596aa8', 'Velocity Adjustment', 'Adjust your timing to different velocity levels.', 540, false, 3),

-- Plate Approach by Count
('1711ebd1-240b-4462-8eb4-3f1513c050f5', 'Count Strategy Basics', 'Understand how to approach each count.', 600, true, 1),
('1711ebd1-240b-4462-8eb4-3f1513c050f5', 'Hitter Counts', 'Attack hitter counts with confidence.', 540, false, 2),
('1711ebd1-240b-4462-8eb4-3f1513c050f5', 'Two-Strike Approach', 'The mindset and mechanics for two-strike hitting.', 660, false, 3),

-- Situational Hitting
('537e166a-fd4d-4891-904e-7ae4758c9748', 'Productive Outs', 'Move runners and help your team with productive outs.', 480, true, 1),
('537e166a-fd4d-4891-904e-7ae4758c9748', 'Hitting with RISP', 'Deliver when it matters with runners in scoring position.', 600, false, 2),
('537e166a-fd4d-4891-904e-7ae4758c9748', 'Gap-to-Gap Hitting', 'Use the whole field to become a complete hitter.', 540, false, 3),

-- Game Preparation
('29b8443d-5596-4408-89b4-2c01a35a286e', 'Pre-Game Mental Prep', 'Prepare mentally before every game.', 600, true, 1),
('29b8443d-5596-4408-89b4-2c01a35a286e', 'Physical Warm-Up Routine', 'The ideal warm-up routine for peak performance.', 720, false, 2),
('29b8443d-5596-4408-89b4-2c01a35a286e', 'Video Study Techniques', 'Study pitchers and your own swings effectively.', 540, false, 3),

-- Advanced At-Bat Strategy
('4bd7d702-29b2-452f-9817-57a91897920b', 'Building an At-Bat', 'Create a plan for every at-bat.', 660, true, 1),
('4bd7d702-29b2-452f-9817-57a91897920b', 'Adjusting In-Game', 'Make real-time adjustments during games.', 540, false, 2),
('4bd7d702-29b2-452f-9817-57a91897920b', 'The Professional Approach', 'Think like a pro in every at-bat.', 600, false, 3),

-- Pro Track Game Plan
('73b3d32c-de89-4c5a-bd27-baef53ab1215', 'Creating Your Game Plan', 'Build a personalized game plan for success.', 720, true, 1),
('73b3d32c-de89-4c5a-bd27-baef53ab1215', 'Weekly Training Structure', 'Organize your training for maximum improvement.', 600, false, 2),
('73b3d32c-de89-4c5a-bd27-baef53ab1215', 'Long-Term Development', 'Plan your development over months and years.', 540, false, 3),
('73b3d32c-de89-4c5a-bd27-baef53ab1215', 'The Pro Mindset', 'Adopt the mindset that separates pros from amateurs.', 660, false, 4);