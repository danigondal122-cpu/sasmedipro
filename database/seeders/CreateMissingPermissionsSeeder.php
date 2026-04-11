<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class CreateMissingPermissionsSeeder extends Seeder
{
    public function run()
    {
        $permissions = [
            // Customers
            'backend.customer.index',
            'backend.customer.create',
            'backend.customer.edit',
            'backend.customer.destroy',

            // Sales
            'backend.sale.index',
            'backend.sale.create',
            'backend.sale.edit',
            'backend.sale.destroy',

            // Purchase
            'backend.purchase.index',
            'backend.purchase.create',
            'backend.purchase.edit',
            'backend.purchase.destroy',
        ];

        foreach ($permissions as $perm) {
            Permission::firstOrCreate([
                'name' => $perm,
                'guard_name' => 'sanctum', // match your existing permissions
            ]);
        }

        $this->command->info('Missing permissions created successfully!');
    }
}
