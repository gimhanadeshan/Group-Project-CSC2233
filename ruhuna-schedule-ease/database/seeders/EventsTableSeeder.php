<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EventsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('events')->insert([
            [
                'title' => 'Annual Meeting',
                'subject_code' => 'AM123',
                'location' => 'Conference Hall A',
                'start' => '2024-08-01 09:00:00',
                'end' => '2024-08-01 17:00:00',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Project Kickoff',
                'subject_code' => 'PK456',
                'location' => 'Room 101',
                'start' => '2024-08-05 10:00:00',
                'end' => '2024-08-05 12:00:00',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Tech Conference',
                'subject_code' => 'TC789',
                'location' => 'Main Auditorium',
                'start' => '2024-09-10 08:00:00',
                'end' => '2024-09-10 18:00:00',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // Add more sample events as needed
        ]);
    }
}
