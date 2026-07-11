-- ===========================================
-- IskolarHub Seed Data
-- Uses INSERT IGNORE to avoid duplicate entries
-- ===========================================

USE iskolarhub;

-- ==========================
-- Universities
-- ==========================

INSERT IGNORE INTO universities (university_name) VALUES
('Far Eastern University'),
('University of the Philippines'),
('Ateneo de Manila University'),
('De La Salle University'),
('University of Santo Tomas'),
('National University'),
('Adamson University'),
('University of the East');

-- ==========================
-- Colleges and Courses
-- ==========================

-- FEU
INSERT IGNORE INTO colleges (university_id, college_name) VALUES
(1,'Institute of Accounts, Business and Finance'),
(1,'Institute of Architecture and Fine Arts'),
(1,'Institute of Arts and Sciences'),
(1,'Institute of Education'),
(1,'Institute of Health Sciences and Nursing'),
(1,'Institute of Tourism and Hotel Management'),
(1,'Institute of Technology');

INSERT IGNORE INTO courses (college_id, course_name) VALUES
(1,'BS Accountancy'),
(1,'BS Accounting Information System'),
(1,'BS Internal Auditing'),
(1,'BS Business Administration - Financial Management'),
(1,'BS Business Administration - Marketing Management'),
(1,'BS Business Administration - Human Resource Management'),
(1,'BS Business Administration - Business Economics');

INSERT IGNORE INTO courses (college_id, course_name) VALUES
(2,'BS Architecture'),
(2,'Bachelor of Fine Arts');

INSERT IGNORE INTO courses (college_id, course_name) VALUES
(3,'BA Communication'),
(3,'BA English Language Studies'),
(3,'BA International Studies'),
(3,'BA Political Science'),
(3,'BA Psychology'),
(3,'BS Psychology');

INSERT IGNORE INTO courses (college_id, course_name) VALUES
(4,'Bachelor of Elementary Education'),
(4,'Bachelor of Secondary Education'),
(4,'Bachelor of Physical Education'),
(4,'Bachelor of Early Childhood Education'),
(4,'Bachelor of Special Needs Education');

INSERT IGNORE INTO courses (college_id, course_name) VALUES
(5,'BS Nursing'),
(5,'BS Medical Technology'),
(5,'BS Pharmacy');

INSERT IGNORE INTO courses (college_id, course_name) VALUES
(6,'BS Hospitality Management'),
(6,'BS Tourism Management');

INSERT IGNORE INTO courses (college_id, course_name) VALUES
(7,'BS Computer Science'),
(7,'BS Information Technology'),
(7,'BS Civil Engineering'),
(7,'BS Mechanical Engineering'),
(7,'BS Electrical Engineering'),
(7,'BS Electronics Engineering');

-- UPD
INSERT IGNORE INTO colleges (university_id, college_name) VALUES
(2, 'Cesar E.A. Virata School of Business'),
(2, 'College of Engineering'),
(2, 'College of Science'),
(2, 'College of Social Sciences and Philosophy'),
(2, 'College of Arts and Letters'),
(2, 'College of Education'),
(2, 'College of Mass Communication'),
(2, 'School of Economics'),
(2, 'National College of Public Administration and Governance'),
(2, 'Asian Institute of Tourism');

INSERT IGNORE INTO courses (college_id, course_name) VALUES
(8, 'BS Business Administration'),
(8, 'BS Business Administration and Accountancy');

INSERT IGNORE INTO courses (college_id, course_name) VALUES
(9, 'BS Chemical Engineering'),
(9, 'BS Civil Engineering'),
(9, 'BS Computer Engineering'),
(9, 'BS Computer Science'),
(9, 'BS Electrical Engineering'),
(9, 'BS Electronics Engineering'),
(9, 'BS Geodetic Engineering'),
(9, 'BS Industrial Engineering'),
(9, 'BS Materials Engineering'),
(9, 'BS Mechanical Engineering'),
(9, 'BS Metallurgical Engineering'),
(9, 'BS Mining Engineering');

INSERT IGNORE INTO courses (college_id, course_name) VALUES
(10, 'BS Biology'),
(10, 'BS Chemistry'),
(10, 'BS Geology'),
(10, 'BS Mathematics'),
(10, 'BS Molecular Biology and Biotechnology'),
(10, 'BS Physics'),
(10, 'BS Applied Physics'),
(10, 'BS Statistics');

INSERT IGNORE INTO courses (college_id, course_name) VALUES
(11, 'BA Anthropology'),
(11, 'BA Geography'),
(11, 'BA History'),
(11, 'BA Linguistics'),
(11, 'BA Philosophy'),
(11, 'BA Political Science'),
(11, 'BA Sociology'),
(11, 'BA Psychology'),
(11, 'BS Psychology');

INSERT IGNORE INTO courses (college_id, course_name) VALUES
(12, 'BA Art Studies'),
(12, 'BA Comparative Literature'),
(12, 'BA Creative Writing'),
(12, 'BA English Studies'),
(12, 'BA European Languages'),
(12, 'BA Filipino'),
(12, 'BA Malikhaing Pagsulat sa Filipino'),
(12, 'BA Speech Communication'),
(12, 'BA Theatre Arts');

INSERT IGNORE INTO courses (college_id, course_name) VALUES
(13, 'Bachelor of Elementary Education'),
(13, 'Bachelor of Secondary Education');

INSERT IGNORE INTO courses (college_id, course_name) VALUES
(14, 'BA Broadcast Communication'),
(14, 'BA Communication Research'),
(14, 'BA Film'),
(14, 'BA Journalism');

INSERT IGNORE INTO courses (college_id, course_name) VALUES
(15, 'BS Economics'),
(15, 'BS Business Economics');

INSERT IGNORE INTO courses (college_id, course_name) VALUES
(16, 'Bachelor of Public Administration');

INSERT IGNORE INTO courses (college_id, course_name) VALUES
(17, 'BS Tourism');


