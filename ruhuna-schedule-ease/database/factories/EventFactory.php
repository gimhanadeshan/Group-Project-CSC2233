<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Event>
 */
class EventFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $start = $this->faker->dateTimeBetween('-1 week', '+1 week');
        $end = (clone $start)->modify('+'.rand(1, 3).' hours');

        return [
            'event_title' => $this->faker->sentence,
            'location' => $this->faker->address,
            'start' => $start,
            'end' => $end,
        ];
    }
}
