<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = [
            ['id' => 1, 'name' => 'create_user'],
            ['id' => 2, 'name' => 'read_user'],
            ['id' => 3, 'name' => 'update_user'],
            ['id' => 4, 'name' => 'delete_user'],
            ['id' => 5, 'name' => 'create_timetable'],
            ['id' => 6, 'name' => 'read_timetable'],
            ['id' => 7, 'name' => 'update_timetable'],
            ['id' => 8, 'name' => 'delete_timetable'],
            ['id' => 9, 'name' => 'create_course'],
            ['id' => 10, 'name' => 'read_course'],
            ['id' => 11, 'name' => 'update_course'],
            ['id' => 12, 'name' => 'delete_course'],
            ['id' => 13, 'name' => 'create_lecture_hall'],
            ['id' => 14, 'name' => 'read_lecture_hall'],
            ['id' => 15, 'name' => 'update_lecture_hall'],
            ['id' => 16, 'name' => 'delete_lecture_hall'],
            ['id' => 17, 'name' => 'create_semester'],
            ['id' => 18, 'name' => 'read_semester'],
            ['id' => 19, 'name' => 'update_semester'],
            ['id' => 20, 'name' => 'delete_semester'],
            ['id' => 21, 'name' => 'create_event'],
            ['id' => 22, 'name' => 'read_event'],
            ['id' => 23, 'name' => 'update_event'],
            ['id' => 24, 'name' => 'delete_event'],
            // Add more permissions as needed
        ];

        DB::table('permissions')->insert($permissions);
    }
}