-- ADMU
INSERT IGNORE INTO colleges (university_id, college_name) VALUES
(3, 'John Gokongwei School of Management'),
(3, 'School of Science and Engineering'),
(3, 'School of Humanities'),
(3, 'School of Social Sciences');

INSERT IGNORE INTO courses (college_id, course_name) VALUES
(18, 'BS Management'),
(18, 'BS Management (Honors)'),
(18, 'BS Management Engineering'),
(18, 'BS Management of Applied Chemistry'),
(18, 'BS Communications Technology Management'),
(18, 'BS Information Technology Entrepreneurship'),
(18, 'BS Legal Management');

INSERT IGNORE INTO courses (college_id, course_name) VALUES
(19, 'BS Biology'),
(19, 'BS Life Sciences'),
(19, 'BS Environmental Science'),
(19, 'BS Chemistry'),
(19, 'BS Chemistry - BS Materials Science and Engineering'),
(19, 'BS Computer Science'),
(19, 'BS Computer Science - BS Digital Game Design and Development'),
(19, 'BS Management Information Systems'),
(19, 'BS Mathematics'),
(19, 'BS Applied Mathematics - Master in Data Science'),
(19, 'BS Physics'),
(19, 'BS Health Sciences');

INSERT IGNORE INTO courses (college_id, course_name) VALUES
(20, 'Bachelor of Fine Arts - Art Management'),
(20, 'Bachelor of Fine Arts - Creative Writing'),
(20, 'Bachelor of Fine Arts - Information Design'),
(20, 'Bachelor of Fine Arts - Theater Arts'),
(20, 'BA Humanities'),
(20, 'BA Interdisciplinary Studies'),
(20, 'BA Literature (English)'),
(20, 'BA Panitikan (Filipino)'),
(20, 'BA Philosophy');

INSERT IGNORE INTO courses (college_id, course_name) VALUES
(21, 'BA Communication'),
(21, 'BA Development Studies'),
(21, 'BA Economics'),
(21, 'BA History'),
(21, 'BA Diplomacy and International Relations with Specialization in East Asian Studies'),
(21, 'BA Political Science'),
(21, 'BA European Studies'),
(21, 'BA Psychology'),
(21, 'BS Psychology'),
(21, 'BA Social Sciences');


-- DLSU
INSERT IGNORE INTO colleges (university_id, college_name) VALUES
(4, 'Ramon V. Del Rosario College of Business'),
(4, 'Gokongwei College of Engineering'),
(4, 'College of Science'),
(4, 'College of Computer Studies'),
(4, 'College of Liberal Arts'),
(4, 'Brother Andrew Gonzalez FSC College of Education'),
(4, 'School of Economics');

INSERT IGNORE INTO courses (college_id, course_name) VALUES
(22, 'BS Accountancy'),
(22, 'BS Business Management'),
(22, 'BS Entrepreneurship'),
(22, 'BS Interdisciplinary Business Studies'),
(22, 'BS Management of Financial Institutions'),
(22, 'BS Marketing Management'),
(22, 'BS Legal Management');

INSERT IGNORE INTO courses (college_id, course_name) VALUES
(23, 'BS Chemical Engineering'),
(23, 'BS Civil Engineering'),
(23, 'BS Computer Engineering'),
(23, 'BS Electronics Engineering'),
(23, 'BS Electrical Engineering'),
(23, 'BS Industrial Engineering'),
(23, 'BS Mechanical Engineering'),
(23, 'BS Manufacturing Engineering and Management');

INSERT IGNORE INTO courses (college_id, course_name) VALUES
(24, 'BS Biochemistry'),
(24, 'BS Biology'),
(24, 'BS Chemistry'),
(24, 'BS Mathematics'),
(24, 'BS Statistics'),
(24, 'BS Physics'),
(24, 'BS Pre-Med Physics');

INSERT IGNORE INTO courses (college_id, course_name) VALUES
(25, 'BS Computer Science'),
(25, 'BS Computer Science major in Software Technology'),
(25, 'BS Computer Science major in Network and Information Security'),
(25, 'BS Information Technology'),
(25, 'BS Information Systems');

INSERT IGNORE INTO courses (college_id, course_name) VALUES
(26, 'BA Communication Arts'),
(26, 'BA Organizational Communication'),
(26, 'BA International Studies'),
(26, 'BA Political Science'),
(26, 'BA Philippine Studies'),
(26, 'BA History'),
(26, 'BA Literature'),
(26, 'BA Philosophy'),
(26, 'BA Psychology'),
(26, 'BS Psychology');

INSERT IGNORE INTO courses (college_id, course_name) VALUES
(27, 'Bachelor of Elementary Education'),
(27, 'Bachelor of Secondary Education'),
(27, 'BS Early Childhood Education'),
(27, 'BS Special Needs Education');

INSERT IGNORE INTO courses (college_id, course_name) VALUES
(28, 'AB Economics'),
(28, 'BS Applied Economics');

-- UST
INSERT IGNORE INTO colleges (university_id, college_name) VALUES
(5, 'Faculty of Arts and Letters'),
(5, 'College of Science'),
(5, 'Faculty of Engineering'),
(5, 'Faculty of Pharmacy'),
(5, 'College of Commerce and Business Administration'),
(5, 'College of Architecture'),
(5, 'College of Nursing'),
(5, 'College of Rehabilitation Sciences'),
(5, 'College of Education'),
(5, 'College of Fine Arts and Design'),
(5, 'Institute of Information and Computing Sciences'),
(5, 'College of Tourism and Hospitality Management');

INSERT IGNORE INTO courses (college_id, course_name) VALUES
(29, 'BA Communication'),
(29, 'BA Journalism'),
(29, 'BA Literature'),
(29, 'BA Philosophy'),
(29, 'BA Political Science'),
(29, 'BA Legal Management'),
(29, 'BA Behavioral Science'),
(29, 'BA Sociology'),
(29, 'BA History'),
(29, 'BA English Language Studies'),
(29, 'BA Asian Studies');

