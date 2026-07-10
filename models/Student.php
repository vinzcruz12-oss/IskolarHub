<?php

require_once __DIR__ . '/../config/database.php';

class Student {
    private $db;

    public function __construct() {
        $this->db = (new Database())->getConnection();
        if (!$this->db) {
            throw new RuntimeException('Database connection failed');
        }
    }

    public function create($first_name, $middle_name, $last_name, $email, $password, $course = null, $gwa = null) {
        $stmt = $this->db->prepare("INSERT INTO students (first_name, middle_name, last_name, email, password, course, gwa) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$first_name, $middle_name, $last_name, $email, $password, $course, $gwa]);
        return $this->db->lastInsertId();
    }

    public function findAll() {
        $stmt = $this->db->query("SELECT * FROM students ORDER BY created_at DESC");
        return $stmt->fetchAll();
    }

    public function findById($id) {
        $stmt = $this->db->prepare("SELECT * FROM students WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch();
    }

    public function findByEmail($email) {
        $stmt = $this->db->prepare("SELECT * FROM students WHERE email = ?");
        $stmt->execute([$email]);
        return $stmt->fetch();
    }

    public function verifyPassword($email, $password) {
        $student = $this->findByEmail($email);
        if ($student && password_verify($password, $student['password'])) {
            return $student;
        }
        return null;
    }

    public function update($id, $data) {
        $fields = [];
        $params = [];

        if (array_key_exists('first_name', $data)) { $fields[] = 'first_name = ?'; $params[] = $data['first_name']; }
        if (array_key_exists('middle_name', $data)) { $fields[] = 'middle_name = ?'; $params[] = $data['middle_name']; }
        if (array_key_exists('last_name', $data)) { $fields[] = 'last_name = ?'; $params[] = $data['last_name']; }
        if (array_key_exists('email', $data)) { $fields[] = 'email = ?'; $params[] = $data['email']; }
        if (array_key_exists('age', $data)) { $fields[] = 'age = ?'; $params[] = $data['age']; }
        if (array_key_exists('current_school', $data)) { $fields[] = 'current_school = ?'; $params[] = $data['current_school']; }
        if (array_key_exists('strand', $data)) { $fields[] = 'strand = ?'; $params[] = $data['strand']; }
        if (array_key_exists('course', $data)) { $fields[] = 'course = ?'; $params[] = $data['course']; }
        if (array_key_exists('gwa', $data)) { $fields[] = 'gwa = ?'; $params[] = $data['gwa']; }
        if (array_key_exists('phone_number', $data)) { $fields[] = 'phone_number = ?'; $params[] = $data['phone_number']; }
        if (array_key_exists('gender', $data)) { $fields[] = 'gender = ?'; $params[] = $data['gender']; }
        if (array_key_exists('address', $data)) { $fields[] = 'address = ?'; $params[] = $data['address']; }
        if (array_key_exists('country', $data)) { $fields[] = 'country = ?'; $params[] = $data['country']; }
        if (array_key_exists('status', $data)) { $fields[] = 'status = ?'; $params[] = $data['status']; }
        if (array_key_exists('password', $data)) { $fields[] = 'password = ?'; $params[] = $data['password']; }

        if (empty($fields)) return false;

        $sql = 'UPDATE students SET ' . implode(', ', $fields) . ' WHERE id = ?';
        $params[] = $id;
        $stmt = $this->db->prepare($sql);
        return $stmt->execute($params);
    }

    public function verifyPasswordById($id, $password) {
        $student = $this->findById($id);
        if ($student && password_verify($password, $student['password'])) {
            return true;
        }
        return false;
    }

    public function delete($id) {
        $stmt = $this->db->prepare("DELETE FROM students WHERE id = ?");
        return $stmt->execute([$id]);
    }
}
