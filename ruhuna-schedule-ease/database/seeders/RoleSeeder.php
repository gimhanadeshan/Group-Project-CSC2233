<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Role::create(['name'=>'Admin','role_type'=>'administrator']);
        Role::create(['name'=>'Student','role_type'=>'student']);
        Role::create(['name'=>'Lecturer','role_type'=>'lecturer']);

    }
}
