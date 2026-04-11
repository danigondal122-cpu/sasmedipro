<?php

namespace App\Enums;

enum DeliveryStatusEnum: string
{
    case PENDING = 'pending';
    case SHIPPED = 'shipped';
    case DELIVERED = 'delivered';
    case FAILED = 'failed';
}