<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Setting;

class SettingsSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            'name',
            'logo',
            'address',
            'phone',
            'brn',
            'vat',
            'fax',
            'email',
            'website',
        ];

        foreach ($settings as $key) {
            Setting::updateOrCreate(
                ['name' => $key],
                [
                    'group' => 'general',
                    'val' => '',
                    'created_by' => null,
                    'updated_by' => null,
                ]
            );
        }
    }
}
