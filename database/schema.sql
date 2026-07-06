CREATE DATABASE IF NOT EXISTS iskolarhub;
USE iskolarhub;

CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    middle_name VARCHAR(255) NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    age INT NULL,
    current_school VARCHAR(255) NULL,
    strand VARCHAR(255) NULL,
    course VARCHAR(255) NULL,
    gwa DECIMAL(5,2) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS scholarships (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    university VARCHAR(255) NOT NULL,
    course VARCHAR(255) NULL,
    scholarship_type VARCHAR(100) NOT NULL,
    minimum_gwa DECIMAL(5,2) NOT NULL,
    requirements TEXT NOT NULL,
    deadline DATE NOT NULL,
    official_scholarship_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
