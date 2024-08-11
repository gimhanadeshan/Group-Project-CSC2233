<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;


class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }

    public function authorize($permission, $user)
    {
        if (!$user->hasPermissionTo($permission)) {
            abort(403, 'Unauthorized action.');
        }
    }
    
    
}
