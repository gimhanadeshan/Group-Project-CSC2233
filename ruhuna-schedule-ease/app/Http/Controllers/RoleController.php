<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\Permission;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('read_role', $request->user());

        $roles = Role::with('permissions')->get();
        return inertia('Roles/Index', ['roles' => $roles]);
    }

    public function create(Request $request)
    {
        $this->authorize('create_role', $request->user());
        $permissions = Permission::all();
        return inertia('Roles/Create', ['permissions' => $permissions]);
    }

    public function store(Request $request)
    {
        $this->authorize('create_role', $request->user());
        $request->validate(['name' => 'required|unique:roles,name']);
        $role = Role::create($request->only('name'));
        $role->permissions()->sync($request->permissions);
        return redirect()->route('roles.index')->with('success', 'Role created successfully.');
    }

    public function edit(Role $role,Request $request)
    {
        $this->authorize('update_role', $request->user());
        $permissions = Permission::all();
        $rolePermissions = $role->permissions()->pluck('id')->toArray();
        return inertia('Roles/Edit', ['role' => $role, 'permissions' => $permissions, 'rolePermissions' => $rolePermissions]);
    }

    public function update(Request $request, Role $role)
    {
        $this->authorize('update_role', $request->user());
        $request->validate(['name' => 'required|unique:roles,name,' . $role->id]);
        $role->update($request->only('name'));
        $role->permissions()->sync($request->permissions);
        return redirect()->route('roles.index')->with('success', 'Role updated successfully.');
    }

    public function destroy(Role $role,Request $request)
    {
        $this->authorize('delete_role', $request->user());
        $role->delete();
        return redirect()->route('roles.index')->with('success', 'Role deleted successfully.');
    }
}