INSERT IGNORE INTO courses (college_id, course_name) VALUES
(30, 'BS Applied Mathematics'),
(30, 'BS Applied Physics'),
(30, 'BS Biology'),
(30, 'BS Chemistry'),
(30, 'BS Microbiology'),
(30, 'BS Psychology');

INSERT IGNORE INTO courses (college_id, course_name) VALUES
(31, 'BS Chemical Engineering'),
(31, 'BS Civil Engineering'),
(31, 'BS Electrical Engineering'),
(31, 'BS Electronics Engineering'),
(31, 'BS Industrial Engineering'),
(31, 'BS Mechanical Engineering');

INSERT IGNORE INTO courses (college_id, course_name) VALUES
(32, 'BS Pharmacy'),
(32, 'BS Medical Technology'),
(32, 'BS Biochemistry');

INSERT IGNORE INTO courses (college_id, course_name) VALUES
(33, 'BS Accountancy'),
(33, 'BS Accounting Information System'),
(33, 'BS Business Administration major in Financial Management'),
(33, 'BS Business Administration major in Marketing Management'),
(33, 'BS Business Administration major in Human Resource Management');

INSERT IGNORE INTO courses (college_id, course_name) VALUES
(34, 'BS Architecture');

INSERT IGNORE INTO courses (college_id, course_name) VALUES
(35, 'BS Nursing');

INSERT IGNORE INTO courses (college_id, course_name) VALUES
(36, 'BS Physical Therapy'),
(36, 'BS Occupational Therapy'),
(36, 'BS Speech-Language Pathology'),
(36, 'BS Sports Science');

INSERT IGNORE INTO courses (college_id, course_name) VALUES
(37, 'Bachelor of Elementary Education'),
(37, 'Bachelor of Secondary Education'),
(37, 'BS Nutrition and Dietetics'),
(37, 'Bachelor of Special Needs Education');

INSERT IGNORE INTO courses (college_id, course_name) VALUES
(38, 'BFA Industrial Design'),
(38, 'BFA Interior Design'),
(38, 'BFA Painting'),
(38, 'BFA Advertising Arts');

INSERT IGNORE INTO courses (college_id, course_name) VALUES
(39, 'BS Computer Science'),
(39, 'BS Information Technology'),
(39, 'BS Information Systems');

INSERT IGNORE INTO courses (college_id, course_name) VALUES
(40, 'BS Hospitality Management'),
(40, 'BS Tourism Management');

-- NU
INSERT IGNORE INTO colleges (university_id, college_name) VALUES
(6, 'College of Business and Financial Options'),
(6, 'College of Engineering'),
(6, 'College of Computing and Information Technologies'),
(6, 'College of Allied Health'),
(6, 'College of Education, Arts and Sciences'),
(6, 'College of Architecture');

INSERT IGNORE INTO courses (college_id, course_name) VALUES
(41, 'BS Accountancy'),
(41, 'BS Business Administration major in Financial Management'),
(41, 'BS Business Administration major in Marketing Management'),
(41, 'BS Tourism Management'),
(41, 'BS Hospitality Management');

INSERT IGNORE INTO courses (college_id, course_name) VALUES
(42, 'BS Civil Engineering'),
(42, 'BS Computer Engineering'),
(42, 'BS Electrical Engineering'),
(42, 'BS Electronics Engineering'),
(42, 'BS Mechanical Engineering'),
(42, 'BS Sanitary Engineering');

INSERT IGNORE INTO courses (college_id, course_name) VALUES
(43, 'BS Computer Science'),
(43, 'BS Information Technology'),
(43, 'BS Entertainment and Multimedia Computing');

INSERT IGNORE INTO courses (college_id, course_name) VALUES
(44, 'BS Nursing'),
(44, 'BS Medical Technology'),
(44, 'BS Pharmacy');

INSERT IGNORE INTO courses (college_id, course_name) VALUES
(45, 'BA Communication'),
(45, 'BS Psychology'),
(45, 'Bachelor of Elementary Education'),
(45, 'Bachelor of Secondary Education'),
(45, 'Bachelor of Physical Education');

INSERT IGNORE INTO courses (college_id, course_name) VALUES
(46, 'BS Architecture');

-- Adamson University
INSERT IGNORE INTO colleges (university_id, college_name) VALUES
(7, 'College of Business Administration'),
(7, 'College of Engineering'),
(7, 'College of Science'),
(7, 'College of Computing and Information Technologies'),
(7, 'College of Nursing'),
(7, 'College of Pharmacy'),
(7, 'College of Education and Liberal Arts'),
(7, 'College of Architecture');

INSERT IGNORE INTO courses (college_id, course_name) VALUES
(47, 'BS Accountancy'),
(47, 'BS Customs Administration'),
(47, 'BS Hospitality Management'),
(47, 'BS Tourism Management'),
(47, 'BS Business Administration major in Financial Management'),
(47, 'BS Business Administration major in Marketing Management'),
(47, 'BS Business Administration major in Operations Management');

INSERT IGNORE INTO courses (college_id, course_name) VALUES
(48, 'BS Chemical Engineering'),
(48, 'BS Civil Engineering'),
(48, 'BS Computer Engineering'),
(48, 'BS Electrical Engineering'),
(48, 'BS Electronics Engineering'),
(48, 'BS Industrial Engineering'),
(48, 'BS Mechanical Engineering'),
(48, 'BS Mining Engineering');

INSERT IGNORE INTO courses (college_id, course_name) VALUES
(49, 'BS Biology'),
(49, 'BS Chemistry'),
(49, 'BS Psychology');

INSERT IGNORE INTO courses (college_id, course_name) VALUES
(50, 'BS Computer Science'),
(50, 'BS Information Technology'),
(50, 'BS Information Systems');

INSERT IGNORE INTO courses (college_id, course_name) VALUES
(51, 'BS Nursing');

