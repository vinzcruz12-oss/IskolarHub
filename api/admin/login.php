<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../../config/helpers.php';
requireDatabase();

require_once __DIR__ . '/../../models/Admin.php';

$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['username']) || !isset($input['password'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Username and password required']);
    exit;
}

$admin = new Admin();
$authenticated = $admin->verifyPassword($input['username'], $input['password']);

if ($authenticated) {
    echo json_encode(['success' => true, 'admin_id' => (int)$authenticated['id'], 'username' => $authenticated['username']]);
    exit;
}

http_response_code(401);
echo json_encode(['success' => false, 'error' => 'Invalid credentials']);
exit;
