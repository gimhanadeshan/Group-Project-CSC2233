<?php

namespace App\Http\Controllers;

use App\Models\DegreeProgram;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DegreeProgramController extends Controller
{
    public function index()
    {
        $degreePrograms = DegreeProgram::all();
        return Inertia::render('DegreePrograms/Index', ['degreePrograms' => $degreePrograms]);
    }

    public function create()
    {
        return Inertia::render('DegreePrograms/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        DegreeProgram::create($request->all());

        return redirect()->route('degree-programs.index')->with('success', 'Degree Program created successfully.');
    }

    public function edit(DegreeProgram $degreeProgram)
    {
        return Inertia::render('DegreePrograms/Edit', ['degreeProgram' => $degreeProgram]);
    }

    public function update(Request $request, DegreeProgram $degreeProgram)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $degreeProgram->update($request->all());

        return redirect()->route('degree-programs.index')->with('success', 'Degree Program updated successfully.');
    }

    public function destroy(DegreeProgram $degreeProgram)
    {
        $degreeProgram->delete();

        return redirect()->route('degree-programs.index')->with('success', 'Degree Program deleted successfully.');
    }
}
