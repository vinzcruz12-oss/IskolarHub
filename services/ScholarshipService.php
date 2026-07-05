<?php

require_once __DIR__ . '/../models/Scholarship.php';

class ScholarshipService {
    private $scholarship;

    public function __construct() {
        $this->scholarship = new Scholarship();
    }

    public function createScholarship($data) {
        $required = ['title', 'description', 'university', 'education_level', 'course', 'scholarship_type', 'minimum_gwa', 'requirements', 'deadline'];

        foreach ($required as $field) {
            if (!isset($data[$field]) || $data[$field] === '') {
                return ['success' => false, 'error' => "Missing required field: $field"];
            }
        }

        $id = $this->scholarship->create(
            $data['title'],
            $data['description'],
            $data['university'],
            $data['education_level'],
            $data['course'],
            $data['scholarship_type'],
            $data['minimum_gwa'],
            $data['requirements'],
            $data['deadline'],
            $data['website_url'] ?? null
        );

        return $id ? ['success' => true, 'message' => 'Scholarship created', 'id' => $id] : ['success' => false, 'error' => 'Failed to create'];
    }

    public function getAllScholarships() {
        $scholarships = $this->scholarship->findAll();
        return ['success' => true, 'data' => $scholarships];
    }

    public function getScholarshipById($id) {
        if (!$id) {
            return ['success' => false, 'error' => 'ID is required'];
        }

        $scholarship = $this->scholarship->findById($id);
        if (!$scholarship) {
            return ['success' => false, 'error' => 'Scholarship not found'];
        }

        return ['success' => true, 'data' => $scholarship];
    }

    public function updateScholarship($id, $data) {
        if (!$id) {
            return ['success' => false, 'error' => 'ID is required'];
        }

        $scholarship = $this->scholarship->findById($id);
        if (!$scholarship) {
            return ['success' => false, 'error' => 'Scholarship not found'];
        }

        $required = ['title', 'description', 'university', 'education_level', 'course', 'scholarship_type', 'minimum_gwa', 'requirements', 'deadline'];
        foreach ($required as $field) {
            if (!isset($data[$field]) || $data[$field] === '') {
                return ['success' => false, 'error' => "Missing required field: $field"];
            }
        }

        $this->scholarship->update($id, $data);
        return ['success' => true, 'message' => 'Scholarship updated'];
    }

    public function deleteScholarship($id) {
        if (!$id) {
            return ['success' => false, 'error' => 'ID is required'];
        }

        $scholarship = $this->scholarship->findById($id);
        if (!$scholarship) {
            return ['success' => false, 'error' => 'Scholarship not found'];
        }

        $this->scholarship->delete($id);
        return ['success' => true, 'message' => 'Scholarship deleted'];
    }

    public function searchScholarships($search = null, $education_level = null, $course = null, $scholarship_type = null, $minimum_gwa = null) {
        $scholarships = $this->scholarship->searchAndFilter($search, $education_level, $course, $scholarship_type, $minimum_gwa);
        return ['success' => true, 'data' => $scholarships];
    }
}