<?php

namespace Database\Seeders;

use App\Constants\UserRoles;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            [
                'name' => 'Admin',
                'email' => 'admin@slint.com',
                'role' => UserRoles::Admin,
            ],
            [
                'name' => 'Admin',
                'email' => 'admin@canbeltech.com',
                'role' => UserRoles::Admin,
            ],
            [
                'name' => 'Registrar',
                'email' => 'registrar@example.com',
                'role' => UserRoles::Registrar,
            ],
            [
                'name' => 'Supervisor',
                'email' => 'supervisor@example.com',
                'role' => UserRoles::Supervisor,
            ],
            [
                'name' => 'Assistant Supervisor',
                'email' => 'assistant-supervisor@example.com',
                'role' => UserRoles::AssistantSupervisor,
            ],
        ];

        foreach ($users as $user) {
            User::updateOrCreate(
                ['email' => $user['email']],
                [
                    'name' => $user['name'],
                    'role' => $user['role'],
                    'password' => Hash::make('password'),
                ]
            );
        }
    }
}
