<?php

namespace App\Traits;

trait FormatsLabels
{
    /**
     * Format permission label
     * Example: backend.user.edit → User - Edit
     */
    protected function formatPermissionLabel(string $permission): string
    {
        $parts = explode('.', $permission);

        if (count($parts) !== 3) {
            return ucfirst(str_replace('.', ' ', $permission));
        }

        [$area, $module, $action] = $parts;

        $module = str_replace('_', ' ', $module);

        $actionMap = [
            'index' => 'View',
            'create' => 'Create',
            'edit' => 'Edit',
            'destroy' => 'Delete',
        ];

        $actionLabel = $actionMap[$action] ?? ucfirst($action);

        return ucfirst($module) . ' - ' . $actionLabel;
    }

    /**
     * Format role label
     * Example: inventory_manager → Inventory Manager
     */
    protected function formatRoleLabel(string $roleName): string
    {
        return ucwords(str_replace('_', ' ', $roleName));
    }
}
