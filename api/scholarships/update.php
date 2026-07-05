<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../../controllers/ScholarshipController.php';

$input = json_decode(file_get_contents('php://input'), true);
$id = $input['id'] ?? null;

$controller = new ScholarshipController();
$controller->update($id);