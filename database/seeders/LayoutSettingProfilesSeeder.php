<?php

namespace Database\Seeders;

use App\Models\LayoutSettingProfile;
use Illuminate\Database\Seeder;

class LayoutSettingProfilesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        LayoutSettingProfile::create([
            'name' => 'default layout',
            'is_default' => true,
            'show_document_template' => true,
        ]);
    }
}
