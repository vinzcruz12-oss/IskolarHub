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

if (empty($input)) {
    $input = $_POST;
}

$required = ['fullname', 'email', 'password'];
foreach ($required as $field) {
    if (!isset($input[$field]) || empty($input[$field])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => "Missing required field: $field"]);
        exit;
    }
}

if (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid email format']);
    exit;
}

if (strlen($input['password']) < 6) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Password must be at least 6 characters']);
    exit;
}

$student = new Student();

$existing = $student->findByEmail($input['email']);
if ($existing) {
    http_response_code(409);
    echo json_encode(['success' => false, 'error' => 'Email already registered']);
    exit;
}

$hashedPassword = password_hash($input['password'], PASSWORD_DEFAULT);
$student_id = $student->create(
    $input['fullname'],
    $input['email'],
    $hashedPassword
);

http_response_code(201);
echo json_encode(['success' => true, 'student_id' => (int)$student_id]);
exit;
