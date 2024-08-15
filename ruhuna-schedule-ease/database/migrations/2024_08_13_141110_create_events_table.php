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
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->string('event_title');
            $table->string('location');
            $table->dateTime('start');
            $table->dateTime('end');
            $table->unsignedBigInteger('user_id')->nullable(); // Add user_id column
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade'); // Set up foreign key constraint
            $table->unsignedBigInteger('semester_id')->nullable(); // Add semester_id column
            $table->foreign('semester_id')->references('semester_id')->on('time_tables')->onDelete('cascade');
            $table->unsignedBigInteger('course_id')->nullable(); // Add course_id column
            $table->foreign('course_id')->references('id')->on('courses')->onDelete('set null'); // Set up foreign key constraint
    
            $table->timestamps();
        });
    }
    

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};