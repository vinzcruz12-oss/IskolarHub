<?php

require_once __DIR__ . '/../config/database.php';

class Admin {
    private $db;

    public function __construct() {
        $this->db = (new Database())->getConnection();
        if (!$this->db) {
            throw new RuntimeException('Database connection failed');
        }
    }

    public function findByUsername($username) {
        $stmt = $this->db->prepare("SELECT * FROM admins WHERE username = ?");
        $stmt->execute([$username]);
        return $stmt->fetch();
    }

    public function verifyPassword($username, $password) {
        $admin = $this->findByUsername($username);
        if ($admin && password_verify($password, $admin['password'])) {
            return $admin;
        }
        return null;
    }

    public function findAll() {
        $stmt = $this->db->query("SELECT id, username, created_at FROM admins ORDER BY created_at DESC");
        return $stmt->fetchAll();
    }

    public function create($username, $hashedPassword) {
        $stmt = $this->db->prepare("INSERT INTO admins (username, password) VALUES (?, ?)");
        $stmt->execute([$username, $hashedPassword]);
        return $this->db->lastInsertId();
    }

    public function updatePassword($id, $hashedPassword) {
        $stmt = $this->db->prepare("UPDATE admins SET password = ? WHERE id = ?");
        return $stmt->execute([$hashedPassword, $id]);
    }

    public function delete($id) {
        $stmt = $this->db->prepare("DELETE FROM admins WHERE id = ?");
        return $stmt->execute([$id]);
    }

    public function count() {
        return (int)$this->db->query("SELECT COUNT(*) FROM admins")->fetchColumn();
    }
}
