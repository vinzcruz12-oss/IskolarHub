<?php

header('Content-Type: application/json');

require_once __DIR__ . '/../config/database.php';

$db = new Database();

$response = [
    'database' => $dbname ?? 'iskolarhub',
    'connected' => false,
    'tables' => [
        'students' => false,
        'scholarships' => false,
        'admins' => false,
    ],
    'errors' => []
];

if (!$db->isConnected()) {
    $response['errors'][] = 'Cannot connect to database: ' . ($db->getError() ?: 'Unknown error');
    echo json_encode($response);
    exit;
}

$response['connected'] = true;

try {
    $stmt = $db->getConnection()->query("SHOW TABLES");
    $existingTables = [];
    while ($row = $stmt->fetch()) {
        $existingTables[] = array_values($row)[0];
    }

    $requiredTables = ['students', 'scholarships', 'admins'];
    foreach ($requiredTables as $table) {
        if (in_array($table, $existingTables)) {
            $response['tables'][$table] = true;
        } else {
            $response['errors'][] = "Missing table: $table";
        }
    }
} catch (PDOException $e) {
    $response['errors'][] = 'Failed to query tables: ' . $e->getMessage();
}

echo json_encode($response);