INSERT IGNORE INTO courses (college_id, course_name) VALUES
(52, 'BS Pharmacy');

INSERT IGNORE INTO courses (college_id, course_name) VALUES
(53, 'BA Communication'),
(53, 'BA Political Science'),
(53, 'Bachelor of Elementary Education'),
(53, 'Bachelor of Secondary Education'),
(53, 'Bachelor of Physical Education');

INSERT IGNORE INTO courses (college_id, course_name) VALUES
(54, 'BS Architecture');

-- University of the East
INSERT IGNORE INTO colleges (university_id, college_name) VALUES
(8, 'College of Business Administration'),
(8, 'College of Engineering'),
(8, 'College of Computer Studies and Systems'),
(8, 'College of Dentistry'),
(8, 'College of Arts and Sciences'),
(8, 'College of Education');

INSERT IGNORE INTO courses (college_id, course_name) VALUES
(55, 'BS Accountancy'),
(55, 'BS Accounting Information System'),
(55, 'BS Business Administration major in Financial Management'),
(55, 'BS Business Administration major in Marketing Management'),
(55, 'BS Business Administration major in Business Economics'),
(55, 'BS Hospitality Management'),
(55, 'BS Tourism Management');

INSERT IGNORE INTO courses (college_id, course_name) VALUES
(56, 'BS Civil Engineering'),
(56, 'BS Computer Engineering'),
(56, 'BS Electrical Engineering'),
(56, 'BS Electronics Engineering'),
(56, 'BS Mechanical Engineering');

INSERT IGNORE INTO courses (college_id, course_name) VALUES
(57, 'BS Computer Science'),
(57, 'BS Information Technology'),
(57, 'BS Entertainment and Multimedia Computing');

INSERT IGNORE INTO courses (college_id, course_name) VALUES
(58, 'Doctor of Dental Medicine');

INSERT IGNORE INTO courses (college_id, course_name) VALUES
(59, 'BA Communication'),
(59, 'BA Journalism'),
(59, 'BA Legal Management'),
(59, 'BA Political Science'),
(59, 'BS Biology'),
(59, 'BS Psychology');

INSERT IGNORE INTO courses (college_id, course_name) VALUES
(60, 'Bachelor of Elementary Education'),
(60, 'Bachelor of Secondary Education'),
(60, 'Bachelor of Special Needs Education'),
(60, 'BS Nutrition and Dietetics');

-- ==========================
-- Scholarships
-- ==========================

INSERT IGNORE INTO scholarships
(
    title,
    description,
    university,
    course,
    scholarship_type,
    minimum_gwa,
    requirements,
    deadline,
    official_scholarship_url
)
VALUES

-- ==========================================
-- Far Eastern University
-- ==========================================

(
'Entrance Scholarship',
'Awarded to 1st year exam takers who meet the eligibility requirements and will enroll during the 1st semester of the academic year.',
'Far Eastern University',
'All Programs',
'Merit',
88,
'Filipino citizen of good moral character; at least superior rating in FEU-CAT; HS GWA of at least 88.',
NULL,
'https://www.feu.edu.ph/cost-and-aid/scholarship-grants/entrance-scholarship/'
),

(
'Teacher Scholarship Program',
'Awarded to 1st year exam takers who meet the eligibility requirements and will enroll in the identified degree programs of the Institute of Education during the 1st semester of the academic year.',
'Far Eastern University',
'Identified Degree Programs',
'Merit',
90,
'Meet the eligibility requirements and enroll in the identified degree programs of the Institute of Education.',
NULL,
'https://www.feu.edu.ph/cost-and-aid/scholarship-grants/teacher-scholarship-program/'
),

(
'Long-Term Educational Assistance Program (LEAP)',
'Long-term education assistance program (LEAP) is awarded to students who are in dire need.',
'Far Eastern University',
'All Programs',
'Need-Based',
80,
'Filipino citizen of good moral character; physically and mentally fit; family income not more than ₱100,000 per year; FEU-CAT results of at least average rating; underwent FEU qualifying financial evaluation.',
NULL,
'https://www.feu.edu.ph/cost-and-aid/scholarship-grants/leap-long-term-educational-assistance-program/'
),

(
'Nicanor Reyes Science Scholarship Program (NRSSP)',
'Nicanor Reyes Science Scholarship Program (NRSSP) is awarded to students from the identified science high schools whose FEU-CAT percentile score is superior with a HS GWA of at least 88 and an annual family income not exceeding 360,000.00 per year.',
'Far Eastern University',
'Science Programs',
'Merit',
88,
'Filipino citizen of good moral character; FEU-CAT percentile score of Superior; HS GWA of at least 88.',
NULL,
'https://www.feu.edu.ph/cost-and-aid/scholarship-grants/nicanor-reyes-science-scholarship-program-nrssp/'
),

(
'Academic Scholarship',
'N/A',
'Far Eastern University',
'All Programs',
'Academic',
90,
'Regular student; QPA of at least 3.20; no grade lower than C+ (2.5); no major offense.',
NULL,
'https://www.feu.edu.ph/academic-scholarship/'
),

(
'FEU Tuition Discount',
'N/A',
'Far Eastern University',
'All Programs',
'Financial Assistance',
85,
'N/A',
NULL,
'https://www.feu.edu.ph/feu-tuition-discount/'
),

(
'FEU PWD Discount',
'N/A',
'Far Eastern University',
'All Programs',
'Financial Assistance',
NULL,
'N/A',
NULL,
'https://www.feu.edu.ph/pwd-discount/'
),

(
'Athletics Scholarship',
'Support talented students who embody the core values of Fortitude, Excellence and Uprightness and help promote the University through sports.',
'Far Eastern University',
'Eligible Programs',
'Service',
80,
'Must qualify under FEU Athletics.',
NULL,
'https://www.feu.edu.ph/cost-and-aid/scholarship-grants/'
),

