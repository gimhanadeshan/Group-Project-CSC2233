<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class NotificationController extends Controller
{
    public function index(){
        return Inertia::render('Notification/Index', [
            'unreadNotifications'=> auth()->user()->unreadNotifications,
            'readNotifications'=> auth()->user()->readNotifications,
        ]);
    }
}
