<?php

require_once __DIR__ . '/../config/database.php';

class Scholarship {
    private $db;

    public function __construct() {
        $this->db = (new Database())->getConnection();
        if (!$this->db) {
            throw new RuntimeException('Database connection failed');
        }
    }

    public function create($title, $description, $university, $course, $scholarship_type, $minimum_gwa, $requirements, $deadline, $official_scholarship_url = null) {
        $stmt = $this->db->prepare("INSERT INTO scholarships (title, description, university, course, scholarship_type, minimum_gwa, requirements, deadline, official_scholarship_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$title, $description, $university, $course, $scholarship_type, $minimum_gwa, $requirements, $deadline, $official_scholarship_url]);
        return $this->db->lastInsertId();
    }

    public function findAll() {
        $stmt = $this->db->query("SELECT * FROM scholarships ORDER BY created_at DESC");
        return $stmt->fetchAll();
    }

    public function findById($id) {
        $stmt = $this->db->prepare("SELECT * FROM scholarships WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch();
    }

    public function searchAndFilter($search = null, $course = null, $scholarship_type = null, $minimum_gwa = null) {
        $sql = "SELECT * FROM scholarships WHERE 1=1";
        $params = [];

        if ($search) {
            $sql .= " AND (LOWER(title) LIKE ? OR LOWER(university) LIKE ? OR LOWER(course) LIKE ?)";
            $searchParam = "%" . strtolower($search) . "%";
            $params[] = $searchParam;
            $params[] = $searchParam;
            $params[] = $searchParam;
        }
        if ($course) {
            $sql .= " AND course = ?";
            $params[] = $course;
        }
        if ($scholarship_type) {
            $sql .= " AND scholarship_type = ?";
            $params[] = $scholarship_type;
        }
        if ($minimum_gwa !== null && $minimum_gwa > 0) {
            $sql .= " AND minimum_gwa <= ?";
            $params[] = $minimum_gwa;
        }

        $sql .= " ORDER BY created_at DESC";
        
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public function update($id, $data) {
        $stmt = $this->db->prepare("UPDATE scholarships SET title = ?, description = ?, university = ?, course = ?, scholarship_type = ?, minimum_gwa = ?, requirements = ?, deadline = ?, official_scholarship_url = ? WHERE id = ?");
        return $stmt->execute([
            $data['title'],
            $data['description'],
            $data['university'],
            $data['course'],
            $data['scholarship_type'],
            $data['minimum_gwa'],
            $data['requirements'],
            $data['deadline'],
            $data['official_scholarship_url'] ?? null,
            $id
        ]);
    }

    public function delete($id) {
        $stmt = $this->db->prepare("DELETE FROM scholarships WHERE id = ?");
        return $stmt->execute([$id]);
    }
}
