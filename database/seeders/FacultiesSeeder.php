<?php

namespace Database\Seeders;

use App\Models\Faculty;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class FacultiesSeeder extends Seeder
{
    /**
     * Nnamdi Azikiwe University (UNIZIK) faculties.
     * Source: https://unizik.edu.ng/
     */
    public function run(): void
    {
        $faculties = [
            'Arts',
            'Agriculture',
            'Basic Medical Sciences',
            'Basic Clinical Sciences',
            'Biosciences',
            'Education',
            'Engineering',
            'Environmental Sciences',
            'Health Science and Technology',
            'Law',
            'Management Sciences',
            'Medicine',
            'Medical Laboratory Science',
            'Pharmaceutical Sciences',
            'Physical Science',
            'Social Science',
            'Technology and Vocational Education',
        ];

        $data = array_map(fn ($name) => [
            'name' => $name,
            'key' => Str::slug($name, '_'),
        ], $faculties);

        Faculty::insert($data);
    }
}
