<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;



class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */

    public function run(): void
    {

        $this->call([RoleSeeder::class]);
        $this->call([LectureHallSeeder::class]);
        $this->call([CourseSeeder::class]);
        $this->call([SemesterSeeder::class]);
        //$this->call([EventsSeeder::class]);



        User::factory()->create([

            'name' => 'Admin',
            'email' => 'admin@example.com',
            'registration_no'=>'Admin',
            'role_id'=>1,

        ]);
        
        User::factory()->create([

            'name' => 'Student',
            'email' => 'student@example.com',
            'registration_no'=>'Student',
            'role_id'=>2,
            'academic_year'=>2021,
           
           
        ]);

        User::factory()->create([

            'name' => 'Lecturer',
            'email' => 'lecturer@example.com',
            'registration_no'=>'Lecturer',
            'role_id'=>3,
           
        ]);

        User::factory()->count(30)->create();



        $this->call([
            PermissionSeeder::class,
            PermissionRoleSeeder::class,
        ]);


    }


}
