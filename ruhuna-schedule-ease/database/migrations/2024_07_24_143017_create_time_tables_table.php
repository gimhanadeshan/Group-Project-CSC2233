<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('time_tables', function (Blueprint $table) {
            $table->id('slot_id');
            $table->time('start_time')->nullable();
            $table->time('end_time')->nullable();
            $table->String('type');
            $table->boolean('availability');
            $table->enum('day_of_week', ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']);
            $table->foreignId('course_id')->constrained('courses')->onDelete('cascade');
            $table->foreignId('hall_id')->constrained('lecture_halls')->onDelete('cascade');
            $table->foreignId('lecturer')->constrained('users')->onDelete('cascade');
            $table->foreignId('semester_id')->constrained('semesters')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('time_tables');
    }
};
