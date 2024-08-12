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
            ['id' => 1, 'name' => 'create_user', 'module_name' => 'User Management'],
            ['id' => 2, 'name' => 'read_user', 'module_name' => 'User Management'],
            ['id' => 3, 'name' => 'update_user', 'module_name' => 'User Management'],
            ['id' => 4, 'name' => 'delete_user', 'module_name' => 'User Management'],
            ['id' => 5, 'name' => 'create_timetable', 'module_name' => 'Timetable Management'],
            ['id' => 6, 'name' => 'read_timetable', 'module_name' => 'Timetable Management'],
            ['id' => 7, 'name' => 'update_timetable', 'module_name' => 'Timetable Management'],
            ['id' => 8, 'name' => 'delete_timetable', 'module_name' => 'Timetable Management'],
            ['id' => 9, 'name' => 'create_course', 'module_name' => 'Course Management'],
            ['id' => 10, 'name' => 'read_course', 'module_name' => 'Course Management'],
            ['id' => 11, 'name' => 'update_course', 'module_name' => 'Course Management'],
            ['id' => 12, 'name' => 'delete_course', 'module_name' => 'Course Management'],
            ['id' => 13, 'name' => 'create_lecture_hall', 'module_name' => 'Lecture Hall Management'],
            ['id' => 14, 'name' => 'read_lecture_hall', 'module_name' => 'Lecture Hall Management'],
            ['id' => 15, 'name' => 'update_lecture_hall', 'module_name' => 'Lecture Hall Management'],
            ['id' => 16, 'name' => 'delete_lecture_hall', 'module_name' => 'Lecture Hall Management'],
            ['id' => 17, 'name' => 'create_semester', 'module_name' => 'Semester Management'],
            ['id' => 18, 'name' => 'read_semester', 'module_name' => 'Semester Management'],
            ['id' => 19, 'name' => 'update_semester', 'module_name' => 'Semester Management'],
            ['id' => 20, 'name' => 'delete_semester', 'module_name' => 'Semester Management'],
            ['id' => 21, 'name' => 'create_event', 'module_name' => 'Event Management'],
            ['id' => 22, 'name' => 'read_event', 'module_name' => 'Event Management'],
            ['id' => 23, 'name' => 'update_event', 'module_name' => 'Event Management'],
            ['id' => 24, 'name' => 'delete_event', 'module_name' => 'Event Management'],
            ['id' => 25, 'name' => 'create_degree_program', 'module_name' => 'User Management'],
            ['id' => 26, 'name' => 'read_degree_program', 'module_name' => 'User Management'],
            ['id' => 27, 'name' => 'update_degree_program', 'module_name' => 'User Management'],
            ['id' => 28, 'name' => 'delete_degree_program', 'module_name' => 'User Management'],
            ['id' => 29, 'name' => 'create_role', 'module_name' => 'User Management'],
            ['id' => 30, 'name' => 'read_role', 'module_name' => 'User Management'],
            ['id' => 31, 'name' => 'update_role', 'module_name' => 'User Management'],
            ['id' => 32, 'name' => 'delete_role', 'module_name' => 'User Management'],
            ['id' => 33, 'name' => 'update_module_name', 'module_name' => 'User Management'],
            ['id' => 34, 'name' => 'read_permission', 'module_name' => 'User Management'],
            ['id' => 35, 'name' => 'export_users', 'module_name' => 'User Management'],
            ['id' => 36, 'name' => 'import_users', 'module_name' => 'User Management'],
            ['id' => 37, 'name' => 'read_course_registration', 'module_name' => 'Course Registration'],
            ['id' => 38, 'name' => 'read_course_confirmation', 'module_name' => 'Course Registration'],
           
            
        ];

        DB::table('permissions')->insert($permissions);
    }
}
