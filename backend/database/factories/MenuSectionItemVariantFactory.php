<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\MenuSectionItemVariant>
 */
class MenuSectionItemVariantFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'menu_section_item_id' => \App\Models\MenuSectionItem::factory(),
            'price' => $this->faker->randomFloat(2, 1, 100),
            'menu_id' => \App\Models\Menu::factory(),
            'menu_section_id' => \App\Models\MenuSectionItem::factory(),
            'menu_section_variant_id' => \App\Models\MenuSectionVariant::factory(),
        ];
    }
}
