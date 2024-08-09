<?php

namespace App\Http\Controllers;

use App\Models\DegreeProgram;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DegreeProgramController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('read_degree_program', $request->user());

        $degreePrograms = DegreeProgram::all();
        return Inertia::render('DegreePrograms/Index', ['degreePrograms' => $degreePrograms]);
    }

    public function create(Request $request)
    {
        $this->authorize('create_degree_program', $request->user());

        return Inertia::render('DegreePrograms/Create');
    }

    public function store(Request $request)
    {
        $this->authorize('create_degree_program', $request->user());

        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        DegreeProgram::create($request->all());

        return redirect()->route('degree-programs.index')->with('success', 'Degree Program created successfully.');
    }

    public function edit(Request $request, DegreeProgram $degreeProgram)
    {
        $this->authorize('update_degree_program', $request->user());

        return Inertia::render('DegreePrograms/Edit', ['degreeProgram' => $degreeProgram]);
    }

    public function update(Request $request, DegreeProgram $degreeProgram)
    {
        $this->authorize('update_degree_program', $request->user());

        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $degreeProgram->update($request->all());

        return redirect()->route('degree-programs.index')->with('success', 'Degree Program updated successfully.');
    }

    public function destroy(Request $request, DegreeProgram $degreeProgram)
    {
        $this->authorize('delete_degree_program', $request->user());

        $degreeProgram->delete();

        return redirect()->route('degree-programs.index')->with('success', 'Degree Program deleted successfully.');
    }

    
}
