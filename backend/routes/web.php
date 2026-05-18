<?php

use App\Models\Menu;
use App\Models\MenuSectionItemVariant;
use Illuminate\Support\Facades\Route;

Route::get('/factory', function () {

    $menu = Menu::factory()->create();
    $menuContacts = $menu->Contacts()->createMany(
        [
            ['type' => 'phone', 'value' => '123-456-7890'],
            ['type' => 'email', 'value' => 'e@admin.com']

        ]
    );

    $sections = $menu->Sections()->createMany(
        [
            ['title' => 'Appetizers'],
            ['title' => 'Main Courses'],
            ['title' => 'Desserts'],
        ]
    );

    foreach ($sections as $section) {
        //variants for section
        $variants = $section->Variants()->createMany(
            [
                ['name' => 'Regular', 'menu_id' => $menu->id],
                ['name' => 'Spicy', 'menu_id' => $menu->id],
            ]
        );


        $items = $section->Items()->createMany(
            [
                ['name' => 'Item 1', 'menu_id' => $menu->id, 'menu_section_id' => $section->id],
                ['name' => 'Item 2', 'menu_id' => $menu->id, 'menu_section_id' => $section->id],
            ]
        );
        foreach ($variants as $variant) {

            foreach ($items as $item) {
                //item variants
                $item->Variants()->createMany(
                    [
                        [
                            'price' => 9.99,
                            'menu_id' => $menu->id,
                            'menu_section_id' => $section->id,
                            'menu_section_variant_id' => $variant->id,
                        ],

                    ]
                );
            }
        }
    }
});


Route::get('/test', function () {
    $itemVariant = MenuSectionItemVariant::find(1);
    return $itemVariant;
});


Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'env' => app()->environment()
    ]);
});
