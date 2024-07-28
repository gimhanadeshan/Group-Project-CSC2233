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
    $level = $this->faker->numberBetween(1, 4);
    $semester = $this->faker->numberBetween(1, 2);
    $code = $this->faker->unique()->regexify("CSC{$level}{$semester}[0-9][1-3]");

    return [
        'name' => $this->faker->word . ' Course',
        'code' => $code,
        'credit_hours' => $this->faker->numberBetween(1, 6),
        'level' => $level,
        'semester' => $semester,
        'theory_hours'=>$this->faker->randomElement([NULL,1,2,3]),
        'practical_hours'=>$this->faker->randomElement([NULL,1,2,3]),
        'tutorial_hours'=>$this->faker->randomElement([NULL,1]),
        'description' => $this->faker->optional()->paragraph,
    ];
}

}
