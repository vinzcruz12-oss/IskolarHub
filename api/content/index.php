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

$unis = $db->query("SELECT * FROM universities ORDER BY university_name ASC")->fetchAll();
$colleges = $db->query("SELECT c.*, u.university_name FROM colleges c JOIN universities u ON c.university_id = u.id ORDER BY c.college_name ASC")->fetchAll();
$courses = $db->query("SELECT co.*, col.college_name FROM courses co JOIN colleges col ON co.college_id = col.id ORDER BY co.course_name ASC")->fetchAll();

echo json_encode([
    'success' => true,
    'universities' => $unis,
    'colleges' => $colleges,
    'courses' => $courses
]);
exit;