(
'Cultural Scholarship',
'Support talented students who embody the core values of Fortitude, Excellence and Uprightness and help promote the University through arts and culture.',
'Far Eastern University',
'Eligible Programs',
'Service',
82,
'Must qualify under the FEU Center for the Arts.',
NULL,
'https://www.feu.edu.ph/cost-and-aid/scholarship-grants/'
),

(
'Presidential Decree 577 Scholarship',
'N/A',
'Far Eastern University',
'All Programs',
'Government',
80,
'Must satisfy the requirements under Presidential Decree No. 577.',
NULL,
'https://www.feu.edu.ph/presidential-decree-577-or-p-d-577/'
), -- Added missing comma here

-- ==========================================
-- University of the Philippines Diliman
-- ==========================================

(
'Universal Access to Quality Tertiary Education Act (RA 10931)',
'For SY 2025–2026, all eligible students will be granted free tuition and miscellaneous fees when they enroll in the University of the Philippines, in accordance with the Universal Access to Quality Tertiary Education Act of 2017. (Wikipedia)',
'University of the Philippines Diliman',
'All Programs',
'Government',
NULL,
'Eligible UP students',
NULL,
'https://upd.edu.ph/students/scholarships-and-grants/'
),

(
'Grants-in-Aid Program (GIAP)',
'Financial assistance program administered by the Office of Scholarships and Grants.',
'University of the Philippines Diliman',
'All Programs',
'Need-Based',
2.50,
'N/A',
NULL,
'https://upd.edu.ph/students/scholarships-and-grants/'
),

(
'Tertiary Education Subsidy (TES)',
'Financial assistance program under the Universal Access to Quality Tertiary Education Act.',
'University of the Philippines Diliman',
'All Programs',
'Government',
2.50,
'Must qualify under TES guidelines',
NULL,
'https://upd.edu.ph/students/scholarships-and-grants/'
),

(
'UP Tuition Loan Program',
'Program that allows eligible students to defer payment of tuition and other school fees.',
'University of the Philippines Diliman',
'All Programs',
'Loan',
3.00,
'N/A',
NULL,
'https://upd.edu.ph/students/scholarships-and-grants/'
),

(
'Student Loan Board Programs',
'Loan assistance program administered by the Student Loan Board.',
'University of the Philippines Diliman',
'All Programs',
'Loan',
3.00,
'N/A',
NULL,
'https://upd.edu.ph/students/scholarships-and-grants/'
),

(
'UP Presidential Scholarship',
'Scholarship awarded to students with outstanding academic performance.',
'University of the Philippines Diliman',
'All Programs',
'Academic',
1.45,
'N/A',
NULL,
'https://upd.edu.ph/students/scholarships-and-grants/'
),

(
'UP Presidential Leadership Grant',
'Grant awarded to qualified student leaders.',
'University of the Philippines Diliman',
'All Programs',
'Leadership',
1.75,
'N/A',
NULL,
'https://upd.edu.ph/students/scholarships-and-grants/'
),

(
'UP Oblation Scholarship',
'Scholarship granted to qualified Oblation Scholars.',
'University of the Philippines Diliman',
'All Programs',
'Merit',
1.30,
'Qualified Oblation Scholar',
NULL,
'https://upd.edu.ph/students/scholarships-and-grants/'
),

-- ==========================================
-- Ateneo De Manila University
-- ==========================================

(
'Ateneo Freshman Merit Scholarship',
'The very best applicants to Ateneo de Manila University are awarded the Ateneo Freshman Merit Scholarship.',
'Ateneo de Manila University',
'All Undergraduate Programs',
'Merit',
93,
'Awarded based on ACET performance, high school record, and leadership potential.',
NULL,
'https://www.ateneo.edu/college/scholarships/programs'
),

(
'Director''s List Scholarship',
'Awarded to outstanding applicants to Ateneo de Manila University.',
'Ateneo de Manila University',
'All Undergraduate Programs',
'Merit',
92,
'Outstanding ACET performance and distinguished academic and co-curricular achievements.',
NULL,
'https://www.ateneo.edu/college/scholarships/programs'
),

(
'Financial Aid Scholarship',
'Financial Aid scholarships are awarded to students in all degree programs of the University and are selected on the basis of financial need, intellectual ability, consistent academic performance, service to the community, and potential for greater service. (Wikipedia)',
'Ateneo de Manila University',
'All Undergraduate Programs',
'Need-Based',
85,
'Financial need, intellectual ability, consistent academic performance, service to the community, and potential for greater service.',
NULL,
'https://www.ateneo.edu/college/scholarships/programs'
),

(
'Magis Scholarship',
'This all-expenses-paid scholarship is part of the University''s commitment to make Ateneo education accessible to more students without the economic means to do so. (Wikipedia)',
'Ateneo de Manila University',
'All Undergraduate Programs',
'Need-Based',
90,
'Open only to Financial Aid scholars who belong to the most financially disadvantaged sector.',
NULL,
'https://www.ateneo.edu/college/scholarships/programs'
),

(
'Athletic Scholarship',
'Awarded to student-athletes who have excelled in sports and academics. (Wikipedia)',
'Ateneo de Manila University',
'All Undergraduate Programs',
'Athletic',
80,
'Outstanding athletic ability, awards in a specific sport, and recommendation of the Ateneo Coach and Program Head.',
NULL,
'https://www.ateneo.edu/college/scholarships/programs'
),

(
'Finster Scholarship',
'Awarded to deserving students who demonstrate financial need and academic excellence.',
'Ateneo de Manila University',
'All Undergraduate Programs',
'Need-Based',
88,
'N/A',
NULL,
'https://www.ateneo.edu/college/scholarships/programs'
),

(
'San Ignacio Scholarship',
'Scholarship for qualified undergraduate students based on the University''s scholarship policies.',
'Ateneo de Manila University',
'All Undergraduate Programs',
'Merit',
90,
'N/A',
NULL,
'https://www.ateneo.edu/college/scholarships/programs'
), 

