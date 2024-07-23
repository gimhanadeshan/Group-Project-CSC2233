

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Registration No</th>
            <!-- <th>Role</th> -->
            <th>Academic Year</th>
        </tr>
    </thead>
    <tbody>
        @foreach($users as $user)
        <tr>
            <td>{{ $user->name }}</td>
            <td>{{ $user->email }}</td>
            <td>{{ $user->registration_no }}</td>
            <!-- <td>{{ $user->role->name }}</td> -->
            <td>{{ $user->academic_year }}</td>
        </tr>
        @endforeach
    </tbody>
</table>
