<?php

namespace App\Constants;

class DocumentStatuses
{
    const AWAITING_APPROVAL = 0;
    const APPROVED = 1;
    const REFUSED = 2;

    const STATUSES = [
        self::AWAITING_APPROVAL,
        self::APPROVED,
        self::REFUSED,
    ];

    const STATUSES_ALPHA = [
        'awaiting_approval',
        'approved',
        'refused',
    ];
}