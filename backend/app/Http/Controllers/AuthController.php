<?php

namespace App\Http\Controllers;

use App\Http\Requests\User\LoginInputRequest;
use App\Http\Requests\User\RegisterRequest;
use App\Http\Resources\User\LoginUserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function register(RegisterRequest $request)
    {


        $user = User::create([
            ...$request->validated(),
            'role' => 'member',
            'status' => 'active',
        ]);

        return response()->json([
            'message' => 'Đăng ký thành công. Bạn có thể đăng nhập ngay.',
            'data' => new LoginUserResource($user),
        ], 201);
    }

    public function login(LoginInputRequest $request)
    {

        $credentials = $request->validated();
        if (!Auth::once([...$credentials, 'status' => 'active'])) {
            return response()->json([
                'message' => 'Email hoặc mật khẩu không đúng, hoặc tài khoản đã bị khóa.',
            ], 401);
        }

        $user = Auth::user();
        $user->tokens()->where('name', 'auth_member_token')->delete();
        $token = $user->createToken('auth_member_token')->plainTextToken;

        return response()->json([
            'message' => "Đăng nhập thành công.",
            'token' => $token,
            'data' => new LoginUserResource($user),
        ], 200);
    }

    public function adminLogin(LoginInputRequest $request)
    {

        $credentials = $request->validated();
        if (!Auth::once([...$credentials, 'status' => 'active', 'role' => 'admin'])) {
            return response()->json([
                'message' => 'Email hoặc mật khẩu không đúng, hoặc tài khoản không có quyền quản trị.'
            ], 401);
        }

        $admin = Auth::user();
        $admin->tokens()->where('name', 'auth_admin_token')->delete();
        $adminToken = $admin->createToken('auth_admin_token')->plainTextToken;

        return response()->json([
            'message' => 'Đăng nhập quản trị thành công.',
            'token' => $adminToken,
            'data' => new LoginUserResource($admin)
        ], 200);
    }

    public function logout(Request $request)
    {
        $request->user()?->currentAccessToken()?->delete();
        return response()->json(['message' => 'Đăng xuất thành công.'], 200);
    }
}
