<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TimeTableInitialized extends Notification
{
    use Queueable;
    protected $level;
    protected $semester;
    protected $year;
    /**
     * Create a new notification instance.
     */
    public function __construct($semesterinfo)
    {
        $this->level = $semesterinfo['level'];
        $this->semester = $semesterinfo['semester'];
        $this->year = $semesterinfo['year'];
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail','database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
                    ->subject('Time Table Initialized')
                    ->greeting('Hello,')
                    ->line('Time Table Initialized for '.$this->level.' '.$this->semester.' '.$this->year)
                    ->action('Notification Action', url('/dashboard'))
                    ->line('Thank you for using our application!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'data' => 'Time Table Initialized for '.$this->level.' '.$this->semester.' '.$this->year,
        ];
    }
}
