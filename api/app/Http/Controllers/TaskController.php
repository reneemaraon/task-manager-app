<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        
        $tasks = Task::where('user_id', Auth::id())
            ->orWhere('assigned_user_id', Auth::id())
            ->with(['user', 'assignedUser'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($tasks);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
        
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'status' => 'required|in:To Do,In Progress,Done',
            'due_date' => 'required|date',
            'assigned_user_id' => 'required|exists:users,id',
            'file' => 'nullable|file|max:5120', // 5MB max
        ]);

        $task = new Task($request->except('file'));
        $task->user_id = Auth::id();

        if ($request->hasFile('file')) {
            $path = $request->file('file')->store('task_files');
            $task->file_path = $path;
        }

        $task->save();

        return response()->json($task->load(['user', 'assignedUser']), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Task $task)
    {
        $this->authorize('view', $task);
        return response()->json($task->load(['user', 'assignedUser']));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Task $task)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Task $task)
    {
        $this->authorize('update', $task);

        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'status' => 'sometimes|required|in:To Do,In Progress,Done',
            'due_date' => 'sometimes|required|date',
            'assigned_user_id' => 'sometimes|required|exists:users,id',
            'file' => 'nullable|file|max:5120',
        ]);

        if ($request->hasFile('file')) {
            if ($task->file_path) {
                Storage::delete($task->file_path);
            }
            $path = $request->file('file')->store('task_files');
            $task->file_path = $path;
        }

        $task->update($request->except('file'));

        return response()->json($task->load(['user', 'assignedUser']));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task)
    {
        $this->authorize('delete', $task);

        if ($task->file_path) {
            Storage::delete($task->file_path);
        }

        $task->delete();

        return response()->json(null, 204);
    }
}
