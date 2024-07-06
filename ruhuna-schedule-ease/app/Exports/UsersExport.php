<?php

namespace App\Exports;

use App\Models\User;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class UsersExport implements FromCollection, WithHeadings
{
    public function collection()
    {
        return User::all(['name', 'email', 'registration_no','academic_year']);
    }

    public function headings(): array
    {
        return [
            'Name',
            'Email',
            'Registration No',
            'Academic Year',
        ];
    }
}
