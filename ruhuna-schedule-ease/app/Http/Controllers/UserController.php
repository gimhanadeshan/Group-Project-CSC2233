<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Role;
use Inertia\Inertia;
use App\Exports\UsersExport;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\UsersImport;
use Illuminate\Support\Facades\DB;
use App\Models\DegreeProgram;



class UserController extends Controller
{



    
    public function index()
    {
        $roles = Role::all();
        $degreePrograms = DegreeProgram::all();
        $users = User::with('role')->get(); // Load users with their roles

        return Inertia::render('Users/Index', ['users' => $users, 'roles' => $roles,'degreePrograms' => $degreePrograms]);
    }

    public function create()
    {
        $roles = Role::all();
        $degreePrograms = DegreeProgram::all();

        return Inertia::render('Users/Create', [
            'roles' => $roles,
            'degreePrograms' => $degreePrograms,
        ]);
    }

    public function createFromImport()
    {
        $roles = Role::all();
        $degreePrograms = DegreeProgram::all();

        return Inertia::render('Users/CreateFromImport', [
            'roles' => $roles,
            'degreePrograms' => $degreePrograms,
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'registration_no' => 'required|string|max:50|unique:users',
            'role_id' => 'required|exists:roles,id',
            'academic_year' => 'nullable|string|max:50',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        // Hash the password before storing
        $data = $request->all();
        $data['password'] = bcrypt($request->password);

        User::create($data);

        return redirect()->route('users.index')->with('success', 'User created successfully.');
    }

    public function edit(User $user)
    {
        $roles = Role::all();
        $degreePrograms = DegreeProgram::all();
        return Inertia::render('Users/Edit', ['user' => $user , 'roles' => $roles,'degreePrograms' => $degreePrograms]);
    }

    public function update(Request $request, User $user)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'registration_no' => 'required|string|max:50|unique:users,registration_no,' . $user->id,
            'role_id' => 'required|exists:roles,id',
            'academic_year' => 'nullable|string|max:50',
            'degree_program_id' => 'nullable|exists:degree_programs,id',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        // Update user data
        $user->update($request->all());

        return redirect()->route('users.index')->with('success', 'User updated successfully.');
    }

    public function destroy(User $user)
    {
        $user->delete();
        return redirect()->route('users.index')->with('success', 'User deleted successfully.');
    }

    public function export(Request $request)
{
    $query = User::query();

    if ($request->has('searchQuery')) {
        $searchQuery = $request->get('searchQuery');
        $query->where(function($q) use ($searchQuery) {
            $q->where('name', 'LIKE', "%$searchQuery%")
              ->orWhere('registration_no', 'LIKE', "%$searchQuery%");
        });
    }

    if ($request->has('selectedRole') && $request->get('selectedRole') !== '') {
        $selectedRole = $request->get('selectedRole');
        $query->whereHas('role', function($q) use ($selectedRole) {
            $q->where('name', $selectedRole);
        });
    }

    if ($request->has('selectedAcademicYear') && $request->get('selectedAcademicYear') !== '') {
        $selectedAcademicYear = $request->get('selectedAcademicYear');
        $query->where('academic_year', $selectedAcademicYear);
    }

    if ($request->has('selectedDegreeProgram') && $request->get('selectedDegreeProgram') !== '') {
        $selectedDegreeProgram = $request->get('selectedDegreeProgram');
        $query->where('degree_program_id', $selectedDegreeProgram);
    }

    $users = $query->get();

    if ($users->isEmpty()) {
        return redirect()->back()->with('error', 'No users found to export.');
    }

    return Excel::download(new UsersExport($users), 'users.xlsx');
}


public function storeMany(Request $request)
{
    // Validate the incoming request data
    $validator = Validator::make($request->all(), [
        'commonData.role_id' => 'required|exists:roles,id',
        'commonData.academic_year' => 'nullable|string',
        'commonData.password' => 'required|string|min:6',
        'commonData.degree_program_id' => 'nullable|exists:degree_programs,id', // New validation rule
        'users.*.name' => 'required|string',
        'users.*.email' => 'required|email|unique:users,email',
        'users.*.registration_no' => 'required|string|unique:users,registration_no',
    ]);

    // If validation fails, return JSON response with errors
    if ($validator->fails()) {
        return response()->json(['errors' => $validator->errors()], 422);
    }

    try {
        DB::beginTransaction();

        // Extract common data from request
        $role_id = $request->input('commonData.role_id');
        $academic_year = $request->input('commonData.academic_year');
        $password = $request->input('commonData.password');
        $degree_program_id = $request->input('commonData.degree_program_id'); // New degree_program_id

        // Array to hold created user instances
        $createdUsers = [];

        // Loop through each user data and create a new user
        foreach ($request->input('users') as $userData) {
            $user = new User();
            $user->name = $userData['name'];
            $user->email = $userData['email'];
            $user->registration_no = $userData['registration_no'];
            $user->role_id = $role_id;
            $user->academic_year = $academic_year;
            $user->password = bcrypt($password); // Hash the password
            $user->degree_program_id = $degree_program_id; // Assign degree program id
            $user->save();

            $createdUsers[] = $user; // Store created user instance
        }

        DB::commit();

        // Return JSON response indicating success and created users
        return response()->json([
            'message' => 'Users created successfully',
            'users' => $createdUsers,
        ], 200);

    } catch (\Exception $e) {
        DB::rollBack();

        // Return JSON response on failure
        return response()->json([
            'message' => 'Failed to create users',
            'error' => $e->getMessage(),
        ], 500);
    }
}




public function import(Request $request)
{
    $request->validate([
        'file' => 'required|mimes:xlsx,xls|max:2048',
        'academic_year' => 'nullable|string',
        'temporary_password' => 'required|string',
        'role_id' => 'required|integer',
        'degree_program_id' => 'nullable|exists:degree_programs,id', // Validate degree_program_id
    ]);

    try {
        $file = $request->file('file');
        $academicYear = $request->input('academic_year');
        $temporaryPassword = $request->input('temporary_password');
        $roleId = $request->input('role_id');
        $degreeProgramId = $request->input('degree_program_id'); // Get degree_program_id

        Excel::import(new UsersImport($academicYear, $temporaryPassword, $roleId, $degreeProgramId), $file);

        $importedUsers = UsersImport::getImportedUsers(); // Get imported users from the import class

        return response()->json(['message' => 'Users imported successfully.', 'users' => $importedUsers]);
    } catch (\Exception $e) {
        return response()->json(['message' => 'Error importing users: ' . $e->getMessage()], 500);
    }
}

    
    
}
