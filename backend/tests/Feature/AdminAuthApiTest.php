<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Tests\TestCase;

class AdminAuthApiTest extends TestCase
{
    use RefreshDatabase;

    private function user(string $role = 'admin', string $status = 'active'): User
    {
        return User::create([
            'fullname' => 'Tài khoản kiểm thử',
            'email' => uniqid().'@example.test',
            'password' => 'AdminTest12345',
            'role' => $role,
            'status' => $status,
        ]);
    }

    public function test_admin_can_login_read_profile_and_logout(): void
    {
        $admin = $this->user();
        $login = $this->postJson('/api/admin/login', [
            'email' => $admin->email, 'password' => 'AdminTest12345',
        ])->assertOk()->assertJsonPath('data.role', 'admin')->assertJsonStructure(['token']);
        $token = $login->json('token');
        Auth::forgetGuards();
        $this->withToken($token)->getJson('/api/admin/me')->assertOk()
            ->assertJsonPath('data.id', $admin->id)->assertJsonMissingPath('data.password');
        Auth::forgetGuards();
        $this->withToken($token)->postJson('/api/admin/logout')->assertOk();
        $this->assertDatabaseCount('personal_access_tokens', 0);
        Auth::forgetGuards();
        $this->withToken($token)->getJson('/api/admin/me')->assertUnauthorized();
    }

    public function test_member_locked_admin_deleted_admin_and_wrong_password_cannot_login(): void
    {
        $member = $this->user('member');
        $locked = $this->user('admin', 'locked');
        $deleted = $this->user();
        $deleted->delete();
        foreach ([$member, $locked, $deleted] as $user) {
            Auth::forgetGuards();
            $this->postJson('/api/admin/login', ['email' => $user->email, 'password' => 'AdminTest12345'])
                ->assertUnauthorized();
        }
        $admin = $this->user();
        $this->postJson('/api/admin/login', ['email' => $admin->email, 'password' => 'WrongPassword123'])
            ->assertUnauthorized();
        $this->assertDatabaseCount('personal_access_tokens', 0);
    }

    public function test_all_admin_resource_groups_require_authentication(): void
    {
        foreach (['me', 'orders', 'categories/trash', 'brands/trash', 'products/trash', 'users'] as $path) {
            Auth::forgetGuards();
            $this->getJson('/api/admin/'.$path)->assertUnauthorized();
        }
        foreach (['products', 'categories', 'brands', 'users'] as $path) {
            Auth::forgetGuards();
            $this->postJson('/api/admin/'.$path, [])->assertUnauthorized();
        }
    }

    public function test_member_token_cannot_access_admin_resources(): void
    {
        $token = $this->user('member')->createToken('member')->plainTextToken;
        foreach (['me', 'orders', 'categories/trash', 'brands/trash', 'products/trash', 'users'] as $path) {
            Auth::forgetGuards();
            $this->withToken($token)->getJson('/api/admin/'.$path)->assertForbidden();
        }
        foreach (['products', 'categories', 'brands'] as $path) {
            Auth::forgetGuards();
            $this->withToken($token)->postJson('/api/admin/'.$path, [])->assertForbidden();
        }
    }

    public function test_locked_admin_token_and_invalid_token_are_rejected(): void
    {
        $admin = $this->user();
        $token = $admin->createToken('admin')->plainTextToken;
        $admin->update(['status' => 'locked']);
        $this->withToken($token)->getJson('/api/admin/me')->assertForbidden();
        Auth::forgetGuards();
        $this->withToken('invalid-token')->getJson('/api/admin/me')->assertUnauthorized();
    }

    public function test_admin_login_validates_required_fields(): void
    {
        $this->postJson('/api/admin/login', [])->assertUnprocessable()
            ->assertJsonValidationErrors(['email', 'password']);
    }
}
