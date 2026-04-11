<?php

namespace App\Enums;

enum PaymentStatusEnum: string
{
    case UNPAID = 'unpaid';
    case PARTIALLY_PAID = 'partially_paid';
    case PAID = 'paid';
}