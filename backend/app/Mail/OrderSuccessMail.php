<?php

namespace App\Mail;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class OrderSuccessMail extends Mailable
{
    use Queueable, SerializesModels;

    public Order $order;

    public function __construct(Order $order)
    {
        $this->order = $order;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Xác nhận đơn thuê #' . $this->order->order_code . ' - ' . config('app.name', 'StyleRent'),
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.order_success',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
