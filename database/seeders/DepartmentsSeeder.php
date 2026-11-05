<?php

namespace Database\Seeders;

use App\Models\Department;
use App\Models\Faculty;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DepartmentsSeeder extends Seeder
{
    /**
     * Nnamdi Azikiwe University (UNIZIK) departments, grouped by faculty.
     * Source: https://unizik.edu.ng/
     *
     * Faculty keys are looked up via FacultiesSeeder's Str::slug($name, '_')
     * convention, so FacultiesSeeder must run before this seeder.
     */
    public function run(): void
    {
        $departmentsByFaculty = [
            'Arts' => [
                'English Language and Literature',
                'Chinese Studies',
                'History and International Studies',
                'Linguistics',
                'Modern European Languages',
                'Music',
                'Igbo, African and Communication Studies',
                'Philosophy',
                'Religion and Human Relations',
                'Theatre and Film Studies',
            ],
            'Agriculture' => [
                'Agricultural Economics and Extension',
                'Animal Science and Technology',
                'Crop Science and Horticulture',
                'Fisheries and Aquaculture',
                'Food Science and Technology',
                'Forestry and Wildlife Management',
                'Soil Science and Land Resources Management',
            ],
            'Basic Medical Sciences' => [
                'Anatomy',
                'Human Biochemistry',
                'Human Physiology',
            ],
            // Department list sourced from external/search reference — the
            // faculty's own "Departments" page was empty at fetch time.
            'Basic Clinical Sciences' => [
                'Pharmacology & Therapeutics',
                'Chemical Pathology',
                'Haematology & Immunology',
                'Medical Microbiology',
                'Morbid Anatomy (Anatomic Pathology & Forensic Medicine)',
            ],
            'Biosciences' => [
                'Applied Microbiology & Brewing',
                'Applied Biochemistry',
                'Botany',
                'Parasitology & Entomology',
                'Zoology',
            ],
            'Education' => [
                'Adult and Continuing Education',
                'Education Management and Policy',
                'Early Childhood and Primary Education',
                'Educational Foundations',
                'Guidance and Counselling',
                'Human Kinetics and Health Education',
                'Library and Information Science',
                'Science Education',
                'Technology and Vocational Education',
            ],
            'Engineering' => [
                'Agriculture/Bioresources Engineering',
                'Civil Engineering',
                'Chemical Engineering',
                'Electrical Engineering',
                'Electronics/Computer Engineering',
                'Industrial/Production Engineering',
                'Metallurgical/Material Engineering',
                'Mechanical Engineering',
                'Polymer/Textile Engineering',
                'Petroleum Engineering',
            ],
            'Environmental Sciences' => [
                'Architecture',
                'Building',
                'Environmental Management',
                'Estate Management',
                'Fine and Applied Arts',
                'Geography and Meteorology',
                'Quantity Surveying',
                'Surveying and Geo-Informatics',
            ],
            'Health Science and Technology' => [
                'Environmental Health Science',
                'Medical Laboratory Science',
                'Medical Rehabilitation',
                'Nursing Science',
                'Nutrition and Dietetics',
                'Radiography',
            ],
            // Department list sourced from external/search reference (dean/
            // sub-dean profiles) — the faculty's own "Departments" page was
            // empty at fetch time.
            'Law' => [
                'Public and Private Law',
                'International Law and Jurisprudence',
                'Commercial and Property Law',
            ],
            'Management Sciences' => [
                'Accountancy',
                'Banking & Finance',
                'Business Administration',
                'Cooperative Economics & Management',
                'Marketing',
                'Public Administration',
                'Entrepreneurship',
            ],
            'Medicine' => [
                'Anaesthesiology',
                'Community Medicine',
                'Internal Medicine',
                'Mental Health',
                'Obstetrics and Gynaecology',
                'Ophthalmology',
                'Paediatrics',
                'Radiology',
                'Surgery',
            ],
            // Newly established faculty; website is a placeholder with no
            // department listing yet.
            'Medical Laboratory Science' => [],
            'Pharmaceutical Sciences' => [
                'Pharmaceutical Microbiology and Biotechnology',
                'Clinical Pharmacy and Pharmacy Management',
                'Pharmaceutical and Medicinal Chemistry',
                'Pharmaceutics and Pharmaceutical Technology',
                'Pharmacognosy and Traditional Medicine',
                'Pharmacology and Toxicology',
            ],
            'Physical Science' => [
                'Computer Science',
                'Geological Sciences',
                'Applied Geophysics',
                'Industrial Chemistry',
                'Industrial Physics',
                'Mathematics',
                'Statistics',
                'Software Engineering',
                'Cyber Security',
                'Information Technology',
            ],
            'Social Science' => [
                'Economics',
                'Mass Communication',
                'Political Science',
                'Psychology',
                'Sociology and Anthropology',
            ],
            // Newly established faculty; website is a placeholder with no
            // department listing yet.
            'Technology and Vocational Education' => [],
        ];

        $facultyIdsByKey = Faculty::pluck('id', 'key');

        $data = [];

        foreach ($departmentsByFaculty as $facultyName => $departments) {
            $facultyId = $facultyIdsByKey[Str::slug($facultyName, '_')] ?? null;

            foreach ($departments as $departmentName) {
                $data[] = [
                    'name' => $departmentName,
                    'key' => Str::slug($departmentName, '_'),
                    'faculty_id' => $facultyId,
                ];
            }
        }

        Department::insert($data);
    }
}
