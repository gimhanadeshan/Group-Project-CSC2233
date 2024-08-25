<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    use HasFactory;

    // Allow mass assignment of 'name' and 'role_type' fields
    protected $fillable = [
        'name',
        'role_type',
    ];

    // Define relationship with User model
    public function users()
    {
        return $this->hasMany(User::class, 'role_id', 'id');
    }

    // Define relationship with Permission model
    public function permissions()
    {
        return $this->belongsToMany(Permission::class);
    }
}
