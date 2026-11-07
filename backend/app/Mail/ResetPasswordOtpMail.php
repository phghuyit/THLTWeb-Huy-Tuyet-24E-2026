<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ResetPasswordOtpMail extends Mailable
{
    use Queueable, SerializesModels;

    public string $code;
    public string $userName;
    public int $expiresInMinutes;

    public function __construct(string $code, string $userName = '', int $expiresInMinutes = 10)
    {
        $this->code = $code;
        $this->userName = $userName;
        $this->expiresInMinutes = $expiresInMinutes;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Mã xác thực đặt lại mật khẩu - ' . config('app.name', 'StyleRent'),
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.reset_password_otp',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
