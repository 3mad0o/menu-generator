<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class isAuthorisedMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {

        // $deviceId = $request->header('Device_id');
        // $user = Auth::guard('sanctum')->user();
        // if (!$user ||  $deviceId) {
        //     return unauthorizedResponse();
        // }
        return $next($request);
    }
}
