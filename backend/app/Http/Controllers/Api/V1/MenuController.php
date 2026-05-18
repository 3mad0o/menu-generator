<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\MenuResource;
use App\Models\Menu;
use App\Services\MenuService;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Illuminate\Validation\ValidationRuleParser;

class MenuController extends Controller
{
    public function show($slug)
    {
        // Logic to retrieve and return the menu by slug

        $menu = Menu::where('slug', $slug)
            ->with(['Sections' => function ($s) {
                $s->orderBy('order')
                    ->with('Variants');
            }, 'Sections.Items.Variants', 'Contacts'])
            ->firstOrFail();

        return successResponse(MenuResource::make($menu), "Menu retrived successfully", 201);
    }


    public function myMenus()
    {
        $menus = Menu::when(request()->has('device_id'), function ($query) {
            $query->where('device_id', request()->header('device_id'));
        })
            ->when(request()->has('user_id'), function ($query) {
                $query->where('user_id', request()->header('user_id'));
            })
            ->orderByDesc('created_at')
            ->get();

        return successResponse(MenuResource::collection($menus), "Menu retrived successfully", 201);
    }

    public function makeMenu(Request $request, MenuService $menuService)
    {

        $menu = $menuService->makeMenu($request);
        return successResponse(MenuResource::make($menu), "Menu created successfully", 201);
    }
    public function storeMenuDetails(Request $request, MenuService $menuService, $slug)
    {

        $rules = [
            'key' => 'required|string',
        ];

        $messages = [
            'key.required' => 'The key field is required.',
            'key.string' => 'The key must be a string.',
        ];


        try {
            $request->validate($rules, $messages);
        } catch (ValidationException $e) {
            return validationErrorResponse($e);
        }


        $menu = Menu::where('slug', $slug)->firstOrFail();

        $key = $request->input('key');
        switch ($key) {
            case 'title':
                $res = $menuService->storeName($request->input('value'), $menu);
                break;
            case 'store_name':
                // Logic to store store name details
                $res = $menuService->storeStoreName($request->input('value'), $menu);

                break;
            case 'store_logo':
                // Logic to store store logo details
                $res = $menuService->storeLogo($request->file('value'), $menu);
                break;
            case 'store_subtitle':
                // Logic to store store subtitle details
                $res =  $menuService->storeSubTitle($request->input('value'), $menu);
                break;
            default:
                return errorResponse("Invalid key provided", 400);
        }


        return successResponse([
            $key => $res
        ], "Menu details updated successfully", 200);
    }
    public function destroy($slug)
    {
        $menu = Menu::where('slug', $slug)->firstOrFail();
        $menu->delete();

        return successResponse(null, "Menu deleted successfully", 200);
    }
}
