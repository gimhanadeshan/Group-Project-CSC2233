<?php

namespace App\Http\Controllers;

use App\Models\Permission;
use Illuminate\Http\Request;

class PermissionController extends Controller
{
    public function index()
    {
        $permissions = Permission::all();
        return inertia('Permissions/Index', ['permissions' => $permissions]);
    }

    public function edit(Permission $permission)
    {
        return inertia('Permissions/Edit', ['permission' => $permission]);
    }

    public function update(Request $request, Permission $permission)
    {
        $request->validate([
            'module_name' => 'required',
        ]);

        $permission->update($request->only('module_name'));

        return redirect()->route('permissions.index')->with('success', 'Permission updated successfully.');
    }
}
