<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function createGetUser(Request $request)
    {
        $user = Auth::guard('sanctum')->user();
        if ($user) {
            $token = $request->user()->currentAccessToken()->plainTextToken;
            return successResponse([
                'user' => $user,
                'token' => $token
            ], "User retrieved successfully", 200);
        } else {
            // create user logic here
            $user = \App\Models\User::create([]);

            $token = $user->createToken('auth_token')->plainTextToken;
            return successResponse([
                'user' => $user,
                'token' => $token
            ], "User created successfully", 201);
        }
    }
}
