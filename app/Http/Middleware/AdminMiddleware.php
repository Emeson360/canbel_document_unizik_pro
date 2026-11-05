<?php

namespace App\Http\Middleware;

use App\Constants\UserRoles;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (Auth::user() && Auth::user()->role === UserRoles::Admin) {
            return $next($request); // Allow request to proceed
        }

        // If not an admin, redirect back
        return back()->with('error', 'Unathorized access.');
    }
}