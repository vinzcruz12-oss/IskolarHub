<?php

require_once __DIR__ . '/../config/database.php';

function executeSqlFile($pdo, $filePath) {
    if (!file_exists($filePath)) {
        echo "Error: File not found: $filePath\n";
        return false;
    }
    
    echo "Executing $filePath...\n";
    $sql = file_get_contents($filePath);
    
    // Remove SQL comments
    $sql = preg_replace('/--.*(\r?\n|$)/', '', $sql);
    $sql = preg_replace('/\/\*.*?\*\//s', '', $sql);
    
    // Split into individual queries, respecting quotes
    $queries = [];
    $query = '';
    $inSingleQuote = false;
    $inDoubleQuote = false;
    $escaped = false;
    $len = strlen($sql);
    
    for ($i = 0; $i < $len; $i++) {
        $char = $sql[$i];
        
        if ($escaped) {
            $query .= $char;
            $escaped = false;
            continue;
        }
        
        if ($char === '\\') {
            $query .= $char;
            $escaped = true;
            continue;
        }
        
        if ($char === "'" && !$inDoubleQuote) {
            $inSingleQuote = !$inSingleQuote;
        } elseif ($char === '"' && !$inSingleQuote) {
            $inDoubleQuote = !$inDoubleQuote;
        }
        
        if ($char === ';' && !$inSingleQuote && !$inDoubleQuote) {
            $trimmed = trim($query);
            if ($trimmed !== '') {
                $queries[] = $trimmed;
            }
            $query = '';
        } else {
            $query .= $char;
        }
    }
    
    $trimmed = trim($query);
    if ($trimmed !== '') {
        $queries[] = $trimmed;
    }
    
    foreach ($queries as $query) {
        try {
            $pdo->exec($query);
        } catch (PDOException $e) {
            echo "Warning / Error on query:\n" . substr($query, 0, 150) . "...\nError: " . $e->getMessage() . "\n\n";
            // Do not fail immediately, some INSERT IGNORE might trigger warnings/errors
        }
    }
    return true;
}

try {
    // 1. Connect to MySQL without selecting a database first
    $host = 'localhost';
    $username = 'root';
    $password = '';
    
    echo "Connecting to MySQL server at $host...\n";
    $dsn = "mysql:host=$host;charset=utf8mb4";
    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_EMULATE_PREPARES => false,
    ];
    $pdo = new PDO($dsn, $username, $password, $options);
    
    // 2. Drop and Recreate the database
    echo "Dropping old database if exists...\n";
    $pdo->exec("DROP DATABASE IF EXISTS iskolarhub");
    echo "Creating database...\n";
    $pdo->exec("CREATE DATABASE iskolarhub CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci");
    
    // 3. Connect to the specific database
    echo "Selecting database 'iskolarhub'...\n";
    $pdo->exec("USE iskolarhub");
    
    // 4. Run schema.sql
    $schemaPath = __DIR__ . '/schema.sql';
    if (!executeSqlFile($pdo, $schemaPath)) {
        echo "Failed to execute schema.sql\n";
        exit(1);
    }
    
    // 5. Run seeds.sql
    $seedsPath = __DIR__ . '/seeds.sql';
    if (!executeSqlFile($pdo, $seedsPath)) {
        echo "Failed to execute seeds.sql\n";
        exit(1);
    }
    
    echo "Database setup completed successfully!\n";
    
} catch (PDOException $e) {
    echo "Database Connection/Execution Error: " . $e->getMessage() . "\n";
    exit(1);
}
