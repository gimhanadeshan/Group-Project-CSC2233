<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Event;

class EventsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Event::create([
            'event_title' => 'Annual Meeting',
            'location' => 'Conference Hall A',
            'start' => '2024-08-01 09:00:00',
            'end' => '2024-08-01 17:00:00',
        ]);

        Event::factory()->count(20)->create();

       
    }
}
