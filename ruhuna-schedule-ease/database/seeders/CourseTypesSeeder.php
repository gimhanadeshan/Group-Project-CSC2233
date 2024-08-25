<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CourseTypesSeeder extends Seeder
{
    /**
     * Seed the course_types table.
     *
     * @return void
     */
    public function run()
    {
        $courseTypes = [
            ['type' => 'Theory'],
            ['type' => 'Tutorial'],
            ['type' => 'Practical'],
        ];

        DB::table('course_types')->insert($courseTypes);
    }
}
