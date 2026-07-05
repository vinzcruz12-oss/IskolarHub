<?php

require_once __DIR__ . '/../models/Student.php';
require_once __DIR__ . '/../models/Scholarship.php';

class RecommendationService {
    private $student;
    private $scholarship;

    public function __construct() {
        $this->student = new Student();
        $this->scholarship = new Scholarship();
    }

    public function getEligibleScholarships($student_id) {
        $student = $this->student->findById($student_id);
        if (!$student) {
            return ['success' => false, 'error' => 'Student not found'];
        }

        $allScholarships = $this->scholarship->findAll();
        $eligible = [];

        foreach ($allScholarships as $s) {
            $reasons = [];

            $meetsGwa = ($s['minimum_gwa'] == 0) || ($student['gwa'] >= $s['minimum_gwa']);
            if ($meetsGwa) {
                $reasons[] = 'GWA meets the minimum requirement';
            }

            $educationMatches = $student['education_level'] === $s['education_level'];
            if ($educationMatches) {
                $reasons[] = 'Education Level matches';
            }

            $courseMatches = empty($s['course']) || $student['course'] === $s['course'];
            if ($courseMatches) {
                $reasons[] = 'Course matches';
            }

            if ($meetsGwa && $educationMatches && $courseMatches) {
                $eligible[] = array_merge($s, ['reason' => $reasons]);
            }
        }

        if (empty($eligible)) {
            return [
                'success' => false,
                'message' => 'No scholarships matched your current qualifications.'
            ];
        }

        return [
            'success' => true,
            'student' => $student,
            'scholarships' => $eligible
        ];
    }
}
