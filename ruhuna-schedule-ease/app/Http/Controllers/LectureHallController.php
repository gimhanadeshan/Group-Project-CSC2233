<?php

namespace App\Http\Controllers;

use App\Models\LectureHall;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LectureHallController extends Controller
{
    public function index(Request $request)
    {
        $lectureHalls = LectureHall::all();
        $permissions = $request->user()->permissions()->pluck('name');
        if (!($request->user())->hasPermissionTo('read_lecture_hall')) {
            abort(403, 'Unauthorized action.');
        }
        return Inertia::render('LectureHalls/Index', ['lectureHalls' => $lectureHalls ,'permissions' => $permissions,]);
    }

    public function create(Request $request)
    {   
        if (!($request->user())->hasPermissionTo('create_lecture_hall')) {
            abort(403, 'Unauthorized action.');
        }
        return Inertia::render('LectureHalls/Create');
    }

    public function store(Request $request)
    {
        if (!($request->user())->hasPermissionTo('create_lecture_hall')) {
            abort(403, 'Unauthorized action.');
        }

        $request->validate([
            'name' => 'required',
            'capacity' => 'required|integer',
        ]);

        LectureHall::create($request->all());
        return redirect()->route('lecture-halls.index');
    }

    public function edit(Request $request, LectureHall $lectureHall)
    {
        if (!($request->user())->hasPermissionTo('edit_lecture_hall')) {
            abort(403, 'Unauthorized action.');
        }

        return Inertia::render('LectureHalls/Edit', ['lectureHall' => $lectureHall]);
    }

    public function update(Request $request, LectureHall $lectureHall)
    {
        if (!($request->user())->hasPermissionTo('edit_lecture_hall')) {
            abort(403, 'Unauthorized action.');
        }

        $request->validate([
            'name' => 'required',
            'capacity' => 'required|integer',
        ]);

        $lectureHall->update($request->all());
        return redirect()->route('lecture-halls.index');
    }

    public function destroy(Request $request, LectureHall $lectureHall)
    {
        if (!($request->user())->hasPermissionTo('delete_lecture_hall')) {
            abort(403, 'Unauthorized action.');
        }

        $lectureHall->delete();
        return redirect()->route('lecture-halls.index');
    }
}
