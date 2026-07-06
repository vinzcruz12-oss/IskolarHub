<?php

require_once __DIR__ . '/../services/ScholarshipService.php';

class ScholarshipController {
    private $service;

    public function __construct() {
        $this->service = new ScholarshipService();
    }

    public function index() {
        $result = $this->service->getAllScholarships();
        $this->jsonResponse($result);
    }

    public function show($id) {
        $result = $this->service->getScholarshipById($id);
        $status = $result['success'] ? 200 : 404;
        $this->jsonResponse($result, $status);
    }

    public function store() {
        $input = json_decode(file_get_contents('php://input'), true);
        $result = $this->service->createScholarship($input);
        $status = $result['success'] ? 201 : 400;
        $this->jsonResponse($result, $status);
    }

    public function update($id) {
        $input = json_decode(file_get_contents('php://input'), true);
        $result = $this->service->updateScholarship($id, $input);
        $status = $result['success'] ? 200 : 404;
        $this->jsonResponse($result, $status);
    }

    public function destroy($id) {
        $result = $this->service->deleteScholarship($id);
        $status = $result['success'] ? 200 : 404;
        $this->jsonResponse($result, $status);
    }

    public function list() {
        $search = $_GET['search'] ?? null;
        $course = $_GET['course'] ?? null;
        $scholarship_type = $_GET['scholarship_type'] ?? null;
        $minimum_gwa = $_GET['minimum_gwa'] ?? null;

        $result = $this->service->searchScholarships($search, $course, $scholarship_type, $minimum_gwa);
        $this->jsonResponse($result);
    }

    private function jsonResponse($data, $status = 200) {
        header('Content-Type: application/json');
        http_response_code($status);
        echo json_encode($data);
        exit;
    }
}
