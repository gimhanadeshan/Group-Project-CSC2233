<?php

namespace Database\Seeders;

use App\Models\Semester;
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
                    'academic_year' =>2021,
                    'level' => 1,
                    'semester' => 2,
                    'reference_number' => 'L1S22021']);
                Semester::factory()->create([
                    'academic_year' =>2021,
                    'level' => 1,
                    'semester' => 1,
                    'reference_number' => 'L1S12021']);
                Semester::factory()->create([
                    'academic_year' =>2021,
                    'level' => 2,
                    'semester' => 2,
                    'reference_number' => 'L2S22021']);





    }
}
