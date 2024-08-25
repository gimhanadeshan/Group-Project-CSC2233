<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\Permission;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    public function index()
    {
        $roles = Role::with('permissions')->get();
        return inertia('Roles/Index', ['roles' => $roles]);
    }

    public function create()
    {
        $permissions = Permission::all();
        return inertia('Roles/Create', ['permissions' => $permissions]);
    }

    public function store(Request $request)
    {
        $this->authorize('create_role', $request->user());

        // Validate the incoming request data, including the role_type field
        $request->validate([
            'name' => 'required|unique:roles,name',
            'role_type' => 'required|string',
        ]);

        // Create the role with the name and role_type
        $role = Role::create($request->only('name', 'role_type'));

        // Sync the permissions with the role
        $role->permissions()->sync($request->permissions);

        return redirect()->route('roles.index')->with('success', 'Role created successfully.');
    }

    public function edit(Role $role, Request $request)
    {
        $permissions = Permission::all();
        $rolePermissions = $role->permissions()->pluck('id')->toArray();
        return inertia('Roles/Edit', [
            'role' => $role,
            'permissions' => $permissions,
            'rolePermissions' => $rolePermissions,
        ]);
    }

    public function update(Request $request, Role $role)
    {
        $this->authorize('update_role', $request->user());

        // Validate the incoming request data, including the role_type field
        $request->validate([
            'name' => 'required|unique:roles,name,' . $role->id,
            'role_type' => 'required|string',
        ]);

        // Update the role with the name and role_type
        $role->update($request->only('name', 'role_type'));

        // Sync the permissions with the role
        $role->permissions()->sync($request->permissions);

        return redirect()->route('roles.index')->with('success', 'Role updated successfully.');
    }

    public function destroy(Role $role, Request $request)
    {
        $role->delete();
        return redirect()->route('roles.index')->with('success', 'Role deleted successfully.');
    }
}
