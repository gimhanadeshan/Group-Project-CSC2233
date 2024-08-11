<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('semesters', function (Blueprint $table) {
            $table->id();
            $table->string('academic_year');
            $table->string('level');
            $table->string('semester');
            $table->string('reference_number')->unique();
            $table->string('name')->nullable();;
            $table->date('start_date');
            $table->date('end_date');
            $table->date('registration_start_date')->nullable();
            $table->date('registration_end_date')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('semesters');
    }
};
