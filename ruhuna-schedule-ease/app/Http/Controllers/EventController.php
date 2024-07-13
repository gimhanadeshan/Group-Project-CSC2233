<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Inertia\Inertia; // Import Inertia


class EventController extends Controller
{
    public function index()
    {
        // $allevents = Event::all()->map(function ($event) {
        //     return [
        //         'id' => $event->id,
        //         'title' => $event->title,
        //         'subject_code' => $event->subject_code,
        //         'location' => $event->location,
        //         'start' => $event->start,
        //         'end' => $event->end,
        //     ];
        // });

        $allevents = Event::all();

        return Inertia::render('Dashboards/TimeTable', [
            'allevents' => $allevents,
            
        ]);
    }
}
