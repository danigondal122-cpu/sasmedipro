<?php

namespace App\Enums;

enum RequestEnum: string
{
    const CONFIRMED = 'confirmed';

    const APPROVED = 'approved';

    const REJECTED = 'rejected';
}
