<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Item;
use App\Models\User;

class ItemSeeder extends Seeder
{
    public function run(): void
    {
        // Optionally get an admin user for created_by_id
        $admin = User::role('ADMIN')->first();

        // Create 20 items
        for ($i = 1; $i <= 20; $i++) {
            Item::create([
                'item_name' => 'Item ' . $i,
                'price' => mt_rand(1000, 10000) / 100, // Random price between 10.00 - 100.00
                'tax' => mt_rand(0, 20), // Random tax 0% - 20%
                'status' => (bool)random_int(0, 1),
                'created_by_id' => $admin?->id ?? 1, // optional, model will auto-set if null
            ]);
        }
    }
}
