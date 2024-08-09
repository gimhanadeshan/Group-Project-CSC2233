<?php

namespace App\Http\Controllers;

abstract class Controller
{
    public function authorize($permission, $user)
    {
        if (!$user->hasPermissionTo($permission)) {
            abort(403, 'Unauthorized action.');
        }
    }
}
