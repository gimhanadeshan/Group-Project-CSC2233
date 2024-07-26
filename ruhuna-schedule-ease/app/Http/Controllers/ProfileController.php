<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
    }

    public function updatePhoto(Request $request): RedirectResponse
    {
        $request->validate([
            'profile_img' => 'required|image|mimes:jpg,jpeg,png|max:2048',
        ]);
    
        $user = $request->user();
        $file = $request->file('profile_img');
        $filename = time() . '.' . $file->getClientOriginalExtension();
        $path = 'profile_photos/' . $filename;
    
        // Move the file to the public/profile_photos directory
        $file->move(public_path('profile_photos'), $filename);
    
        // Delete old photo if exists
        if ($user->profile_img && file_exists(public_path('profile_photos/' . $user->profile_img))) {
            unlink(public_path('profile_photos/' . $user->profile_img));
        }
    
        // Update the user's profile photo path
        $user->profile_img = $filename;
        $user->save();
    
        return Redirect::route('profile.edit')->with('status', 'Profile photo updated successfully.');
    }

    public function deletePhoto(Request $request): RedirectResponse
{
    $user = $request->user();

    if ($user->profile_img && file_exists(public_path('profile_photos/' . $user->profile_img))) {
        unlink(public_path('profile_photos/' . $user->profile_img));
    }

    // Remove the profile photo from the user's record
    $user->profile_img = null;
    $user->save();

    return Redirect::route('profile.edit')->with('status', 'Profile photo deleted successfully.');
}



    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
