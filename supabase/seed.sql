-- Seed data for users table
INSERT INTO public.users (id, email, display_name, created_at, updated_at)
VALUES
  ('d8a5f4e2-c6b3-4a7d-9e8f-1c2b3a4d5e6f', 'john.doe@example.com', 'John Doe', NOW(), NOW()),
  ('a1b2c3d4-e5f6-4a7d-8e9f-0a1b2c3d4e5f', 'jane.smith@example.com', 'Jane Smith', NOW(), NOW()),
  ('f1e2d3c4-b5a6-4a7d-8e9f-1a2b3c4d5e6f', 'alex.johnson@example.com', 'Alex Johnson', NOW(), NOW()),
  ('c4d5e6f7-a8b9-4a7d-8e9f-2a3b4c5d6e7f', 'maria.garcia@example.com', 'Maria Garcia', NOW(), NOW());

-- Seed data for tasks table
INSERT INTO public.tasks (id, title, description, priority, category, deadline, completed, user_id, created_at, updated_at)
VALUES
  ('1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d', 'Complete project proposal', 'Draft and submit the project proposal document', 'high', 'work', '2024-04-15', false, 'd8a5f4e2-c6b3-4a7d-9e8f-1c2b3a4d5e6f', NOW(), NOW()),
  ('2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e', 'Buy groceries', 'Milk, eggs, bread, and vegetables', 'medium', 'personal', '2024-04-05', true, 'd8a5f4e2-c6b3-4a7d-9e8f-1c2b3a4d5e6f', NOW(), NOW()),
  ('3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f', 'Schedule dentist appointment', 'Call Dr. Smith for a checkup', 'low', 'health', '2024-04-20', false, 'a1b2c3d4-e5f6-4a7d-8e9f-0a1b2c3d4e5f', NOW(), NOW()),
  ('4d5e6f7a-8b9c-0d1e-2f3a-4b5c6d7e8f9a', 'Prepare presentation', 'Create slides for the quarterly meeting', 'high', 'work', '2024-04-10', false, 'a1b2c3d4-e5f6-4a7d-8e9f-0a1b2c3d4e5f', NOW(), NOW()),
  ('5e6f7a8b-9c0d-1e2f-3a4b-5c6d7e8f9a0b', 'Pay utility bills', 'Electricity, water, and internet', 'medium', 'finance', '2024-04-08', false, 'f1e2d3c4-b5a6-4a7d-8e9f-1a2b3c4d5e6f', NOW(), NOW()),
  ('6f7a8b9c-0d1e-2f3a-4b5c-6d7e8f9a0b1c', 'Go for a run', '30 minutes in the park', 'low', 'health', '2024-04-06', true, 'f1e2d3c4-b5a6-4a7d-8e9f-1a2b3c4d5e6f', NOW(), NOW()),
  ('7a8b9c0d-1e2f-3a4b-5c6d-7e8f9a0b1c2d', 'Read book chapter', 'Chapter 5 of "The Innovator\'s Dilemma"', 'low', 'personal', '2024-04-12', false, 'c4d5e6f7-a8b9-4a7d-8e9f-2a3b4c5d6e7f', NOW(), NOW()),
  ('8b9c0d1e-2f3a-4b5c-6d7e-8f9a0b1c2d3e', 'Plan weekend trip', 'Research destinations and accommodations', 'medium', 'personal', '2024-04-18', false, 'c4d5e6f7-a8b9-4a7d-8e9f-2a3b4c5d6e7f', NOW(), NOW()),
  ('9c0d1e2f-3a4b-5c6d-7e8f-9a0b1c2d3e4f', 'Fix kitchen sink', 'Call plumber or DIY repair', 'high', 'home', '2024-04-07', false, 'd8a5f4e2-c6b3-4a7d-9e8f-1c2b3a4d5e6f', NOW(), NOW()),
  ('0d1e2f3a-4b5c-6d7e-8f9a-0b1c2d3e4f5a', 'Update resume', 'Add recent projects and skills', 'medium', 'work', '2024-04-25', false, 'a1b2c3d4-e5f6-4a7d-8e9f-0a1b2c3d4e5f', NOW(), NOW());
