<?php

namespace Database\Seeders;

use App\Constants\DocumentTypes;
use App\Models\LayoutSettingProfile;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DocumentParamsPositionSettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $layoutSettingProfileId = LayoutSettingProfile::query()->orderBy('id')->value('id');

        DB::table('document_params_position_settings')->insert(
            collect(DocumentTypes::Types)
                ->map(fn (string $documentType) => [
                    'document_type' => $documentType,
                    'layout_setting_profile_id' => $layoutSettingProfileId,
                    ...$this->autoGeneratePositions(),
                ])
                ->all()
        );
    }

    /**
     * Evenly distributes each param down an A4 portrait (210x297mm) canvas
     * (resources/js/utils/DocumentPositionCanvas.tsx) as a starting layout to be fine-tuned later.
     */
    private function autoGeneratePositions(): array
    {
        $fields = [
            'holders_name',
            'registration_number',
            'department_name',
            'discipline',
            'cgpa',
            'cgpa_class',
            'effective_date',
            'nin',
            'dob',
            'faculty',
            'passport_photo',
        ];

        $x = 63;
        $marginY = 22;
        $usableHeight = 297 - (2 * $marginY);
        $step = $usableHeight / (count($fields) - 1);

        $positions = [];

        foreach ($fields as $index => $field) {
            $positions["{$field}_x"] = $x;
            $positions["{$field}_y"] = (int) round($marginY + ($index * $step));
        }

        return $positions;
    }
}
