<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Course;

class CourseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $courses = [
            [
                'name' => 'Introduction to Computer Science',
                'code' => 'CS101',
                'credit_hours' => 3,
                'type' => 'theory',
                'description' => 'Basic concepts of computer science.'
            ],
            [
                'name' => 'Data Structures',
                'code' => 'CS102',
                'credit_hours' => 4,
                'type' => 'theory',
                'description' => 'Introduction to data structures and algorithms.'
            ],
            [
                'name' => 'Database Systems',
                'code' => 'CS103',
                'credit_hours' => 3,
                'type' => 'theory',
                'description' => 'Fundamentals of database systems.'
            ],
            [
                'name' => 'Operating Systems',
                'code' => 'CS104',
                'credit_hours' => 4,
                'type' => 'theory',
                'description' => 'Concepts of operating systems and their implementation.'
            ],
            [
                'name' => 'Software Engineering',
                'code' => 'CS105',
                'credit_hours' => 3,
                'type' => 'theory',
                'description' => 'Principles of software engineering.'
            ],
            [
                'name' => 'Web Development',
                'code' => 'CS106',
                'credit_hours' => 3,
                'type' => 'practical',
                'description' => 'Introduction to web development using modern frameworks.'
            ],
            [
                'name' => 'Computer Networks',
                'code' => 'CS107',
                'credit_hours' => 3,
                'type' => 'theory',
                'description' => 'Basics of computer networking.'
            ],
            [
                'name' => 'Artificial Intelligence',
                'code' => 'CS108',
                'credit_hours' => 4,
                'type' => 'theory',
                'description' => 'Introduction to artificial intelligence and machine learning.'
            ]
        ];

        foreach ($courses as $course) {
            Course::create($course);
        }
    }
}
