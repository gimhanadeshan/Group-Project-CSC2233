<?php

namespace Database\Seeders;

use App\Models\LectureHall;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class LectureHallSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        LectureHall::factory()->count(10)->create();
    }
}
