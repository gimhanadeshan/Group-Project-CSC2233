<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PermissionRoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permission_roles = [
            // Admin permissions
            ['permission_id' => 1, 'role_id' => 1], // Admin can create user
            ['permission_id' => 2, 'role_id' => 1], // Admin can read user
            ['permission_id' => 3, 'role_id' => 1], // Admin can update user
            ['permission_id' => 4, 'role_id' => 1], // Admin can delete user
            ['permission_id' => 5, 'role_id' => 1], // Admin can create timetable
            ['permission_id' => 6, 'role_id' => 1], // Admin can read timetable
            ['permission_id' => 7, 'role_id' => 1], // Admin can update timetable
            ['permission_id' => 8, 'role_id' => 1], // Admin can delete timetable
            ['permission_id' => 9, 'role_id' => 1], // Admin can create course
            ['permission_id' => 10, 'role_id' => 1], // Admin can read course
            ['permission_id' => 11, 'role_id' => 1], // Admin can update course
            ['permission_id' => 12, 'role_id' => 1], // Admin can delete course
            ['permission_id' => 13, 'role_id' => 1], // Admin can create lecture hall
            ['permission_id' => 14, 'role_id' => 1], // Admin can read lecture hall
            ['permission_id' => 15, 'role_id' => 1], // Admin can update lecture hall
            ['permission_id' => 16, 'role_id' => 1], // Admin can delete lecture hall
            ['permission_id' => 17, 'role_id' => 1], // Admin can create semester
            ['permission_id' => 18, 'role_id' => 1], // Admin can read semester
            ['permission_id' => 19, 'role_id' => 1], // Admin can update semester
            ['permission_id' => 20, 'role_id' => 1], // Admin can delete semester
            ['permission_id' => 21, 'role_id' => 1], // Admin can create event
            ['permission_id' => 22, 'role_id' => 1], // Admin can read event
            ['permission_id' => 23, 'role_id' => 1], // Admin can update event
            ['permission_id' => 24, 'role_id' => 1], // Admin can delete event
            // Editor permissions
            ['permission_id' => 2, 'role_id' => 2], // Editor can read user
            ['permission_id' => 3, 'role_id' => 2], // Editor can update user
            ['permission_id' => 6, 'role_id' => 2], // Editor can read timetable
            ['permission_id' => 7, 'role_id' => 2], // Editor can update timetable
            ['permission_id' => 10, 'role_id' => 2], // Editor can read course
            ['permission_id' => 11, 'role_id' => 2], // Editor can update course
            ['permission_id' => 14, 'role_id' => 2], // Editor can read lecture hall
            ['permission_id' => 15, 'role_id' => 2], // Editor can update lecture hall
            ['permission_id' => 18, 'role_id' => 2], // Editor can read semester
            ['permission_id' => 19, 'role_id' => 2], // Editor can update semester
            ['permission_id' => 22, 'role_id' => 2], // Editor can read event
            ['permission_id' => 23, 'role_id' => 2], // Editor can update event
            // Add more role-permission associations as needed
        ];

        DB::table('permission_role')->insert($permission_roles);
    }
}
