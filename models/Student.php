<?php

require_once __DIR__ . '/../config/database.php';

class Student {
    private $db;

    public function __construct() {
        $this->db = (new Database())->getConnection();
    }

    public function create($fullname, $email, $password, $education_level = null, $course = null, $gwa = null) {
        $stmt = $this->db->prepare("INSERT INTO students (fullname, email, password, education_level, course, gwa) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([$fullname, $email, $password, $education_level, $course, $gwa]);
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

        if (isset($data['fullname'])) { $fields[] = 'fullname = ?'; $params[] = $data['fullname']; }
        if (isset($data['email'])) { $fields[] = 'email = ?'; $params[] = $data['email']; }
        if (isset($data['age'])) { $fields[] = 'age = ?'; $params[] = $data['age']; }
        if (isset($data['current_school'])) { $fields[] = 'current_school = ?'; $params[] = $data['current_school']; }
        if (isset($data['education_level'])) { $fields[] = 'education_level = ?'; $params[] = $data['education_level']; }
        if (isset($data['strand'])) { $fields[] = 'strand = ?'; $params[] = $data['strand']; }
        if (isset($data['course'])) { $fields[] = 'course = ?'; $params[] = $data['course']; }
        if (isset($data['gwa'])) { $fields[] = 'gwa = ?'; $params[] = $data['gwa']; }

        if (empty($fields)) return false;

        $sql = 'UPDATE students SET ' . implode(', ', $fields) . ' WHERE id = ?';
        $params[] = $id;
        $stmt = $this->db->prepare($sql);
        return $stmt->execute($params);
    }

    public function delete($id) {
        $stmt = $this->db->prepare("DELETE FROM students WHERE id = ?");
        return $stmt->execute([$id]);
    }
}
