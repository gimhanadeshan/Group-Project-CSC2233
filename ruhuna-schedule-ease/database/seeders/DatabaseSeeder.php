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
        $this->call(DegreeProgramsTableSeeder::class);
        $this->call([SemesterSeeder::class]);
        $this->call(CourseTypesSeeder::class);
        //$this->call([EventsSeeder::class]);



        User::factory()->create([

            'name' => 'Admin',
            'email' => 'admin@example.com',
            'registration_no'=>'Admin',
            'role_id'=>1,
            'degree_program_id'=>1,

        ]);
        
        User::factory()->create([

            'name' => 'Student1',
            'email' => 'student1@example.com',
            'registration_no'=>'sc1',
            'role_id'=>2,
            'academic_year'=>2021,
            'degree_program_id'=>1,
           
           
        ]);
        User::factory()->create([

            'name' => 'Student2',
            'email' => 'student2@example.com',
            'registration_no'=>'sc2',
            'role_id'=>2,
            'academic_year'=>2022,
            'degree_program_id'=>2,
           
           
        ]);
        User::factory()->create([

            'name' => 'Student3',
            'email' => 'student3@example.com',
            'registration_no'=>'sc3',
            'role_id'=>2,
            'academic_year'=>2023,
            'degree_program_id'=>2,
           
           
           
        ]);
        User::factory()->create([

            'name' => 'Student4',
            'email' => 'student4@example.com',
            'registration_no'=>'sc4',
            'role_id'=>2,
            'academic_year'=>2024,
            'degree_program_id'=>1,
           
           
           
        ]);

        User::factory()->create([

            'name' => 'Lecturer',
            'email' => 'lecturer@example.com',
            'registration_no'=>'Lecturer',
            'role_id'=>3,
            
           
        ]);

        User::factory()->count(10)->create();



        $this->call([
            PermissionSeeder::class,
            PermissionRoleSeeder::class,
        ]);


    }


}
