<?php

namespace App\Constants;

class UserRoles
{
    const Registrar = 0;
    const Supervisor = 1;
    const Admin = 2;
    const AssistantSupervisor = 3;

    const ROLES = [
        self::Registrar,
        self::Supervisor,
        self::Admin,
        self::AssistantSupervisor,
    ];

    const ROLES_ALPHA = [
        'registrar',
        'supervisor',
        'admin',
        'assistant-supervisor'
    ];
}