-- ==========================================
-- De La Salle University
-- ==========================================

(
'Archer Achiever Scholarship',
'Awarded to the Top 100 examinees of the De La Salle College Admission Test (DCAT). (Wikipedia)',
'De La Salle University',
'All Undergraduate Programs',
'Merit',
96,
'Must be among the Top 100 DCAT examinees.',
NULL,
'https://www.dlsu.edu.ph/scholarship/archer-achiever-scholarship/'
),

(
'Br. Andrew Gonzalez Academic Scholarship',
'High school valedictorians and salutatorians of De La Salle Philippines schools are automatically exempted from paying tuition and fees. (Wikipedia)',
'De La Salle University',
'All Undergraduate Programs',
'Academic',
95,
'Must be the valedictorian or salutatorian of a De La Salle Philippines school.',
NULL,
'https://www.dlsu.edu.ph/scholarship/br-andrew-gonzalez-academic-scholarship/'
),

(
'St. La Salle Financial Assistance Grant',
'Financial assistance for qualified students with demonstrated financial need.',
'De La Salle University',
'All Undergraduate Programs',
'Need-Based',
85,
'Subject to financial need assessment and scholarship qualifications.',
NULL,
'https://www.dlsu.edu.ph/scholarship/st-la-salle-financial-assistance-grant-tdsol/'
),

(
'Gokongwei Grant for Excellence',
'Scholarship awarded to outstanding students enrolled in identified degree programs.',
'De La Salle University',
'All Undergraduate Programs',
'Merit',
92,
'Must satisfy the scholarship qualifications prescribed by the University.',
NULL,
'https://www.dlsu.edu.ph/scholarship/gokongwei-grants/'
),

(
'Vaugirard Scholarship Program',
'Scholarship program for qualified undergraduate students.',
'De La Salle University',
'All Undergraduate Programs',
'Merit',
90,
'Must meet the scholarship eligibility requirements.',
NULL,
'https://www.dlsu.edu.ph/scholarship/vaugirard-scholarship-program/'
),

-- ==========================================
-- University of Santo Tomas
-- ==========================================

(
'Santo Tomas Scholarship',
'This scholarship, named after the Patron Saint of the University, is given to students with excellent academic performance.',
'University of Santo Tomas',
'All Programs',
'Academic',
92,
'N/A',
NULL,
'https://ofad.ust.edu.ph/scholarships/'
),

(
'San Martin de Porres Scholarship',
'This scholarship is given to students who are in need of financial assistance and are willing to render assistantship hours in the University.',
'University of Santo Tomas',
'All Programs',
'Need-Based',
85,
'Must render assistantship hours.',
NULL,
'https://ofad.ust.edu.ph/scholarships/'
),

(
'Santo Domingo de Guzman Scholarship',
'This scholarship, named after the Founder of the Order of Preachers, is given to students who excel in arts, music, and sports.',
'University of Santo Tomas',
'All Programs',
'Talent-Based',
83,
'Excellence in arts, music, or sports.',
NULL,
'https://ofad.ust.edu.ph/scholarships/'
),

(
'San Lorenzo Ruiz Scholarship',
'This scholarship, named after the first Filipino saint, is extended to deserving students in need of financial assistance.',
'University of Santo Tomas',
'All Programs',
'Need-Based',
83,
'N/A',
NULL,
'https://ofad.ust.edu.ph/scholarships/'
),

(
'Student Assistance Program (STAP)',
'N/A',
'University of Santo Tomas',
'All Programs',
'Student Assistantship',
80,
'N/A',
NULL,
'https://ofad.ust.edu.ph/scholarships/'
), -- Added missing comma here

-- ==========================================
-- National University
-- ==========================================

(
'NU Academic Scholarship',
'Scholarship awarded to students with outstanding academic performance.',
'National University',
'All Programs',
'Academic',
90,
'Must meet the University''s academic requirements.',
NULL,
'https://www.chedscholar.org/national-university-nu-scholarship/'
),

(
'NU President''s Scholarship',
'Scholarship granted to qualified students with exceptional academic achievements.',
'National University',
'All Programs',
'Merit',
95,
'Must satisfy the University''s scholarship qualifications.',
NULL,
'https://www.chedscholar.org/national-university-nu-scholarship/'
),

(
'SM Scholarship',
'Scholarship program sponsored by the SM Foundation for qualified students.',
'National University',
'All Programs',
'Government/Private',
90,
'Must meet SM Foundation scholarship requirements.',
NULL,
'https://www.chedscholar.org/national-university-nu-scholarship/'
),

(
'Athletic Scholarship',
'Scholarship for students who excel in sports and represent the University in athletic competitions.',
'National University',
'All Programs',
'Athletic',
80,
'Must qualify as a varsity athlete.',
NULL,
'https://www.chedscholar.org/national-university-nu-scholarship/'
),

(
'Performing Arts Scholarship',
'Scholarship for students with exceptional talents in music, dance, theater, and other performing arts.',
'National University',
'All Programs',
'Talent-Based',
82,
'Must pass the talent screening and scholarship evaluation.',
NULL,
'https://www.chedscholar.org/national-university-nu-scholarship/'
),

(
'Student Assistantship Program',
'Financial assistance through part-time work opportunities within the University.',
'National University',
'All Programs',
'Student Assistantship',
80,
'Must qualify under the University''s student assistantship program.',
NULL,
'https://www.chedscholar.org/national-university-nu-scholarship/'
),

(
'CHED Scholarship',
'Government scholarship administered by the Commission on Higher Education (CHED).',
'National University',
'All Programs',
'Government',
90,
'Must satisfy CHED scholarship requirements.',
NULL,
'https://www.chedscholar.org/national-university-nu-scholarship/'
),

(
'Tertiary Education Subsidy (TES)',
'Financial assistance under the Universal Access to Quality Tertiary Education Act.',
'National University',
'All Programs',
'Government',
85,
'Must qualify under TES guidelines.',
NULL,
'https://www.chedscholar.org/national-university-nu-scholarship/'
), -- Added missing comma here

