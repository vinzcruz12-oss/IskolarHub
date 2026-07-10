<?php

require_once __DIR__ . '/../models/Student.php';

class StudentController {
    private $student;

    public function __construct() {
        $this->student = new Student();
    }

    public function register() {
        $input = json_decode(file_get_contents('php://input'), true);

        if (empty($input)) {
            $input = $_POST;
        }

        $required = ['first_name', 'last_name', 'email', 'password'];
        foreach ($required as $field) {
            if (!isset($input[$field]) || empty($input[$field])) {
                http_response_code(400);
                echo json_encode(['success' => false, 'error' => "Missing required field: $field"]);
                exit;
            }
        }

        if (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Invalid email format']);
            exit;
        }

        if (strlen($input['password']) < 6) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Password must be at least 6 characters']);
            exit;
        }

        if (isset($input['confirm_password']) && $input['password'] !== $input['confirm_password']) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Passwords do not match']);
            exit;
        }

        if (!isset($input['privacy_accepted']) || $input['privacy_accepted'] !== true) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'You must agree to the Privacy Notice and Terms of Use']);
            exit;
        }

        $existing = $this->student->findByEmail($input['email']);
        if ($existing) {
            http_response_code(409);
            echo json_encode(['success' => false, 'error' => 'Email already registered']);
            exit;
        }

        $hashedPassword = password_hash($input['password'], PASSWORD_DEFAULT);
        $student_id = $this->student->create(
            $input['first_name'],
            $input['middle_name'] ?? null,
            $input['last_name'],
            $input['email'],
            $hashedPassword
        );

        http_response_code(201);
        echo json_encode(['success' => true, 'student_id' => (int)$student_id]);
        exit;
    }

    public function login() {
        $input = json_decode(file_get_contents('php://input'), true);

        if (!isset($input['email']) || !isset($input['password'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Email and password required']);
            exit;
        }

        // Try admin authentication first
        require_once __DIR__ . '/../models/Admin.php';
        $admin = new Admin();
        $authAdmin = $admin->verifyPassword($input['email'], $input['password']);
        if ($authAdmin) {
            echo json_encode([
                'success' => true,
                'role' => 'admin',
                'admin_id' => (int)$authAdmin['id'],
                'username' => $authAdmin['username']
            ]);
            exit;
        }

        $authenticated = $this->student->verifyPassword($input['email'], $input['password']);

        if ($authenticated) {
            // Check if student is banned
            if (isset($authenticated['status']) && $authenticated['status'] === 'banned') {
                http_response_code(403);
                echo json_encode(['success' => false, 'error' => 'Your account has been banned by the administrator.']);
                exit;
            }
            $fullname = trim(($authenticated['first_name'] ?? '') . ' ' . ($authenticated['middle_name'] ?? '') . ' ' . ($authenticated['last_name'] ?? ''));
            echo json_encode(['success' => true, 'role' => 'student', 'student_id' => (int)$authenticated['id'], 'fullname' => $fullname]);
            exit;
        }

        http_response_code(401);
        echo json_encode(['success' => false, 'error' => 'Invalid credentials']);
        exit;
    }

    public function save() {
        $input = json_decode(file_get_contents('php://input'), true);

        $required = ['first_name', 'last_name', 'email', 'password', 'course', 'gwa'];
        foreach ($required as $field) {
            if (!isset($input[$field]) || empty($input[$field])) {
                http_response_code(400);
                echo json_encode(['success' => false, 'error' => "Missing required field: $field"]);
                exit;
            }
        }

        if (!is_numeric($input['gwa']) || $input['gwa'] < 0 || $input['gwa'] > 100) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'GWA must be between 0 and 100']);
            exit;
        }

        if (!isset($input['privacy_accepted']) || $input['privacy_accepted'] !== true) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'You must agree to the Privacy Notice and Terms of Use']);
            exit;
        }

        $existing = $this->student->findByEmail($input['email']);
        if ($existing) {
            http_response_code(200);
            echo json_encode(['success' => true, 'student_id' => (int)$existing['id']]);
            exit;
        }

        $hashedPassword = password_hash($input['password'], PASSWORD_DEFAULT);
        $student_id = $this->student->create(
            $input['first_name'],
            $input['middle_name'] ?? null,
            $input['last_name'],
            $input['email'],
            $hashedPassword,
            $input['course'],
            $input['gwa']
        );

        http_response_code(201);
        echo json_encode(['success' => true, 'student_id' => (int)$student_id]);
        exit;
    }

    public function index() {
        $students = $this->student->findAll();
        echo json_encode(['success' => true, 'data' => $students]);
        exit;
    }

    public function update() {
        $input = json_decode(file_get_contents('php://input'), true);

        if (!isset($input['id'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'ID is required']);
            exit;
        }

        $existing = $this->student->findById($input['id']);
        if (!$existing) {
            http_response_code(404);
            echo json_encode(['success' => false, 'error' => 'Student not found']);
            exit;
        }

        // Extra step: verify password if updating critical fields (names, password)
        $needsVerification = false;
        if (isset($input['first_name']) && $input['first_name'] !== $existing['first_name']) $needsVerification = true;
        if (isset($input['last_name']) && $input['last_name'] !== $existing['last_name']) $needsVerification = true;
        if (isset($input['new_password']) && !empty($input['new_password'])) $needsVerification = true;

        if ($needsVerification) {
            if (!isset($input['confirm_password']) || empty($input['confirm_password'])) {
                http_response_code(400);
                echo json_encode(['success' => false, 'error' => 'Account password is required to change Name or Password.']);
                exit;
            }
            $verified = $this->student->verifyPasswordById($input['id'], $input['confirm_password']);
            if (!$verified) {
                http_response_code(401);
                echo json_encode(['success' => false, 'error' => 'Incorrect verification password. Change failed.']);
                exit;
            }
        }

        $updateData = [];
        if (array_key_exists('first_name', $input)) $updateData['first_name'] = $input['first_name'];
        if (array_key_exists('middle_name', $input)) $updateData['middle_name'] = $input['middle_name'];
        if (array_key_exists('last_name', $input)) $updateData['last_name'] = $input['last_name'];
        if (array_key_exists('age', $input)) $updateData['age'] = $input['age'];
        if (array_key_exists('current_school', $input)) $updateData['current_school'] = $input['current_school'];
        if (array_key_exists('strand', $input)) $updateData['strand'] = $input['strand'];
        if (array_key_exists('course', $input)) $updateData['course'] = $input['course'];
        if (array_key_exists('phone_number', $input)) $updateData['phone_number'] = $input['phone_number'];
        if (array_key_exists('gender', $input)) $updateData['gender'] = $input['gender'];
        if (array_key_exists('address', $input)) $updateData['address'] = $input['address'];
        if (array_key_exists('country', $input)) $updateData['country'] = $input['country'];
        if (isset($input['new_password']) && !empty($input['new_password'])) {
            if (strlen($input['new_password']) < 6) {
                http_response_code(400);
                echo json_encode(['success' => false, 'error' => 'New password must be at least 6 characters']);
                exit;
            }
            $updateData['password'] = password_hash($input['new_password'], PASSWORD_DEFAULT);
        }
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

        $this->student->update($input['id'], $updateData);

        http_response_code(200);
        echo json_encode(['success' => true, 'message' => 'Profile updated']);
        exit;
    }

    public function show($id) {
        if (!$id) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'ID is required']);
            exit;
        }

        $result = $this->student->findById($id);
        if (!$result) {
            http_response_code(404);
            echo json_encode(['success' => false, 'error' => 'Student not found']);
            exit;
        }

        http_response_code(200);
        echo json_encode(['success' => true, 'data' => $result]);
        exit;
    }

    public function adminUpdate() {
        $input = json_decode(file_get_contents('php://input'), true);

        if (!isset($input['id'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'ID is required']);
            exit;
        }

        $existing = $this->student->findById($input['id']);
        if (!$existing) {
            http_response_code(404);
            echo json_encode(['success' => false, 'error' => 'Student not found']);
            exit;
        }

        $updateData = [];
        if (array_key_exists('first_name', $input)) $updateData['first_name'] = $input['first_name'];
        if (array_key_exists('middle_name', $input)) $updateData['middle_name'] = $input['middle_name'];
        if (array_key_exists('last_name', $input)) $updateData['last_name'] = $input['last_name'];
        if (array_key_exists('email', $input)) $updateData['email'] = $input['email'];
        if (array_key_exists('age', $input)) $updateData['age'] = $input['age'];
        if (array_key_exists('current_school', $input)) $updateData['current_school'] = $input['current_school'];
        if (array_key_exists('strand', $input)) $updateData['strand'] = $input['strand'];
        if (array_key_exists('course', $input)) $updateData['course'] = $input['course'];
        if (array_key_exists('gwa', $input)) $updateData['gwa'] = floatval($input['gwa']);
        if (array_key_exists('phone_number', $input)) $updateData['phone_number'] = $input['phone_number'];
        if (array_key_exists('gender', $input)) $updateData['gender'] = $input['gender'];
        if (array_key_exists('address', $input)) $updateData['address'] = $input['address'];
        if (array_key_exists('country', $input)) $updateData['country'] = $input['country'];
        if (array_key_exists('status', $input)) $updateData['status'] = $input['status'];

        if (isset($input['new_password']) && !empty($input['new_password'])) {
            if (strlen($input['new_password']) < 6) {
                http_response_code(400);
                echo json_encode(['success' => false, 'error' => 'Password must be at least 6 characters']);
                exit;
            }
            $updateData['password'] = password_hash($input['new_password'], PASSWORD_DEFAULT);
        }

        $success = $this->student->update($input['id'], $updateData);
        if ($success) {
            echo json_encode(['success' => true]);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => 'Failed to update student profile']);
        }
        exit;
    }

    public function delete() {
        $input = json_decode(file_get_contents('php://input'), true);

        if (!isset($input['id'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'ID is required']);
            exit;
        }

        $existing = $this->student->findById($input['id']);
        if (!$existing) {
            http_response_code(404);
            echo json_encode(['success' => false, 'error' => 'Student not found']);
            exit;
        }

        $success = $this->student->delete($input['id']);
        if ($success) {
            echo json_encode(['success' => true]);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => 'Failed to delete student account']);
        }
        exit;
    }
}
