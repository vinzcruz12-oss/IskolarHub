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

    public function getEligibleScholarships($student_id, $custom_student = null) {
        if ($custom_student !== null) {
            $student = $custom_student;
        } else {
            $student = $this->student->findById($student_id);
            if (!$student) {
                return ['success' => false, 'error' => 'Student not found'];
            }
        }

        $allScholarships = $this->scholarship->findAll();
        $eligible = [];

        foreach ($allScholarships as $s) {
            // 1. University Filter
            if (!$this->universityMatches($student['current_school'] ?? '', $s['university'])) {
                continue;
            }

            // 2. GWA Filter
            $studentGwa = $student['gwa'];
            $reqGwa = $s['minimum_gwa'];

            $normalizedStudentGwa = $this->normalizeGwa($studentGwa, $student['current_school'] ?? '');
            $normalizedReqGwa = $this->normalizeGwa($reqGwa, $s['university']);

            $meetsGwa = (empty($reqGwa) || floatval($reqGwa) == 0) || ($normalizedStudentGwa >= $normalizedReqGwa);
            if (!$meetsGwa) {
                continue;
            }

            // 3. Course Filter
            if (!$this->courseMatches($student['course'] ?? '', $s['course'])) {
                continue;
            }

            // Calculate relevance score
            $score = 0;
            $reasons = [];

            // GWA match reason
            if (!empty($reqGwa) && floatval($reqGwa) > 0) {
                $reasons[] = 'GWA meets the minimum requirement';
                $score += 3;
            } else {
                $reasons[] = 'No GWA requirement (eligible)';
            }

            // University score
            if (!empty($student['current_school'])) {
                $studentSchool = strtolower(trim($student['current_school']));
                $sUniversity = strtolower(trim($s['university']));
                if ($sUniversity === $studentSchool) {
                    $score += 10;
                    $reasons[] = 'Enrolled in ' . $s['university'];
                } else if (strpos($sUniversity, $studentSchool) !== false || strpos($studentSchool, $sUniversity) !== false) {
                    $score += 8;
                    $reasons[] = 'Enrolled in matching school: ' . $s['university'];
                } else {
                    $score += 5; // Abbreviation matching
                    $reasons[] = 'School matches ' . $s['university'] . ' (abbreviation)';
                }
            } else {
                $reasons[] = 'University matches (general recommendation)';
            }

            // Course score
            $sCourse = strtolower(trim($s['course']));
            if (!empty($s['course']) && !in_array($sCourse, ['all programs', 'all undergraduate programs', 'eligible programs', 'any'])) {
                $score += 5;
                $reasons[] = 'Course matches specific program requirements';
            } else {
                $reasons[] = 'Course matches general program requirements';
            }

            $eligible[] = array_merge($s, [
                'reason' => $reasons,
                'score' => $score
            ]);
        }

        if (empty($eligible)) {
            return [
                'success' => false,
                'message' => 'No scholarships matched your current qualifications.'
            ];
        }

        // Sort by score descending, then by created_at descending
        usort($eligible, function($a, $b) {
            if ($b['score'] === $a['score']) {
                return strcmp($b['created_at'], $a['created_at']);
            }
            return $b['score'] - $a['score'];
        });

        // Limit to top 5 matches
        $eligible = array_slice($eligible, 0, 5);

        return [
            'success' => true,
            'student' => $student,
            'scholarships' => $eligible
        ];
    }

    private function normalizeGwa($gwa, $schoolName) {
        $gwa = floatval($gwa);
        if ($gwa <= 0) {
            return 0.0;
        }
        $schoolNameLower = strtolower($schoolName);
        $isDlsuScale = (strpos($schoolNameLower, 'la salle') !== false) || (strpos($schoolNameLower, 'dlsu') !== false);
        
        if ($isDlsuScale) {
            if ($gwa <= 4.0) {
                return ($gwa / 4.0) * 100;
            }
        } else {
            if ($gwa <= 5.0) {
                return 100 - ($gwa - 1.0) * 12.5;
            }
        }
        return $gwa;
    }

    private function universityMatches($studentSchool, $scholarshipUni) {
        if (empty($studentSchool)) {
            return true;
        }
        $studentSchool = strtolower(trim($studentSchool));
        $sUniversity = strtolower(trim($scholarshipUni));

        if ($sUniversity === $studentSchool) {
            return true;
        }
        if (strpos($sUniversity, $studentSchool) !== false || strpos($studentSchool, $sUniversity) !== false) {
            return true;
        }

        // Abbreviation matching helper
        $abbrs = [
            'up' => ['university of the philippines', 'up diliman', 'upd'],
            'dlsu' => ['de la salle', 'la salle'],
            'ust' => ['santo tomas', 'san martin', 'santo domingo', 'university of santo tomas'],
            'feu' => ['far eastern', 'far eastern university'],
            'admu' => ['ateneo', 'ateneo de manila university'],
            'nu' => ['national university'],
            'ue' => ['university of the east']
        ];

        foreach ($abbrs as $key => $names) {
            $sMatch = false;
            $studentMatch = false;

            if (strpos($sUniversity, $key) !== false) $sMatch = true;
            foreach ($names as $name) {
                if (strpos($sUniversity, $name) !== false) $sMatch = true;
            }

            if (strpos($studentSchool, $key) !== false) $studentMatch = true;
            foreach ($names as $name) {
                if (strpos($studentSchool, $name) !== false) $studentMatch = true;
            }

            if ($sMatch && $studentMatch) {
                return true;
            }
        }

        return false;
    }

    private function courseMatches($studentCourse, $scholarshipCourse) {
        if (empty($scholarshipCourse)) {
            return true;
        }
        $sCourse = strtolower(trim($scholarshipCourse));
        $studentCourse = strtolower(trim($studentCourse));

        if ($sCourse === 'all programs' || $sCourse === 'all undergraduate programs' || $sCourse === 'eligible programs' || $sCourse === 'any') {
            return true;
        }

        // Normalize common prefixes/suffixes
        $normalize = function($c) {
            $c = str_replace([
                'bs in ', 'ba in ', 'bachelor of science in ', 'bachelor of arts in ', 'bachelor of ', 
                'bs ', 'ba ', 'ms ', 'ma ', 'master of ', ' degree programs', ' degree program', ' programs', ' program'
            ], '', $c);
            return strtolower(trim($c));
        };

        $normSCourse = $normalize($sCourse);
        $normStudentCourse = $normalize($studentCourse);

        if ($normSCourse === $normStudentCourse) {
            return true;
        }
        if (strpos($normStudentCourse, $normSCourse) !== false || strpos($normSCourse, $normStudentCourse) !== false) {
            return true;
        }

        // Fallback custom group matching
        if ($sCourse === 'science programs' && (
            strpos($studentCourse, 'science') !== false || 
            strpos($studentCourse, 'biology') !== false || 
            strpos($studentCourse, 'chemistry') !== false || 
            strpos($studentCourse, 'physics') !== false || 
            strpos($studentCourse, 'mathematics') !== false
        )) {
            return true;
        }
        if ($sCourse === 'information technology' && (
            strpos($studentCourse, 'computer') !== false || 
            strpos($studentCourse, 'information') !== false || 
            strpos($studentCourse, 'software') !== false || 
            strpos($studentCourse, 'data science') !== false || 
            strpos($studentCourse, 'cybersecurity') !== false
        )) {
            return true;
        }
        if ($sCourse === 'engineering' && strpos($studentCourse, 'engineering') !== false) {
            return true;
        }
        if ($sCourse === 'business administration' && (
            strpos($studentCourse, 'business') !== false || 
            strpos($studentCourse, 'marketing') !== false || 
            strpos($studentCourse, 'finance') !== false || 
            strpos($studentCourse, 'management') !== false ||
            strpos($studentCourse, 'accounts') !== false ||
            strpos($studentCourse, 'accounting') !== false ||
            strpos($studentCourse, 'accountancy') !== false
        )) {
            return true;
        }
        if ($sCourse === 'accountancy' && (
            strpos($studentCourse, 'accountancy') !== false || 
            strpos($studentCourse, 'accounting') !== false || 
            strpos($studentCourse, 'auditing') !== false
        )) {
            return true;
        }
        if ($sCourse === 'dentistry' && (
            strpos($studentCourse, 'dentistry') !== false || 
            strpos($studentCourse, 'dental') !== false
        )) {
            return true;
        }
        if ($sCourse === 'identified degree programs' && strpos($studentCourse, 'education') !== false) {
            return true;
        }

        return false;
    }
}

