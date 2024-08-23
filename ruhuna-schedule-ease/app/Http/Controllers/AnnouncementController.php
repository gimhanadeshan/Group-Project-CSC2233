<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AnnouncementController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('read_announcement', $request->user());
        $announcements = Announcement::all();
        return Inertia::render('Announcements/Index', [
            'announcements' => $announcements
        ]);
    }

    public function create(Request $request)
    {
        $this->authorize('create_announcement', $request->user());
        return Inertia::render('Announcements/Create');
    }

    public function store(Request $request)
    {
        $this->authorize('create_announcement', $request->user());
        $request->validate([
            'title' => 'required|string|max:255',
            'body' => 'required|string',
        ]);

        Announcement::create($request->all());
        return redirect()->route('announcements.index');
    }

    public function edit(Announcement $announcement,Request $request)
    {
        $this->authorize('update_announcement', $request->user());
        return Inertia::render('Announcements/Edit', [
            'announcement' => $announcement
        ]);
    }

    public function update(Request $request, Announcement $announcement)
    {
        $this->authorize('update_announcement', $request->user());
        $request->validate([
            'title' => 'required|string|max:255',
            'body' => 'required|string',
        ]);

        $announcement->update($request->all());
        return redirect()->route('announcements.index');
    }

    public function destroy(Announcement $announcement,Request $request)
    {
        $this->authorize('delete_announcement', $request->user());
        $announcement->delete();
        return redirect()->route('announcements.index');
    }
}
