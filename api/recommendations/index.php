<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../../services/RecommendationService.php';

$student_id = $_GET['student_id'] ?? null;

$service = new RecommendationService();
$result = $service->getEligibleScholarships($student_id);

http_response_code($result['success'] ? 200 : 404);
echo json_encode($result);
exit;