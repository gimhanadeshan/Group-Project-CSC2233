<?php

namespace Database\Seeders;

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
        // User::factory(10)->create();

       

        $this->call([RoleSeeder::class]);

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'registration_no'=>'Admin',
            'role_id'=>1,
           
        ]);
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'registration_no'=>'Lecturer',
            'role_id'=>2,
           
        ]);
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'registration_no'=>'Student',
            'role_id'=>3,
           
        ]);

       
       
    }

    
}
