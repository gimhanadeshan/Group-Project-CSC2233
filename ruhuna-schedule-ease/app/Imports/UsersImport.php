<?php
namespace App\Imports;

use App\Models\User;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;

class UsersImport implements ToCollection
{
    protected static $importedUsers = [];
    protected $academicYear;
    protected $temporaryPassword;
    protected $roleId;

    public function __construct($academicYear, $temporaryPassword, $roleId)
    {
        $this->academicYear = $academicYear;
        $this->temporaryPassword = $temporaryPassword;
        $this->roleId = $roleId;
    }

    public function collection(Collection $rows)
    {
        foreach ($rows as $row) {
            $user = User::create([
                'name' => $row[0],
                'email' => $row[1],
                'registration_no' => $row[2],
                'role_id' => $this->roleId,
                'academic_year' => $this->academicYear,
                'password' => $this->temporaryPassword,
]);

// Add the imported user to the array
        self::$importedUsers[] = $user;
    }
}

// Static method to get imported users
public static function getImportedUsers()
{
    return self::$importedUsers;
}

}
