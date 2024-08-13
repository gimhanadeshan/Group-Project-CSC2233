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
            $table->integer('semester_id')->nullable();
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
