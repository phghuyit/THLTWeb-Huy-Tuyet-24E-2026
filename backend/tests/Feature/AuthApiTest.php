<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthApiTest extends TestCase
{
    use RefreshDatabase;

    private function registration(array $overrides = []): array
    {
        return array_merge([
            'fullname' => 'Sinh viên kiểm thử',
            'email' => 'student@example.test',
            'password' => 'Student12345',
            'password_confirmation' => 'Student12345',
            'phone' => '0901234567',
            'address' => 'Địa chỉ kiểm thử',
        ], $overrides);
    }

    public function test_registration_creates_a_member_with_hashed_password(): void
    {
        $this->postJson('/api/register', $this->registration(['role' => 'admin', 'status' => 'locked']))
            ->assertCreated()->assertJsonPath('data.role', 'member')
            ->assertJsonMissingPath('data.password');

        $user = User::where('email', 'student@example.test')->firstOrFail();
        $this->assertSame('member', $user->role);
        $this->assertSame('active', $user->status);
        $this->assertTrue(Hash::check('Student12345', $user->password));
        $this->assertDatabaseHas('users', ['email' => 'student@example.test', 'phone' => '0901234567']);
    }

    public function test_registration_rejects_duplicate_email_mismatched_password_and_bad_phone(): void
    {
        $this->postJson('/api/register', $this->registration())->assertCreated();
        $this->postJson('/api/register', $this->registration())->assertUnprocessable()->assertJsonValidationErrors('email');
        $this->postJson('/api/register', $this->registration([
            'email' => 'another@example.test', 'password_confirmation' => 'Different123', 'phone' => 'abc',
        ]))->assertUnprocessable()->assertJsonValidationErrors(['password', 'phone']);
        $this->assertDatabaseCount('users', 1);
    }

    public function test_registration_accepts_missing_optional_phone_and_address(): void
    {
        $payload = $this->registration();
        unset($payload['phone'], $payload['address']);
        $this->postJson('/api/register', $payload)->assertCreated();
    }

    public function test_registered_user_can_login_read_profile_and_logout(): void
    {
        $this->postJson('/api/register', $this->registration())->assertCreated();
        $login = $this->postJson('/api/login', [
            'email' => 'student@example.test', 'password' => 'Student12345',
        ])->assertOk()->assertJsonStructure(['token', 'data' => ['id', 'name', 'email', 'role']]);

        $token = $login->json('token');
        $this->assertNotEmpty($token);
        Auth::forgetGuards();
        $this->withToken($token)->getJson('/api/user')->assertOk()
            ->assertJsonPath('email', 'student@example.test')->assertJsonMissingPath('password');
        Auth::forgetGuards();
        $this->withToken($token)->postJson('/api/logout')->assertOk();
        $this->assertDatabaseCount('personal_access_tokens', 0);
        Auth::forgetGuards();
        $this->withToken($token)->getJson('/api/user')->assertUnauthorized();
    }

    public function test_wrong_password_locked_and_deleted_users_cannot_login(): void
    {
        $this->postJson('/api/register', $this->registration())->assertCreated();
        $credentials = ['email' => 'student@example.test', 'password' => 'Student12345'];
        $this->postJson('/api/login', [...$credentials, 'password' => 'Incorrect123'])->assertUnauthorized();
        $user = User::firstOrFail();
        $user->update(['status' => 'locked']);
        $this->postJson('/api/login', $credentials)->assertUnauthorized();
        $user->update(['status' => 'active']);
        $user->delete();
        $this->postJson('/api/login', $credentials)->assertUnauthorized();
        $this->assertDatabaseCount('personal_access_tokens', 0);
    }

    public function test_admin_login_rejects_members_and_accepts_admins(): void
    {
        $this->postJson('/api/register', $this->registration())->assertCreated();
        $credentials = ['email' => 'student@example.test', 'password' => 'Student12345'];
        $this->postJson('/api/admin/login', $credentials)->assertUnauthorized();
        User::firstOrFail()->update(['role' => 'admin']);
        $this->postJson('/api/admin/login', $credentials)->assertOk()
            ->assertJsonPath('data.role', 'admin')->assertJsonStructure(['token']);
    }
    public function test_login_validation_and_missing_token_are_rejected(): void
    {
        $this->postJson('/api/login', [])->assertUnprocessable()->assertJsonValidationErrors(['email', 'password']);
        $this->getJson('/api/user')->assertUnauthorized();
        $this->postJson('/api/logout')->assertUnauthorized();
    }
}
