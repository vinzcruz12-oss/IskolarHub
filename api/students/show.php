<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../../models/Student.php';

$id = $_GET['id'] ?? null;

if (!$id) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'ID is required']);
    exit;
}

$student = new Student();
$result = $student->findById($id);

if (!$result) {
    http_response_code(404);
    echo json_encode(['success' => false, 'error' => 'Student not found']);
    exit;
}

http_response_code(200);
echo json_encode(['success' => true, 'data' => $result]);
exit;