-- ==========================================
-- Adamson University
-- ==========================================

(
'Academic Scholarship',
'Academic scholarships are awarded to students who demonstrate excellent academic performance.',
'Adamson University',
'All Programs',
'Academic',
90,
'Excellent academic performance.',
NULL,
'https://www.chedscholar.org/adamson-university-scholarships/'
),

(
'Entrance Scholarship',
'Entrance scholarships are granted to qualified incoming freshmen based on academic excellence.',
'Adamson University',
'All Programs',
'Merit',
88,
'Qualified incoming freshmen.',
NULL,
'https://www.chedscholar.org/adamson-university-scholarships/'
),

(
'Athletic Scholarship',
'Athletic scholarships are available to students who excel in sports and represent the University in competitions.',
'Adamson University',
'All Programs',
'Athletic',
80,
'Must qualify as a varsity athlete.',
NULL,
'https://www.chedscholar.org/adamson-university-scholarships/'
),

(
'Financial Assistance Program',
'Financial assistance is available for deserving students with financial need.',
'Adamson University',
'All Programs',
'Need-Based',
82,
'Must demonstrate financial need.',
NULL,
'https://www.chedscholar.org/adamson-university-scholarships/'
),

(
'Student Assistantship Program',
'Student assistantship provides financial assistance through part-time work within the University.',
'Adamson University',
'All Programs',
'Student Assistantship',
80,
'Must qualify under the University''s student assistantship program.',
NULL,
'https://www.chedscholar.org/adamson-university-scholarships/'
),

(
'Religious and Community Service Scholarship',
'Scholarships are available for students actively involved in religious and community service.',
'Adamson University',
'All Programs',
'Service',
82,
'Good moral character and active participation in religious or community service.',
NULL,
'https://www.chedscholar.org/adamson-university-scholarships/'
), -- Added missing comma here

-- ==========================================
-- University of the East
-- ==========================================

(
'UE-Tan Yan Kee Foundation, Inc. Scholarship',
'Awarded to qualified incoming freshmen who intend to pursue a degree in selected degree programs/courses.',
'University of the East',
'Dentistry',
'Merit',
90,
'Qualified incoming freshmen enrolled in selected degree programs.',
NULL,
'https://www.ue.edu.ph/mla/https-www-ue-edu-ph-mla-scholarships-grants-for-college/'
),

(
'Grade 12 Graduates with Academic Excellence Award',
'Awarded to Grade 12 graduates with Highest Honors, High Honors, or Honors.',
'University of the East',
'All Programs',
'Academic',
95,
'Grade 12 graduate with academic honors.',
NULL,
'https://www.ue.edu.ph/mla/https-www-ue-edu-ph-mla-scholarships-grants-for-college/'
),

(
'University Scholarship',
'Awarded for one semester, renewable every semester, to UE undergraduate students with a Grade Point Average (GPA) of 1.0000 to 1.2500.',
'University of the East',
'All Programs',
'Academic',
1.25,
'UE undergraduate student with a GPA of 1.0000–1.2500.',
NULL,
'https://www.ue.edu.ph/mla/https-www-ue-edu-ph-mla-scholarships-grants-for-college/'
),

(
'College Scholarship',
'Awarded for one semester, renewable every semester, to UE undergraduate students with a Grade Point Average (GPA) of 1.2501 to 1.5000.',
'University of the East',
'All Programs',
'Academic',
1.50,
'UE undergraduate student with a GPA of 1.2501–1.5000.',
NULL,
'https://www.ue.edu.ph/mla/https-www-ue-edu-ph-mla-scholarships-grants-for-college/'
),

(
'Athletic Service Grant',
'Awarded to students with outstanding skills, aptitude, and ability in sports; the grantee must be of UAAP caliber or qualify for membership in the UE Pep Squad.',
'University of the East',
'All Programs',
'Athletic',
80,
'Outstanding athletic ability; UAAP caliber or qualified for the UE Pep Squad.',
NULL,
'https://www.ue.edu.ph/mla/https-www-ue-edu-ph-mla-scholarships-grants-for-college/'
),

(
'Cultural Service Grant',
'Awarded to students with artistic talent who qualify for membership in the UE Band, UE Chorale, UE Drama Company, or UE Silanganan Dance Troupe.',
'University of the East',
'All Programs',
'Talent-Based',
82,
'Must qualify for membership in an official UE cultural organization.',
NULL,
'https://www.ue.edu.ph/mla/https-www-ue-edu-ph-mla-scholarships-grants-for-college/'
),

(
'Student Assistantship Program',
'Provides financial assistance to deserving students through part-time work assignments in various University offices.',
'University of the East',
'All Programs',
'Student Assistantship',
80,
'Must qualify under the University''s Student Assistantship Program.',
NULL,
'https://www.ue.edu.ph/mla/https-www-ue-edu-ph-mla-scholarships-grants-for-college/'
),

