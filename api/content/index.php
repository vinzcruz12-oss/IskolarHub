<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../../config/helpers.php';
requireDatabase();

$db = (new Database())->getConnection();

$unis = $db->query("SELECT * FROM universities ORDER BY name ASC")->fetchAll();
$colleges = $db->query("SELECT c.*, u.name as university_name FROM colleges c JOIN universities u ON c.university_id = u.id ORDER BY c.name ASC")->fetchAll();
$courses = $db->query("SELECT co.*, col.name as college_name FROM courses co JOIN colleges col ON co.college_id = col.id ORDER BY co.name ASC")->fetchAll();

echo json_encode([
    'success' => true,
    'universities' => $unis,
    'colleges' => $colleges,
    'courses' => $courses
]);
exit;
