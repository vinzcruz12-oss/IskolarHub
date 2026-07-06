-- ===========================================
-- IskolarHub Seed Data
-- Uses INSERT IGNORE to avoid duplicate entries
-- ===========================================

-- ==========================
-- Universities
-- ==========================

INSERT IGNORE INTO universities (university_name) VALUES
('Far Eastern University'),
('University of the Philippines Diliman'),
('Ateneo de Manila University'),
('De La Salle University'),
('University of Santo Tomas'),
('National University'),
('Adamson University'),
('University of the East'),
('Technological Institute of the Philippines'),
('Mapúa University');

-- ==========================
-- Colleges
-- ==========================

INSERT IGNORE INTO colleges (university_id, college_name) VALUES
(1, 'Institute of Technology'),
(2, 'College of Engineering'),
(3, 'John Gokongwei School of Management'),
(4, 'College of Computer Studies'),
(5, 'Faculty of Engineering'),
(6, 'College of Nursing'),
(7, 'College of Engineering'),
(8, 'College of Education'),
(9, 'College of Information Technology Education'),
(10, 'School of Electrical, Electronics and Computer Engineering');

-- ==========================
-- Courses
-- ==========================

INSERT IGNORE INTO courses (college_id, course_name) VALUES
(1, 'BS Information Technology'),
(2, 'BS Computer Science'),
(3, 'BS Accountancy'),
(4, 'BS Computer Science'),
(5, 'BS Electronics Engineering'),
(6, 'BS Nursing'),
(7, 'BS Mechanical Engineering'),
(8, 'BS Education'),
(9, 'BS Information Technology'),
(10, 'BS Electronics Engineering');

-- ==========================
-- Scholarships
-- ==========================

INSERT IGNORE INTO scholarships
(
    title,
    description,
    education_level,
    scholarship_type,
    minimum_gwa,
    requirements,
    deadline,
    website_url
)
VALUES
(
    'FEU Academic Excellence Scholarship',
    'Academic scholarship for outstanding FEU students',
    'College',
    'Academic',
    85,
    'General weighted average of at least 85%',
    '2026-12-31',
    'https://www.feu.edu.ph/admissions/'
),

(
    'UP Diliman Computer Science Scholarship',
    'Full scholarship for CS students at UP Diliman',
    'College',
    'Government',
    85,
    'Must pass the UP Diliman entrance exam',
    '2027-01-15',
    'https://ac.upd.edu.ph/index.php/academics/tuition-and-financing/2346-university-scholarships-grants'
),

(
    'ADMU Loyola Schools Merit Scholarship',
    'Merit-based scholarship for Ateneo students',
    'College',
    'Private',
    90,
    'Minimum 90% average, interview required',
    '2026-11-30',
    'https://www.ateneo.edu/college/scholarships'
),

(
    'DLSU Science and Technology Scholarship',
    'STEM scholarship from De La Salle University',
    'College',
    'Academic',
    90,
    'Dean''s List standing, no failing grades',
    '2026-12-15',
    'https://www.dlsu.edu.ph/scholarships'
),

(
    'UST College Scholarship Program',
    'University of Santo Tomas scholarship for deserving students',
    'College',
    'Needs-Based',
    85,
    'Proof of financial need, 85% general average',
    '2027-02-28',
    'https://www.ust.edu.ph/scholarships'
),

(
    'NU Academic Grant',
    'Academic assistance for National University students',
    'College',
    'Financial Assistance',
    0,
    'No GPA requirement, family income below 200k',
    '2026-10-31',
    'https://national-u.edu.ph/scholarships'
),

(
    'Adamson University Engineering Scholarship',
    'Scholarship for engineering students at Adamson',
    'College',
    'Academic',
    85,
    'Minimum 88% in math and science subjects',
    '2027-03-15',
    'https://www.adamson.edu.ph/v1?page=oia-oscholarship'
),

(
    'UE Athletic Scholarship Program',
    'Sports scholarship for University of the East',
    'College',
    'Athletic',
    0,
    'Must be varsity player in any sport',
    '2026-09-30',
    'https://www.ue.edu.ph/mla/scholarships-grants-for-college/'
),

(
    'TIP Technology Scholarship',
    'Scholarship for TIP students excelling in technology',
    'College',
    'Merit',
    85,
    'Portfolio of projects required',
    '2026-11-15',
    'https://tip.edu.ph/be-a-tip-ian/tip-scholarships'
),

(
    'Mapúa University Engineering Excellence',
    'Engineering scholarship at Mapúa University',
    'College',
    'Private',
    95,
    'Minimum 95% average, entrance exam required',
    '2027-01-31',
    'https://www.mapua.edu.ph/pages/admissions/mapua-scholarships'
);

-- ==========================
-- Scholarship Eligibility
-- ==========================

INSERT IGNORE INTO scholarship_eligibility
(
    scholarship_id,
    university_id,
    college_id,
    course_id
)
VALUES
(1,1,1,1),      -- FEU - BS Information Technology
(2,2,2,2),      -- UP Diliman - BS Computer Science
(3,3,3,3),      -- Ateneo - BS Accountancy
(4,4,4,4),      -- DLSU - BS Computer Science
(5,5,5,5),      -- UST - BS Electronics Engineering
(6,6,6,6),      -- NU - BS Nursing
(7,7,7,7),      -- Adamson - BS Mechanical Engineering
(8,8,8,8),      -- UE - BS Education
(9,9,9,9),      -- TIP - BS Information Technology
(10,10,10,10);  -- Mapúa - BS Electronics Engineering

-- ==========================
-- Admin Account
-- ==========================

INSERT IGNORE INTO admins
(
    username,
    password
)
VALUES
(
    'admin',
    '$2y$10$NmZLEHFoM23/BlGAmkhIQenWu/i5tpI/vCr8kxqQtGFudZedEgkz2'
);