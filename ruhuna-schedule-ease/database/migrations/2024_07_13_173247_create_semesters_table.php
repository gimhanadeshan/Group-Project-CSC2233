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
            $table->unsignedBigInteger('degree_program_id')->nullable(); // Make nullable for foreign key constraint
            $table->string('academic_year');
            $table->enum('level', ['1', '2', '3', '4']);
            $table->enum('semester', ['1', '2']);
            $table->date('start_date');
            $table->date('end_date');
            $table->date('registration_start_date')->nullable();
            $table->date('registration_end_date')->nullable();
            $table->text('description')->nullable();
            $table->integer('course_capacity')->default(0);
            $table->integer('enrollment_count')->default(0);
            $table->enum('status', ['Upcoming', 'In Progress', 'Completed'])->default('Upcoming');
            
            // Foreign key constraint
            $table->foreign('degree_program_id')
                  ->references('id')
                  ->on('degree_programs')
                  ->onDelete('cascade');
            
            $table->softDeletes();
            $table->timestamps();
            
            // Unique constraint
            $table->unique(['academic_year', 'level', 'semester', 'degree_program_id'], 'unique_semester_combinations');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('semesters', function (Blueprint $table) {
            $table->dropForeign(['degree_program_id']);
            $table->dropUnique('unique_semester_combinations');
        });
        
        Schema::dropIfExists('semesters');
    }
};
