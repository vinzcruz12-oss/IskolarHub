<?php

require_once __DIR__ . '/database.php';

function requireDatabase() {
    $db = new Database();

    if (!$db->isConnected()) {
        $error = $db->getError();
        if ($error && (stripos($error, 'Unknown database') !== false || stripos($error, '1049') !== false)) {
            http_response_code(500);
            header('Content-Type: application/json');
            echo json_encode([
                'success' => false,
                'error' => 'Database has not been initialized. Please import database/schema.sql.'
            ]);
            exit;
        }

        http_response_code(500);
        header('Content-Type: application/json');
        echo json_encode([
            'success' => false,
            'error' => 'Database connection failed: ' . ($error ?: 'Unknown error')
        ]);
        exit;
    }

    $missingTables = $db->getMissingTables();
    if (!empty($missingTables)) {
        http_response_code(500);
        header('Content-Type: application/json');
        echo json_encode([
            'success' => false,
            'error' => "Required table '" . $missingTables[0] . "' was not found. Please import database/schema.sql."
        ]);
        exit;
    }

    return $db;
}
