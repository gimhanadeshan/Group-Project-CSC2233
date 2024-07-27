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

        User::factory(50)->create();
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'registration_no'=>'sc11111',
            'role_id'=>1,

        ]);



    }


}
