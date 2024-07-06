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



class UserController extends Controller
{
    public function index()
    {
        $roles = Role::all();
        $users = User::with('role')->get(); // Load users with their roles
        return Inertia::render('Users/Index', ['users' => $users, 'roles' => $roles]);
    }

    public function create()
    {
        $roles = Role::all();

        return Inertia::render('Users/Create', [
            'roles' => $roles,
        ]);
    }

    public function createFromImport()
    {
        $roles = Role::all();

        return Inertia::render('Users/CreateFromImport', [
            'roles' => $roles,
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
            'academic_year' => 'required|string|max:50',
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
        return Inertia::render('Users/Edit', ['user' => $user , 'roles' => $roles]);
    }

    public function update(Request $request, User $user)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'registration_no' => 'required|string|max:50|unique:users,registration_no,' . $user->id,
            'role_id' => 'required|exists:roles,id',
            'academic_year' => 'required|string|max:50',
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

    public function export()
    {
        return Excel::download(new UsersExport, 'users.xlsx');
    }

    public function storeMany(Request $request)
{
    $validator = Validator::make($request->all(), [
        'commonData.role_id' => 'required|exists:roles,id',
        'commonData.academic_year' => 'required|string',
        'commonData.password' => 'required|string|min:6',
        'users.*.name' => 'required|string',
        'users.*.email' => 'required|email|unique:users,email',
        'users.*.registration_no' => 'required|string|unique:users,registration_no',
    ]);

    if ($validator->fails()) {
        return response()->json(['errors' => $validator->errors()], 422);
    }

    try {
        DB::beginTransaction();

        // Create common data
        $role_id = $request->input('commonData.role_id');
        $academic_year = $request->input('commonData.academic_year');
        $password = $request->input('commonData.password');

        // Create users
        $usersData = $request->input('users');
        $createdUsers = [];

        foreach ($usersData as $userData) {
            $user = new User();
            $user->name = $userData['name'];
            $user->email = $userData['email'];
            $user->registration_no = $userData['registration_no'];
            $user->role_id = $role_id;
            $user->academic_year = $academic_year;
            $user->password = bcrypt($password); // Ensure to hash the password
            $user->save();

            $createdUsers[] = $user;
        }

        DB::commit();

        // Return JSON response for API requests
        if ($request->expectsJson()) {
            return response()->json([
                'message' => 'Users created successfully',
                'users' => $createdUsers,
            ], 200);
        }

        // Redirect for web requests
        //return redirect()->route('users.index');

    } catch (\Exception $e) {
        DB::rollBack();

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
            'academic_year' => 'required|string',
            'temporary_password' => 'required|string',
            'role_id' => 'required|integer',
        ]);

        try {
            $file = $request->file('file');
            $academicYear = $request->input('academic_year');
            $temporaryPassword = $request->input('temporary_password');
            $roleId = $request->input('role_id');

            Excel::import(new UsersImport($academicYear, $temporaryPassword, $roleId), $file);

            $importedUsers = UsersImport::getImportedUsers(); // Get imported users from the import class

            return response()->json(['message' => 'Users imported successfully.', 'users' => $importedUsers]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error importing users: ' . $e->getMessage()], 500);
        }
    }
    
    
}
