<?php

namespace App\Enums;

enum SaleStatusEnum: string
{
        // Sale created but not confirmed
   // case DRAFT = 'draft';
    case CONFIRMED = 'confirmed';   // Sale confirmed by salesman
    case DELIVERED = 'delivered';   // Sale delivered, inventory decreased
    case CANCELLED = 'cancelled';   // Sale cancelled
   
  
}
