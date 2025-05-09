<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\LectureHall>
 */
class LectureHallFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->unique()->word, // Generates a unique word for the name
            'capacity' => $this->faker->numberBetween(100, 500), // Generates a random number between 50 and 500
        ];
    }
}
