<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class CourseRegistrationOpened extends Notification
{
    use Queueable;
    protected $level;
    protected $semester;
    protected $year;
    protected $start;
    protected $end;
    protected $name;
    /**
     * Create a new notification instance.
     */
    public function __construct($level,$semester,$year,$start,$end,$name)   {
        $this->level = $level;
        $this->semester = $semester;
        $this->year = $year;
        $this->start = $start;
        $this->end = $end;
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
                    ->line('course registration is opened for Level'.$this->level.' semester '.$this->semester.' year '.$this->year .' from '.$this->start.' to '.$this->end)
                    ->action('Check Out', url('/course_registration'))
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
            'data' => 'Course Registration is Opened for Level'.$this->level.' semester '.$this->semester.' year '.$this->year .' from '.$this->start.' to '.$this->end,
            'link' => 'course-registration.index',
        ];
    }
}
