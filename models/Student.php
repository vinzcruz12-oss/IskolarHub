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

        if (isset($data['first_name'])) { $fields[] = 'first_name = ?'; $params[] = $data['first_name']; }
        if (isset($data['middle_name'])) { $fields[] = 'middle_name = ?'; $params[] = $data['middle_name']; }
        if (isset($data['last_name'])) { $fields[] = 'last_name = ?'; $params[] = $data['last_name']; }
        if (isset($data['email'])) { $fields[] = 'email = ?'; $params[] = $data['email']; }
        if (isset($data['age'])) { $fields[] = 'age = ?'; $params[] = $data['age']; }
        if (isset($data['current_school'])) { $fields[] = 'current_school = ?'; $params[] = $data['current_school']; }
        if (isset($data['strand'])) { $fields[] = 'strand = ?'; $params[] = $data['strand']; }
        if (isset($data['course'])) { $fields[] = 'course = ?'; $params[] = $data['course']; }
        if (isset($data['gwa'])) { $fields[] = 'gwa = ?'; $params[] = $data['gwa']; }
        if (isset($data['phone_number'])) { $fields[] = 'phone_number = ?'; $params[] = $data['phone_number']; }
        if (isset($data['gender'])) { $fields[] = 'gender = ?'; $params[] = $data['gender']; }
        if (isset($data['address'])) { $fields[] = 'address = ?'; $params[] = $data['address']; }
        if (isset($data['country'])) { $fields[] = 'country = ?'; $params[] = $data['country']; }
        if (isset($data['status'])) { $fields[] = 'status = ?'; $params[] = $data['status']; }
        if (isset($data['password'])) { $fields[] = 'password = ?'; $params[] = $data['password']; }

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
