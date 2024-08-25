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
    Schema::table('course_registrations', function (Blueprint $table) {
        $table->unsignedBigInteger('semester_id')->nullable()->after('course_id');

        // If you need a foreign key constraint
        $table->foreign('semester_id')->references('id')->on('semesters')->onDelete('cascade');
    });
}

public function down()
{
    Schema::table('course_registrations', function (Blueprint $table) {
        $table->dropForeign(['semester_id']);
        $table->dropColumn('semester_id');
    });
}

};
