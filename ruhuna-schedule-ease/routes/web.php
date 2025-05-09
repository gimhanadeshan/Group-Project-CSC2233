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
use App\Http\Controllers\TimeTableController;
use App\Http\Controllers\SemesterController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\CourseRegistrationController;
use App\Http\Controllers\EventRegistrationController;
use App\Http\Controllers\CourseConfirmationController;
use App\Http\Controllers\AnnouncementController;

use App\Http\Controllers\NotificationController;
use Illuminate\Support\Facades\Auth;




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
    Route::get('/semesters/{id}/progress-report', [SemesterController::class, 'getSemesterProgressReport'])
    ->name('semesters.progressReport');
    Route::resource('semesters', SemesterController::class);
    Route::post('/mark-as-read', function () {
        Auth::user()->unreadNotifications->markAsRead();
        return redirect()->back();
    })->name('markAllAsRead');
    Route::post('/mark-as-read-single/{id}', function ($id) {
        $notification = Auth::user()->unreadNotifications->find($id);

        if ($notification) {
            $notification->markAsRead();
            error_log('Marked as read');
        }
        return 0;
        //return redirect()->back();
    })->name('markAsRead');

    Route::get('/timetables/{semester}/pdf', [TimeTableController::class, 'generatePdf'])->name('timetables.pdf');
    Route::get('timetables/modify/{id}/destroy', [TimeTableController::class, 'destroySingle'])->name('timetables.destroySingle');
    Route::get('timetables/{timetable}/confirm', [TimeTableController::class, 'confirm'])->name('timetables.confirm');
    Route::get('timetables/modify/interval/update',[TimeTableController::class, 'updateInterval'])->name('timetables.updateInterval');
    Route::post('timetables/modify/add', [TimeTableController::class, 'storeSingle'])->name('timetables.storeSingle');
    Route::get('/timetables/{timetable}/modify', [TimeTableController::class, 'modify'])->name('timetables.modify');
    Route::resource('timetables', TimeTableController::class);
   // 
    Route::resource('courses', CourseController::class);
    Route::get('/courses/{id}', [CourseController::class, 'show'])->name('courses.show');
    Route::get('/dashboard', [DashboardController::class, 'dashboard'])->name('dashboard');
    Route::resource('announcements', AnnouncementController::class);
    
    Route::resource('course-registrations', CourseRegistrationController::class);

    Route::get('/course-confirmation', [CourseConfirmationController::class, 'index'])->name('course-confirmation.index');
    Route::post('/course-confirmation/{courseCode}/confirm', [CourseConfirmationController::class, 'confirmCourse'])->name('course-confirmation.confirm');
    Route::post('/course-confirmation/{courseCode}/cancel', [CourseConfirmationController::class, 'cancelCourse'])->name('course-confirmation.cancel');

    //Events
    Route::resource('events-registration', EventRegistrationController::class);
    Route::delete('/events-registration/{id}', [EventRegistrationController::class, 'destroy'])->name('events.destroy');
    Route::put('/events-registration', [EventRegistrationController::class, 'store'])->name('events.store');
    Route::put('/events-registration/{id}', [EventRegistrationController::class, 'update'])->name('events.update');

    Route::get('/events', [EventController::class, 'index'])->name('events');

    Route::put('/events', [EventController::class, 'store'])->name('event.store');
    Route::put('/events/{id}', [EventController::class, 'update'])->name('event.update');
    Route::delete('/events/{id}', [EventController::class, 'destroy'])->name('event.destroy');
    Route::get('events/view/{id}', [EventController::class, 'getEvent'])->name('getevents');
    Route::put('events/view/{id}', [EventController::class, 'getEventUpdate'])->name('getevents.update');



    //Route::get('/dashboard', [EventController1::class, 'index'])->name('dashboard');
    //Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('/course-confirmation', [CourseConfirmationController::class, 'index'])->name('course-confirmation.index');
    Route::put('/course-confirmation/confirm/{courseCode}/{studentId}', [CourseConfirmationController::class, 'confirmCourse'])->name('course-confirmation.confirm');
    Route::put('/course-confirmation/cancel/{courseCode}/{studentId}', [CourseConfirmationController::class, 'cancelCourse'])->name('course-confirmation.cancel');
    //Route::post('/course-confirmation/confirm-all', [CourseConfirmationController::class, 'confirmAllCourses'])->name('course-confirmation.confirmAll');
    //Route::delete('/course-confirmation/cancel-all', [CourseConfirmationController::class, 'cancelAllCourses'])->name('course-confirmation.cancelAll');
   


    //Route::match(['get', 'post'], '/generate-events/{semester}', [EventController::class, 'generateEventsFromTimetable']);

    //TimeTable table  into Events table

   Route::match(['get', 'post'], '/generate-events/{semester}', [EventController::class, 'generateEventsFromTimetable'])->name('generateEvents');
    Route::get('/Notifications',[ NotificationController::class,'index'])->name('notifications.index');


    Route::get('/events/{id}/generate-attendance-records', [EventController::class, 'generateAttendanceRecords'])
    ->name('events.generateAttendanceRecords');
    Route::get('/generate-attendance-records', [EventController::class, 'generateAttendanceRecordsForAllEvents'])
    ->name('events.generateAllAttendanceRecords');

    Route::get('/events/{eventid}/attendance', [EventController::class, 'getAttendance'])->name('events.getAttendance');

    //Route::get('/attendance/{eventId}/{studentId}', [EventController::class, 'viewAttendance'])->name('attendance.view');
    Route::get('/attendance/{courseType}/{eventId}/{studentId}', [EventController::class, 'viewAttendance'])->name('attendance.view');

    Route::put('/attendance/{courseType}/{eventId}/{studentId}/update', [EventController::class, 'updateAttendance'])->name('attendance.update');

    Route::get('/events/attendance', [EventController::class, 'showAttendancePage'])->name('events.attendance');
});




Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/info', function () {
    return Inertia::render('Info');
})->name('info');

// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');



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
