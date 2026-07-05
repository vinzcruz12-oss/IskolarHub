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

if (!isset($input['id'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'ID is required']);
    exit;
}

$student = new Student();
$existing = $student->findById($input['id']);
if (!$existing) {
    http_response_code(404);
    echo json_encode(['success' => false, 'error' => 'Student not found']);
    exit;
}

$updateData = [];
if (isset($input['age'])) $updateData['age'] = $input['age'];
if (isset($input['current_school'])) $updateData['current_school'] = $input['current_school'];
if (isset($input['education_level'])) $updateData['education_level'] = $input['education_level'];
if (isset($input['strand'])) $updateData['strand'] = $input['strand'];
if (isset($input['course'])) $updateData['course'] = $input['course'];
if (isset($input['gwa'])) {
    if (!is_numeric($input['gwa']) || $input['gwa'] < 0 || $input['gwa'] > 100) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'GWA must be between 0 and 100']);
        exit;
    }
    $updateData['gwa'] = $input['gwa'];
}

if (empty($updateData)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'No data to update']);
    exit;
}

$student->update($input['id'], $updateData);

http_response_code(200);
echo json_encode(['success' => true, 'message' => 'Profile updated']);
exit;
