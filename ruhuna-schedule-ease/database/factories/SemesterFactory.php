<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Carbon\Carbon;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Semester>
 */
class SemesterFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {



        // return [
        //     'start_date' => $this->faker->date(),
        //     'end_date' => $this->faker->date(),
        // ];
        return [
            'start_date' => $start_date = $this->faker->dateTimeBetween('now', '+6 months')->format('Y-m-d'),
            'end_date' => Carbon::parse($start_date)->addMonths(6)->format('Y-m-d'),
        ];
    }
}
