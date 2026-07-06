<?php

class Database {
    private $host = 'localhost';
    private $dbname = 'iskolarhub';
    private $username = 'root';
    private $password = '';
    private $conn;
    private $error = null;

    public function __construct() {
        try {
            $dsn = "mysql:host={$this->host};dbname={$this->dbname};charset=utf8mb4";
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ];
            $this->conn = new PDO($dsn, $this->username, $this->password, $options);
        } catch (PDOException $e) {
            $this->error = $e->getMessage();
            $this->conn = null;
        }
    }

    public function getConnection() {
        return $this->conn;
    }

    public function getError() {
        return $this->error;
    }

    public function isConnected() {
        return $this->conn !== null;
    }

    public function checkTablesExist() {
        if (!$this->isConnected()) {
            return false;
        }

        $requiredTables = ['students', 'scholarships', 'admins'];

        try {
            $stmt = $this->conn->query("SHOW TABLES");
            $existingTables = [];
            while ($row = $stmt->fetch()) {
                $existingTables[] = array_values($row)[0];
            }
        } catch (PDOException $e) {
            return false;
        }

        foreach ($requiredTables as $table) {
            if (!in_array($table, $existingTables)) {
                return false;
            }
        }

        return true;
    }

    public function getMissingTables() {
        if (!$this->isConnected()) {
            return ['database'];
        }

        $requiredTables = ['students', 'scholarships', 'admins'];
        $existingTables = [];
        $missing = [];

        try {
            $stmt = $this->conn->query("SHOW TABLES");
            while ($row = $stmt->fetch()) {
                $existingTables[] = array_values($row)[0];
            }
        } catch (PDOException $e) {
            return $requiredTables;
        }

        foreach ($requiredTables as $table) {
            if (!in_array($table, $existingTables)) {
                $missing[] = $table;
            }
        }

        return $missing;
    }
}
