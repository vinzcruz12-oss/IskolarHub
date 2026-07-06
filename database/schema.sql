CREATE DATABASE IF NOT EXISTS iskolarhub;
USE iskolarhub;

--Table Structure
--University
--  College
--      Course

CREATE TABLE universities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    university_name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE colleges (
    id INT AUTO_INCREMENT PRIMARY KEY,
    university_id INT NOT NULL,
    college_name VARCHAR(255) NOT NULL,

    FOREIGN KEY (university_id)
        REFERENCES universities(id)
        ON DELETE CASCADE
);

CREATE TABLE courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    college_id INT NOT NULL,
    course_name VARCHAR(255) NOT NULL,

    FOREIGN KEY (college_id)
        REFERENCES colleges(id)
        ON DELETE CASCADE
);

CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    middle_name VARCHAR(255) NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    age INT,
    university_id INT,
    college_id INT,
    course_id INT,
    education_level VARCHAR(100),
    strand VARCHAR(255),
    gwa DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (university_id) REFERENCES universities(id),
    FOREIGN KEY (college_id) REFERENCES colleges(id),
    FOREIGN KEY (course_id) REFERENCES courses(id)
);

CREATE TABLE scholarships (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    education_level VARCHAR(100) NOT NULL,
    scholarship_type VARCHAR(100) NOT NULL,
    minimum_gwa DECIMAL(5,2),
    requirements TEXT,
    deadline DATE,
    website_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--this table is where all the relationships for scholaship filtering can be found
--example: scholarship is only available for FEU Computer Studies then course_id will be NULL
--example: scholarship is available a specific course then all fields should be NOT NULL
CREATE TABLE scholarship_eligibility (
    id INT AUTO_INCREMENT PRIMARY KEY,
    scholarship_id INT NOT NULL,
    university_id INT NOT NULL,
    college_id INT NULL,
    course_id INT NULL,

    FOREIGN KEY (scholarship_id) REFERENCES scholarships(id) ON DELETE CASCADE,
    FOREIGN KEY (university_id) REFERENCES universities(id) ON DELETE CASCADE,
    FOREIGN KEY (college_id) REFERENCES colleges(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE TABLE admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);