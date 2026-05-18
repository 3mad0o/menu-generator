<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\MenuSectionVariant>
 */
class MenuSectionVariantFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'menu_section_id' => \App\Models\MenuSection::factory(),
            'name' => $this->faker->sentence(2),
            'menu_id' => \App\Models\Menu::factory(),
        ];
    }
}
