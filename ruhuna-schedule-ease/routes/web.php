<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\DegreeProgramController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\EventController;




Route::middleware(['auth'])->group(function () {
    Route::get('/users', [UserController::class, 'index'])->name('users.index');
    Route::get('/users/create', [UserController::class, 'create'])->name('users.create');
    Route::get('/users/createFromImport', [UserController::class, 'createFromImport'])->name('users.createFromImport');
    Route::post('/users/store', [UserController::class, 'store'])->name('users.store');
    Route::get('/users/{user}/edit', [UserController::class, 'edit'])->name('users.edit');
    Route::put('/users/{user}', [UserController::class, 'update'])->name('users.update');
    Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');
    //Route::get('users/export', [UserController::class, 'export'])->name('users.export');
    Route::post('/import-users', [UserController::class, 'import'])->name('users.import');
    Route::post('/users/storeMany', [UserController::class, 'storeMany'])->name('users.storeMany');
    Route::resource('degree-programs', DegreeProgramController::class);


    // Route::get('dashboard', [EventController::class,'timetable'])->name('events.timetable');
    // Route::get('/stdashboard', [EventController::class,'stu'])->name('events.stu');
    // Route::get('/lecdashboard', [EventController::class,'lec'])->name('events.lec');

    Route::get('/dashboard', [EventController::class, 'dashboard'])->middleware(['auth', 'verified'])->name('dashboard');




    Route::post('/events', [EventController::class, 'store'])->name('events.store');
    Route::put('/events/{id}', [EventController::class, 'update'])->name('events.update');
    Route::delete('/events/{id}', [EventController::class, 'destroy'])->name('events.destroy');

    //Route::resource('stdashboard', EventController::class);

    Route::get('/users/export', [UserController::class, 'export'])->name('users.export');




    
   

});




Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

   
// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');


// Route::get('/dashboard', function () {
//     $user = Auth::user();

//     switch ($user->role_id) {
//         case 1:
//             return Inertia::render('Dashboards/AdminDashboard');
//         case 2:
//             return Inertia::render('Dashboards/StudentDashboard');
//         case 3:
//             return Inertia::render('Dashboards/LectureDashboard');
//         default:
//             return Inertia::render('Dashboard');
//     }
// })->middleware(['auth', 'verified'])->name('dashboard');


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::resource('roles', RoleController::class);
    Route::resource('permissions', PermissionController::class);
    //Route::resource('stdashboard', EventController::class);
   
});




require __DIR__.'/auth.php';
