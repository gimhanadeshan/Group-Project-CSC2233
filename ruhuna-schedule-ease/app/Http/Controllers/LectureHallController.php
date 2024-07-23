<?php

namespace App\Http\Controllers;

use App\Models\LectureHall;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LectureHallController extends Controller
{
    public function index()
    {
        $lectureHalls = LectureHall::all();
        return Inertia::render('LectureHalls/Index', ['lectureHalls' => $lectureHalls]);
    }

    public function create()
    {
        return Inertia::render('LectureHalls/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'capacity' => 'required|integer',
        ]);

        LectureHall::create($request->all());
        return redirect()->route('lecture-halls.index');
    }

    public function edit(LectureHall $lectureHall)
    {
        return Inertia::render('LectureHalls/Edit', ['lectureHall' => $lectureHall]);
    }

    public function update(Request $request, LectureHall $lectureHall)
    {
        $request->validate([
            'name' => 'required',
            'capacity' => 'required|integer',
        ]);

        $lectureHall->update($request->all());
        return redirect()->route('lecture-halls.index');
    }

    public function destroy(LectureHall $lectureHall)
    {
        $lectureHall->delete();
        return redirect()->route('lecture-halls.index');
    }
}

