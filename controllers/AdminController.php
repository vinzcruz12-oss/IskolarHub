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
}
