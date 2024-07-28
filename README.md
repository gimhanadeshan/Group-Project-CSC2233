
---
# RUHUNA ScheduleEase

RUHUNA ScheduleEase is an academic management system designed for the University of Ruhuna's Department of Computer Science. The system streamlines academic operations, including user account management, semester initialization, course registration, timetable generation, lecture scheduling, personalized dashboards, and automated notifications.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features

- User Account Management
  - Admin can manage users, delete users, and assign admin roles.
- Semester Initialization
- Course Registration
  - Includes confirmation by lecturers.
- Timetable Generation
  - Random time slot generation.
  - Customization with drag-and-drop functionality.
- Lecture Scheduling
- Personalized Dashboards
- Automated Notifications

## Tech Stack

- **Backend**: Laravel 11
- **Frontend**: React with Inertia.js
- **Styling**: TailwindCSS
- **Database**: MySQL

## Installation

1. Ensure you have PHP and Composer installed. If you are using XAMPP, go to `C:\xampp\php\php.ini`, search for `extension=gd`, remove the `;` at the beginning of the line, and save the file.

2. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/ruhuna-schedule-ease.git
    cd ruhuna-schedule-ease
    ```

3. Install dependencies:
    ```bash
    composer install
    npm install
    ```

4. Install additional packages:
    ```bash
    npm install react-big-calendar
    composer require maatwebsite/excel
    npm install react-select
    ```

5. Create a `.env` file:
    ```bash
    cp .env.example .env
    ```

6. Generate the application key:
    ```bash
    php artisan key:generate --ansi
    ```

7. Configure the `.env` file with your database credentials.

8. Run database migrations and seeders:
    ```bash
    php artisan migrate
    php artisan migrate:fresh --seed
    ```

9. Build the frontend assets:
    ```bash
    npm run dev
    ```

10. Start the development server:
    ```bash
    php artisan serve
    ```

## Usage

1. Access the application in your browser:
    ```bash
    http://localhost:8000
    ```

2. Log in with the default admin credentials:
    - Username: `Admin`
    - Password: `password`

3. Navigate through the dashboard to manage users, courses, semesters, and timetables.

## Contributing

Contributions are welcome! Please read the [contributing guidelines](CONTRIBUTING.md) first.

## License

RUHUNA ScheduleEase is free software: you can redistribute it and/or modify it under the terms of the [MIT License](https://opensource.org/licenses/MIT).

![design-a-logo-for-ruhunascheduleease-using-geometr-N5I_M9dWQ2SUsuFv8FRyHw-lqj0Q5ocSxiVR33lbvrROg](https://github.com/user-attachments/assets/4893cde4-c96a-48d9-be9a-3689fc7fb982)


---

