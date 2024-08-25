<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DegreeProgramsTableSeeder extends Seeder
{
    public function run()
    {
        $degreePrograms = [
            [
                'name' => 'BCS ',
                'description' => 'A program that focuses on the principles and technologies used in the development of computing systems.',
            ],
            [
                'name' => 'BSc. in Computer Science ',
                'description' => 'This program offers students an understanding of the human mind and behavior through the study of mental processes and social interactions.',
            ],
            [
                'name' => 'FMIS',
                'description' => 'A comprehensive program that provides a solid foundation in business principles and practices.',
            ],
            [
                'name' => 'BSc in Physical Science',
                'description' => 'This program is designed to provide a strong foundation in mechanical engineering concepts and their practical applications.',
            ],
            [
                'name' => 'Bachelor of Arts IT',
                'description' => 'A program that develops students\' artistic talents and skills in various forms of visual and performing arts.',
            ],
        ];

        DB::table('degree_programs')->insert($degreePrograms);
    }
}
