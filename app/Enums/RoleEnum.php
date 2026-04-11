<?php

namespace App\Enums;

enum RoleEnum: string
{
    case ADMIN = 'admin';
    case INVENTORY_MANAGER = 'inventory_manager';
    case Manager = 'manager';
}