(
'UE Alumni Association Scholarship',
'Scholarship grant provided by the UE Alumni Association for qualified students.',
'University of the East',
'All Programs',
'Alumni',
85,
'Must satisfy the scholarship qualifications set by the UE Alumni Association.',
NULL,
'https://www.ue.edu.ph/mla/https-www-ue-edu-ph-mla-scholarships-grants-for-college/'
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

-- FEU

-- Entrance Scholarship (All Colleges, All Programs)
(1, 1, NULL, NULL),

-- Teacher Scholarship Program (Institute of Education)
(2, 1, 4, NULL),

-- LEAP (All Colleges, All Programs)
(3, 1, NULL, NULL),

-- Nicanor Reyes Science Scholarship Program
-- Institute of Health Sciences and Nursing
(4, 1, 5, 21), -- BS Nursing
(4, 1, 5, 22), -- BS Medical Technology
(4, 1, 5, 23), -- BS Pharmacy

-- Institute of Technology
(4, 1, 7, 26), -- BS Computer Science
(4, 1, 7, 27), -- BS Information Technology
(4, 1, 7, 28), -- BS Civil Engineering
(4, 1, 7, 29), -- BS Mechanical Engineering
(4, 1, 7, 30), -- BS Electrical Engineering
(4, 1, 7, 31), -- BS Electronics Engineering

-- Academic Scholarship
(5, 1, NULL, NULL),

-- FEU Tuition Discount
(6, 1, NULL, NULL),

-- FEU PWD Discount
(7, 1, NULL, NULL),

-- Athletics Scholarship
(8, 1, NULL, NULL),

-- Cultural Scholarship
(9, 1, NULL, NULL),

-- Presidential Decree 577 Scholarship
(10, 1, NULL, NULL),

-- UP

-- Universal Access to Quality Tertiary Education Act (RA 10931)
(11, 2, NULL, NULL),

-- Grants-in-Aid Program (GIAP)
(12, 2, NULL, NULL),

-- Tertiary Education Subsidy (TES)
(13, 2, NULL, NULL),

-- UP Tuition Loan Program
(14, 2, NULL, NULL),

-- Student Loan Board Programs
(15, 2, NULL, NULL),

-- UP Presidential Scholarship
(16, 2, NULL, NULL),

-- UP Presidential Leadership Grant
(17, 2, NULL, NULL),

-- UP Oblation Scholarship
(18, 2, NULL, NULL),

-- Ateneo

-- Ateneo Freshman Merit Scholarship
(19, 3, NULL, NULL),

-- Director's List Scholarship
(20, 3, NULL, NULL),

-- Financial Aid Scholarship
(21, 3, NULL, NULL),

-- Magis Scholarship
(22, 3, NULL, NULL),

-- Athletic Scholarship
(23, 3, NULL, NULL),

-- Finster Scholarship
(24, 3, NULL, NULL),

-- San Ignacio Scholarship
(25, 3, NULL, NULL),

-- DLSU

-- Archer Achiever Scholarship
(26, 4, NULL, NULL),

-- Br. Andrew Gonzalez Academic Scholarship
(27, 4, NULL, NULL),

-- St. La Salle Financial Assistance Grant
(28, 4, NULL, NULL),

-- Gokongwei Grant for Excellence
(29, 4, NULL, NULL),

-- Vaugirard Scholarship Program
(30, 4, NULL, NULL),

-- Science and Technology Scholarship
(31, 4, NULL, NULL),

-- Presidential Decree No. 577 Scholarship
(32, 4, NULL, NULL),

-- Student Assistantship Program
(33, 4, NULL, NULL),

-- Tuition Discount Program
(34, 4, NULL, NULL),

-- Student Loan Program
(35, 4, NULL, NULL),

-- UST

-- Santo Tomas Scholarship
(36, 5, NULL, NULL),

-- San Martin de Porres Scholarship
(37, 5, NULL, NULL),

-- Santo Domingo de Guzman Scholarship
(38, 5, NULL, NULL),

-- San Lorenzo Ruiz Scholarship
(39, 5, NULL, NULL),

-- Student Assistance Program (STAP)
(40, 5, NULL, NULL),

-- NU

-- NU Academic Scholarship
(41, 6, NULL, NULL),

-- NU President's Scholarship
(42, 6, NULL, NULL),

-- SM Scholarship
(43, 6, NULL, NULL),

-- Athletic Scholarship
(44, 6, NULL, NULL),

-- Performing Arts Scholarship
(45, 6, NULL, NULL),

-- Student Assistantship Program
(46, 6, NULL, NULL),

-- CHED Scholarship
(47, 6, NULL, NULL),

-- Tertiary Education Subsidy (TES)
(48, 6, NULL, NULL),

-- Adamson

-- Academic Scholarship
(49, 7, NULL, NULL),

-- Entrance Scholarship
(50, 7, NULL, NULL),

-- Athletic Scholarship
(51, 7, NULL, NULL),

-- Financial Assistance Program
(52, 7, NULL, NULL),

-- Student Assistantship Program
(53, 7, NULL, NULL),

-- Religious and Community Service Scholarship
(54, 7, NULL, NULL),

-- UE

-- UE–Tan Yan Kee Foundation, Inc. Scholarship
(55, 8, 55, NULL), -- College of Business Administration
(56, 8, 55, NULL), -- College of Business Administration
(57, 8, 57, NULL), -- College of Computer Studies and Systems
(58, 8, 56, NULL), -- College of Engineering
(59, 8, 58, NULL), -- College of Dentistry


-- Grade 12 Graduates with Academic Excellence Award
(60, 8, NULL, NULL),

-- University Scholarship
(61, 8, NULL, NULL),

-- College Scholarship
(62, 8, NULL, NULL),

-- Athletic Service Grant
(63, 8, NULL, NULL),

-- Cultural Service Grant
(64, 8, NULL, NULL),

-- Student Assistantship Program
(65, 8, NULL, NULL),

-- UE Alumni Association Scholarship
(66, 8, NULL, NULL);


-- ==========================
-- Student Account
-- ==========================

INSERT IGNORE INTO students
(
    id,
    first_name,
    middle_name,
    last_name,
    email,
    password,
    course,
    gwa,
    phone_number,
    gender,
    address,
    country
)
VALUES
(
    1,
    'Juan',
    'Mercado',
    'Dela Cruz',
    'student@test.com',
    '$2y$10$zaLtGhmq3Xoc48RFx6NDfuYdJokMjhUtOg1K7JbYGL6BvEgOXaLZq',
    'BS Computer Science',
    1.50,
    '09123456789',
    'Male',
    '123 Main Street',
    'Philippines'
);
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
),
(
    'test@admin.com',
    '$2y$10$52Nq4h/tsfiIlg64jZgu8umCJkZhHzczr7IkVnl5ngIqtS310MG.q'
);











