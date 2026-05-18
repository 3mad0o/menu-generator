<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\MenuSectionItemResource;
use App\Http\Resources\Api\V1\MenuSectionResource;
use App\Http\Resources\Api\V1\MenuSectionVariantResource;
use App\Models\Menu;
use App\Models\MenuSectionItem;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class MenuSectionController extends Controller
{
    public function creatSection(Request $request, $slug)
    {

        $menu = Menu::where('slug', $slug)->firstOrFail();


        $section = $menu->Sections()->create([
            'order' => $menu->Sections()->count() + 1,
        ]);

        $section->loadMissing('Items.Variants', 'Variants');

        return successResponse(MenuSectionResource::make($section), "Section created successfully", 201);
    }



    public function updateSectionName(Request $request, $slug, $sectionId)
    {
        $request->validate([
            'title' => 'nullable|string|max:255',
        ]);

        $menu = Menu::where('slug', $slug)->firstOrFail();

        $section = $menu->Sections()->where('id', $sectionId)->firstOrFail();
        $section->update([
            'title' => $request->input('title'),
        ]);

        return successResponse(MenuSectionResource::make($section), "Section updated successfully", 200);
    }



    public function deleteSection(Request $request, $slug, $sectionId)
    {

        $menu = Menu::where('slug', $slug)->firstOrFail();

        $section = $menu->Sections()->where('id', $sectionId)->firstOrFail();
        $section->delete();

        return successResponse(null, "Section deleted successfully", 200);
    }



    public function createSectionVariant(Request $request, $slug, $sectionId)
    {
        $menu = Menu::where('slug', $slug)->firstOrFail();

        $section = $menu->Sections()->where('id', $sectionId)->firstOrFail();

        $variant = $section->Variants()->create([]);


        $items = $section->Items()->get();

        foreach ($items as $item) {
            //item variants
            $item->Variants()->createMany(
                [
                    [
                        'price' => 0.00,
                        'menu_id' => $menu->id,
                        'menu_section_id' => $section->id,
                        'menu_section_variant_id' => $variant->id,
                    ],

                ]
            );
        }

        return successResponse(MenuSectionVariantResource::make($variant), "Section variant created successfully", 201);
    }


    public function uodateSectionVariant(Request $request, $slug, $sectionId, $variantId)
    {
        $request->validate([
            'name' => 'nullable|string|max:255',
        ]);

        $menu = Menu::where('slug', $slug)->firstOrFail();

        $section = $menu->Sections()->where('id', $sectionId)->firstOrFail();

        $variant = $section->Variants()->where('id', $variantId)->firstOrFail();
        $variant->update([
            'name' => $request->input('name'),
        ]);

        return successResponse(MenuSectionVariantResource::make($variant), "Section variant updated successfully", 200);
    }


    public function deleteSectionVariant(Request $request, $slug, $sectionId, $variantId)
    {

        $menu = Menu::where('slug', $slug)->firstOrFail();

        $section = $menu->Sections()->where('id', $sectionId)->firstOrFail();

        $variant = $section->Variants()->where('id', $variantId)->firstOrFail();
        $variant->Items()->delete();
        $variant->delete();

        return successResponse(null, "Section variant deleted successfully", 200);
    }
    public function createItem(Request $request, $slug, $sectionId, $menuVariantId)
    {
        $menu = Menu::where('slug', $slug)->firstOrFail();

        $section = $menu->Sections()->where('id', $sectionId)->firstOrFail();
        $variant = $section->Variants()->where('id', $menuVariantId)->firstOrFail();
        $item = $variant->Items()->create([]);
    }


    public function createSectionItem(Request $request, $slug, $sectionId)
    {

        $menu = Menu::where('slug', $slug)->firstOrFail();
        $section = $menu->Sections()->where('id', $sectionId)
            ->with('Variants')
            ->firstOrFail();
        $item = $section->Items()->create([
            'menu_id' => $menu->id,
        ]);



        foreach ($section->Variants as $variant) {
            //item variants
            $item->Variants()->create([
                'menu_section_variant_id' => $variant->id,
            ]);
        }



        return successResponse(MenuSectionItemResource::make($item), "Section item created successfully", 201);
    }

    public function updateSectionItem(Request $request, $slug, $sectionId, $itemId)
    {


        $request->validate([
            'name' => 'nullable|string|max:255',
        ]);

        $item = MenuSectionItem::where('id', $itemId)->where('menu_section_id', $sectionId)->firstOrFail();

        $item->update([
            'name' => $request->input('name'),
        ]);


        return successResponse(MenuSectionItemResource::make($item), "Section item updated successfully", 200);
    }


    public function deleteSectionItem(Request $request, $slug, $sectionId, $itemId)
    {

        $item = MenuSectionItem::where('id', $itemId)->where('menu_section_id', $sectionId)->firstOrFail();

        $item->delete();

        return successResponse(null, "Section item deleted successfully", 200);
    }
}
