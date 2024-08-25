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
    protected $name;
    /**
     * Create a new notification instance.
     */
    public function __construct($level, $semester, $year,$name)   {
        $this->level = $level;
        $this->semester = $semester;
        $this->year = $year;
        $this->name = $name;
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
                    ->greeting('Dear  '.$this->name)
                    ->line('TimeTable is published for Level '.$this->level.' semester '.$this->semester.' year '.$this->year)
                    ->action('Check Out', url('/'))
                    ->salutation('Thank you for using Academic Schedule Ease!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'data' => 'Time Table Initialized for Level'.$this->level.' semester '.$this->semester.' year '.$this->year,
            'link' => '/dashboard',
        ];
    }
}
