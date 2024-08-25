<?php

namespace Database\Seeders;

use App\Models\Semester;
use App\Models\DegreeProgram; // Import the DegreeProgram model
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SemesterSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        

        Semester::factory()->create([
            'academic_year' => 2021,
            'level' => 3,
            'semester' => 1,
            'degree_program_id' => 1,
        ]);
        Semester::factory()->create([
            'academic_year' => 2022,
            'level' => 2,
            'semester' => 1,
            'degree_program_id' => 2,
        ]);
        Semester::factory()->create([
            'academic_year' => 2023,
            'level' => 1,
            'semester' => 1,
            'degree_program_id' => 1,
        ]);
        Semester::factory()->create([
            'academic_year' => 2024,
            'level' => 1,
            'semester' => 1,
            'degree_program_id' => 1,
        ]);
        Semester::factory()->create([
            'academic_year' => 2021,
            'level' => 3,
            'semester' => 2,
            'degree_program_id' => 1,
        ]);
        Semester::factory()->create([
            'academic_year' => 2022,
            'level' => 2,
            'semester' => 2,
            'degree_program_id' => 1,
        ]);
        Semester::factory()->create([
            'academic_year' => 2023,
            'level' => 1,
            'semester' => 2,
            'degree_program_id' => 1,
        ]);
        Semester::factory()->create([
            'academic_year' => 2024,
            'level' => 1,
            'semester' => 2,
            'degree_program_id' =>1,
        ]);
    }
}
