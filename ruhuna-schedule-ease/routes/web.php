<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\DegreeProgramController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\LectureHallController;
use App\Http\Controllers\ResourceAllocationController;
use App\Http\Controllers\TimeTableController;
use App\Http\Controllers\SemesterController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\CourseRegistrationController;
use App\Http\Controllers\EventRegistrationController;




Route::middleware(['auth'])->group(function () {
    Route::get('/users', [UserController::class, 'index'])->name('users.index');
    Route::get('/users/create', [UserController::class, 'create'])->name('users.create');
    Route::get('/users/createFromImport', [UserController::class, 'createFromImport'])->name('users.createFromImport');
    Route::post('/users/store', [UserController::class, 'store'])->name('users.store');
    Route::get('/users/{user}/edit', [UserController::class, 'edit'])->name('users.edit');
    Route::put('/users/{user}', [UserController::class, 'update'])->name('users.update');
    Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');
    Route::post('/import-users', [UserController::class, 'import'])->name('users.import');
    Route::post('/users/storeMany', [UserController::class, 'storeMany'])->name('users.storeMany');
    Route::resource('degree-programs', DegreeProgramController::class);
    Route::get('/users/export', [UserController::class, 'export'])->name('users.export');
    Route::resource('lecture-halls', LectureHallController::class);
    Route::resource('semesters', SemesterController::class);
    Route::resource('timetables', TimeTableController::class);
    Route::any('/timetables/sh', [TimetableController::class, 'showTimeTable'])->name('timetables.showTimeTable');
    Route::resource('courses', CourseController::class);
   // Route::get('/dashboard', [DashboardController::class, 'dashboard'])->name('dashboard');
    Route::resource('course-registrations', CourseRegistrationController::class);

    Route::resource('events-registration', EventRegistrationController::class);
    Route::delete('/events-registration/{id}', [EventRegistrationController::class, 'destroy'])->name('events.destroy');
    Route::put('/events-registration', [EventRegistrationController::class, 'store'])->name('events.store');
    Route::put('/events-registration/{id}', [EventRegistrationController::class, 'update'])->name('events.update');

    Route::get('events', [EventController::class, 'index'])->name('events');
    Route::put('/events', [EventController::class, 'store'])->name('event.store');
    Route::put('/events/{id}', [EventController::class, 'update'])->name('event.update');
    Route::delete('/events/{id}', [EventController::class, 'destroy'])->name('events.destroy');
   
    Route::match(['get', 'post'], '/generate-events/{semester}', [EventController::class, 'generateEventsFromTimetable']);


   
   
    

});




Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});


   
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::post('/profile/photo', [ProfileController::class, 'updatePhoto'])->name('profile.updatePhoto');
    Route::delete('/profile/photo', [ProfileController::class, 'deletePhoto'])->name('profile.photo.delete');
    Route::resource('roles', RoleController::class);
    Route::resource('permissions', PermissionController::class);

});




require __DIR__.'/auth.php';
