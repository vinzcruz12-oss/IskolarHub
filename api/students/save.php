<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../../models/Student.php';

$input = json_decode(file_get_contents('php://input'), true);

$required = ['fullname', 'email', 'password', 'education_level', 'course', 'gwa'];
foreach ($required as $field) {
    if (!isset($input[$field]) || empty($input[$field])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => "Missing required field: $field"]);
        exit;
    }
}

if (!is_numeric($input['gwa']) || $input['gwa'] < 0 || $input['gwa'] > 100) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'GWA must be between 0 and 100']);
    exit;
}

$student = new Student();

$existing = $student->findByEmail($input['email']);
if ($existing) {
    http_response_code(200);
    echo json_encode(['success' => true, 'student_id' => (int)$existing['id']]);
    exit;
}

$hashedPassword = password_hash($input['password'], PASSWORD_DEFAULT);
$student_id = $student->create(
    $input['fullname'],
    $input['email'],
    $hashedPassword,
    $input['education_level'],
    $input['course'],
    $input['gwa']
);

http_response_code(201);
echo json_encode(['success' => true, 'student_id' => (int)$student_id]);
exit;