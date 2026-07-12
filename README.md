# 🎓 IskolarHub

IskolarHub is a web-based scholarship finder designed to help students easily discover scholarship opportunities through a centralized platform. Instead of searching across multiple websites and social media pages, students can browse, search, and filter scholarships based on their qualifications.

The platform also provides an admin dashboard that allows scholarship providers to create, update, and manage scholarship listings, making scholarship information more accessible to students.

---

# 🎯 Purpose

IskolarHub aims to simplify the scholarship search process by providing a centralized platform where students can easily browse scholarship opportunities while allowing scholarship providers to efficiently manage their scholarship listings.

---

### Scholarship Details

Each scholarship listing displays:

- Scholarship Description
- Eligibility Requirements
- Required Documents
- Scholarship Benefits
- Application Deadline
- Scholarship Provider
- Official Website Link

---

## 🚀 Setup Instructions

### Prerequisites

- XAMPP installed with Apache and MySQL
- PHP 7.4 or higher
- MySQL 5.7 or higher

### 1. Clone the Repository

Place the project in your XAMPP web root:
```
C:\xampp\htdocs\App\IskolarHub\
```

### 2. Database Setup

See **[SETUP.md](SETUP.md)** for detailed database setup instructions.

Quick steps:
1. Open phpMyAdmin: `http://localhost/phpmyadmin`
2. Create database `iskolarhub`
3. Import `database/schema.sql`
4. Import `database/seeds.sql`

### 3. Start XAMPP

Make sure **Apache** and **MySQL** are running in XAMPP Control Panel.

### 4. Access the Application

Open your browser and go to:
```
http://localhost/App/IskolarHub/test/index.html
```

### 5. Default Admin Login

After importing `seeds.sql`:
- **Username:** `admin`
- **Password:** `admin123`

## 📁 Folder Structure

```
IskolarHub/
├── config/
│   ├── database.php          # PDO database connection
│   └── helpers.php           # Database setup validation helper
├── controllers/
│   ├── StudentController.php # Student API logic
│   └── ScholarshipController.php # Scholarship API logic
├── models/
│   ├── Student.php           # Student data model
│   ├── Scholarship.php       # Scholarship data model
│   └── Admin.php             # Admin data model
├── services/
│   ├── ScholarshipService.php # Scholarship business logic
│   └── RecommendationService.php # Recommendation engine
├── api/
│   ├── admin/
│   │   └── login.php         # POST /api/admin/login.php
│   ├── students/
│   │   ├── register.php      # POST /api/students/register.php
│   │   ├── login.php         # POST /api/students/login.php
│   │   ├── save.php          # POST /api/students/save.php
│   │   ├── show.php          # GET  /api/students/show.php?id=
│   │   ├── update.php        # POST /api/students/update.php
│   │   └── index.php         # GET  /api/students/index.php
│   ├── scholarships/
│   │   ├── create.php        # POST /api/scholarships/create.php
│   │   ├── index.php         # GET  /api/scholarships/index.php
│   │   ├── list.php          # GET  /api/scholarships/list.php
│   │   ├── show.php          # GET  /api/scholarships/show.php?id=
│   │   ├── update.php        # POST /api/scholarships/update.php
│   │   └── delete.php        # POST /api/scholarships/delete.php
│   └── recommendations/
│       └── index.php         # GET  /api/recommendations/index.php?student_id=
├── database/
│   ├── schema.sql            # Database schema
│   ├── seeds.sql             # Sample data
│   ├── migrate.sql           # Migration script for updates
│   └── check.php             # Database verification script
├── test/
│   ├── index.html            # Frontend testing UI
│   ├── css/
│   │   └── style.css         # Styles
│   └── js/
│       └── app.js            # Frontend JavaScript
├── SETUP.md                  # Database setup guide
└── README.md                 # Project documentation
```

## 🔌 API Overview

### Student APIs

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/students/register.php` | POST | Register a new student |
| `/api/students/login.php` | POST | Student login |
| `/api/students/save.php` | POST | Save full student profile |
| `/api/students/show.php?id=` | GET | Get student by ID |
| `/api/students/update.php` | POST | Update student profile |
| `/api/students/index.php` | GET | List all students (admin) |

### Admin APIs

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/admin/login.php` | POST | Admin login |

### Scholarship APIs

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/scholarships/create.php` | POST | Create scholarship |
| `/api/scholarships/index.php` | GET | List all scholarships |
| `/api/scholarships/list.php` | GET | Search/filter scholarships |
| `/api/scholarships/show.php?id=` | GET | Get scholarship by ID |
| `/api/scholarships/update.php` | POST | Update scholarship |
| `/api/scholarships/delete.php` | POST | Delete scholarship |

### Recommendation API

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/recommendations/index.php?student_id=` | GET | Get eligible scholarships for student |

## ✨ Features

### Student
- User registration and login
- Complete eligibility/profile form
- Browse available scholarships
- Search and filter scholarships
- View personalized scholarship recommendations
- Privacy Notice and Terms of Use agreement

### Administrator
- Secure admin login
- Dashboard overview with statistics
- Add, edit, and delete scholarship listings
- View registered students
- View as Student (read-only mode)

## 🔍 Search Filters

Students can filter scholarships by:
- Scholarship Type (dropdown)
- Course/Program (dropdown)
- Minimum GWA

## 🛠️ Built With

- Native PHP
- MySQL
- PDO
- HTML
- CSS
- JavaScript

## 🎯 Project Goal

To provide a centralized platform that simplifies scholarship discovery for students while giving scholarship providers an efficient way to manage and publish scholarship opportunities.

## 👥 Team

**Group 1**

- 

---

*Helping students discover more opportunities, one scholarship at a time.*
