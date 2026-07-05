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

if (!isset($input['email']) || !isset($input['password'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Email and password required']);
    exit;
}

$student = new Student();
$authenticated = $student->verifyPassword($input['email'], $input['password']);

if ($authenticated) {
    echo json_encode(['success' => true, 'student_id' => (int)$authenticated['id'], 'fullname' => $authenticated['fullname']]);
    exit;
}

http_response_code(401);
echo json_encode(['success' => false, 'error' => 'Invalid credentials']);
exit;