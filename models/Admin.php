<?php

require_once __DIR__ . '/../config/database.php';

class Admin {
    private $db;

    public function __construct() {
        $this->db = (new Database())->getConnection();
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
}
