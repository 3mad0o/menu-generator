<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class MenuContactController extends Controller
{
    public function store(Request $request, $slug)
    {

        try {

            // Validate the incoming request data
            $validatedData = $request->validate([
                'type' => 'required|string|max:255',
                'value' => 'required|string|max:255',
                'old_menu_contact_id' => 'sometimes|exists:menu_contacts,id',
            ]);
        } catch (ValidationException $e) {
            return validationErrorResponse($e);
        }


        if ($request->has('old_menu_contact_id')) {
            $menuContact = \App\Models\MenuContact::find($request->old_menu_contact_id);
            $menuContact->update($validatedData);
        } else {
            // Create a new MenuContact record
            $menuContact = \App\Models\MenuContact::create($validatedData);
        }


        return successResponse($menuContact, "Menu contact saved successfully", 201);
    }
}
