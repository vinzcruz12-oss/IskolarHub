<?php

require_once __DIR__ . '/../models/Admin.php';

class AdminController {
    private $admin;

    public function __construct() {
        $this->admin = new Admin();
    }

    public function index() {
        $admins = $this->admin->findAll();
        echo json_encode(['success' => true, 'data' => $admins]);
        exit;
    }

    public function store() {
        $input = json_decode(file_get_contents('php://input'), true);

        if (!isset($input['username']) || !isset($input['password']) || !isset($input['confirm_password'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'All fields (username, password, confirm password) are required']);
            exit;
        }

        $username = trim($input['username']);
        $password = $input['password'];
        $confirmPassword = $input['confirm_password'];

        if (empty($username) || empty($password)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Username and password cannot be empty']);
            exit;
        }

        if (strlen($password) < 6) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Password must be at least 6 characters']);
            exit;
        }

        if ($password !== $confirmPassword) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Passwords do not match']);
            exit;
        }

        // Check if username is taken
        $existing = $this->admin->findByUsername($username);
        if ($existing) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Username is already taken']);
            exit;
        }

        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        $adminId = $this->admin->create($username, $hashedPassword);

        if ($adminId) {
            http_response_code(201);
            echo json_encode(['success' => true, 'admin_id' => (int)$adminId]);
            exit;
        }

        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Failed to create administrator account']);
        exit;
    }

    public function update($id) {
        if (!$id) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Admin ID is required']);
            exit;
        }

        $input = json_decode(file_get_contents('php://input'), true);

        if (!isset($input['password']) || !isset($input['confirm_password'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Password and confirm password are required']);
            exit;
        }

        $password = $input['password'];
        $confirmPassword = $input['confirm_password'];

        if (empty($password)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Password cannot be empty']);
            exit;
        }

        if (strlen($password) < 6) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Password must be at least 6 characters']);
            exit;
        }

        if ($password !== $confirmPassword) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Passwords do not match']);
            exit;
        }

        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        $success = $this->admin->updatePassword($id, $hashedPassword);

        if ($success) {
            echo json_encode(['success' => true]);
            exit;
        }

        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Failed to update administrator password']);
        exit;
    }

    public function destroy($id) {
        if (!$id) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Admin ID is required']);
            exit;
        }

        // Check if there is more than 1 admin remaining
        $count = $this->admin->count();
        if ($count <= 1) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Cannot remove the only remaining administrator account']);
            exit;
        }

        $success = $this->admin->delete($id);
        if ($success) {
            echo json_encode(['success' => true]);
            exit;
        }

        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Failed to remove administrator account']);
        exit;
    }
}
