<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Course>
 */
class CourseFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->word . ' Course',
            'code' => 'CSC' . $this->faker->numberBetween(1000, 9999),
            'credit_hours' => $this->faker->numberBetween(1, 6),
            'type' => $this->faker->randomElement(['practical', 'theory']),
            'description' => $this->faker->optional()->paragraph,
        ];
    }
}
