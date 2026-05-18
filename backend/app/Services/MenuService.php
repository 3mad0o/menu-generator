<?php

namespace App\Services;

use App\Models\Menu;
use Illuminate\Http\Request;

class MenuService
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }



    public function makeMenu(Request $request)
    {

        $deviceId = $request->header('device_id');

        return  $menu = Menu::create([
            'device_id' => $deviceId,
            'slug' => uniqid('menu-'),
        ]);
    }

    public function storeName($name, Menu $menu)
    {
        $menu->update(['name' => $name]);
        return $menu->name;
    }

    public function storeLogo($file, Menu $menu)
    {
        $logoPath = $file ?  uploadFile($file, 'logos') : null;
        $menu->update(['store_logo' => $logoPath]);

        if (!$file) {
            return null;
        }
        return asset('storage/' . $logoPath);
    }

    public function storeStoreName($storeName, Menu $menu)
    {
        $menu->update(['store_name' => $storeName]);
        return $menu->store_name;
    }

    public function storeSubTitle($subtitle, Menu $menu)
    {
        $menu->update(['store_subtitle' => $subtitle]);
        return $menu->store_subtitle;
    }
}
