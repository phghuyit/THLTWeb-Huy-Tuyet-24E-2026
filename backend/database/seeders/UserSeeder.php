<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{


    public function run(): void
    {
        $users = [
            [
                'fullname' => 'Quản Trị Viên',
                'email' => 'admin@gmail.com',
                'password' => Hash::make('admin123456'),
                'phone' => '0901234567',
                'address' => 'TP. Hồ Chí Minh',
                'role' => 'admin',
                'status' => 'active',
                'avatar' => 'https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff',
            ],
            [
                'fullname' => 'Nguyễn Văn Member',
                'email' => 'member@gmail.com',
                'password' => Hash::make('member123456'),
                'phone' => '0987654321',
                'address' => 'Hà Nội',
                'role' => 'member',
                'status' => 'active',
                'avatar' => 'https://ui-avatars.com/api/?name=Member+User&background=28a745&color=fff',
            ],
            [
                'fullname' => 'Tài Khoản Bị Khóa',
                'email' => 'locked@gmail.com',
                'password' => Hash::make('password123'),
                'phone' => '0911223344',
                'address' => 'Đà Nẵng',
                'role' => 'member',
                'status' => 'locked',
                'avatar' => 'https://ui-avatars.com/api/?name=Locked+User&background=dc3545&color=fff',
            ],
        ];

        foreach ($users as $userData) {
            User::updateOrCreate(
                ['email' => $userData['email']],
                $userData
            );
        }
    }
}
