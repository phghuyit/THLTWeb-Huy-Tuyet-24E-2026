<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        if (!$user || $user->role !== 'admin' || $user->status !== 'active') {
            return response()->json(['message' => 'Bạn không có quyền truy cập khu vực quản trị.'], 403);
        }

        return $next($request);
    }
}
