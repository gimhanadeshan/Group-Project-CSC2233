<?php

namespace App\Http\Controllers;

use App\Models\LectureHall;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LectureHallController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('read_lecture_hall', $request->user());

        $lectureHalls = LectureHall::all();
        $permissions = $request->user()->permissions()->pluck('name');

        return Inertia::render('LectureHalls/Index', [
            'lectureHalls' => $lectureHalls,   
        ]);
    }

    public function create(Request $request)
    {
        $this->authorize('create_lecture_hall', $request->user());

        return Inertia::render('LectureHalls/Create');
    }

    public function store(Request $request)
    {
        $this->authorize('create_lecture_hall', $request->user());

        $request->validate([
            'name' => 'required',
            'capacity' => 'required|integer',
        ]);

        LectureHall::create($request->all());
        return redirect()->route('lecture-halls.index');
    }

    public function edit(Request $request, LectureHall $lectureHall)
    {
        $this->authorize('update_lecture_hall', $request->user());

        return Inertia::render('LectureHalls/Edit', ['lectureHall' => $lectureHall]);
    }

    public function update(Request $request, LectureHall $lectureHall)
    {
        $this->authorize('update_lecture_hall', $request->user());

        $request->validate([
            'name' => 'required',
            'capacity' => 'required|integer',
        ]);

        $lectureHall->update($request->all());
        return redirect()->route('lecture-halls.index');
    }

    public function destroy(Request $request, LectureHall $lectureHall)
    {
        $this->authorize('delete_lecture_hall', $request->user());

        $lectureHall->delete();
        return redirect()->route('lecture-halls.index');
    }

    
}
