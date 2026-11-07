<?php

namespace App\Http\Controllers;

use App\Http\Resources\Order\OrderResource;
use App\Mail\OrderSuccessMail;
use App\Models\Order;
use App\Models\ProductSize;
use App\Models\Voucher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Throwable;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::with(['user', 'items.productSize.product'])
            ->where('status', '!=', 'cancelled')
            ->latest('id')
            ->get();

        return OrderResource::collection($orders);
    }

    public function store(Request $request)
    {
        $user = $request->user();
        $orderCode = $request->input('order_code') ?? ('SR' . strtoupper(substr(uniqid(), -6)));

        $voucherCode = $request->filled('voucher_code') ? strtoupper(trim($request->input('voucher_code'))) : null;
        $discountAmount = 0;

        if ($voucherCode) {
            $voucher = Voucher::where('code', $voucherCode)->where('status', 'active')->first();
            if ($voucher) {
                $rentalSubtotal = 0;
                $requestItems = $request->input('items', []);
                foreach ($requestItems as $it) {
                    $q = (int) ($it['quantity'] ?? 1);
                    $d = (int) ($it['days'] ?? $it['rental_days'] ?? 1);
                    $p = (float) ($it['price_per_day'] ?? 0);
                    $rentalSubtotal += (float) ($it['rental_total'] ?? $it['rentalTotal'] ?? ($p * $q * $d));
                }

                if ($voucher->isValidForAmount($rentalSubtotal)) {
                    $discountAmount = (int) $voucher->discount_amount;
                    $voucher->increment('used_count');
                } else {
                    $voucherCode = null;
                }
            } else {
                $voucherCode = null;
            }
        }

        $paymentMethod = $request->input('payment_method', 'cod');
        $initialStatus = $paymentMethod === 'cod' ? 'confirmed' : 'pending_payment';

        $order = Order::create([
            'order_code' => $orderCode,
            'user_id' => $user->id,
            'status' => $initialStatus,
            'receiver_name' => $request->input('receiver_name') ?? $user->fullname,
            'receiver_phone' => $request->input('receiver_phone') ?? $user->phone,
            'address' => $request->input('address') ?? $user->address,
            'payment_method' => $paymentMethod,
            'total_amount' => $request->input('total_amount', 0),
            'note' => $request->input('note'),
            'voucher_code' => $voucherCode,
            'discount_amount' => $discountAmount,
        ]);

        $items = $request->input('items', []);
        foreach ($items as $item) {
            $productSizeId = $this->resolveProductSizeId($item);
            $quantity = (int) ($item['quantity'] ?? 1);
            $days = (int) ($item['days'] ?? $item['rental_days'] ?? 1);
            $pricePerDay = (float) ($item['price_per_day'] ?? 0);
            $depositPerItem = (float) ($item['deposit_per_item'] ?? 0);

            $order->items()->create([
                'product_size_id' => $productSizeId,
                'quantity' => $quantity,
                'rent_start_date' => $item['rent_start_date'] ?? $item['pickupDate'] ?? now()->toDateString(),
                'rent_end_date' => $item['rent_end_date'] ?? $item['returnDate'] ?? now()->addDays($days)->toDateString(),
                'rental_days' => $days,
                'price_per_day' => $pricePerDay,
                'deposit_per_item' => $depositPerItem,
                'total_item_rental' => (float) ($item['rental_total'] ?? $item['rentalTotal'] ?? ($pricePerDay * $quantity * $days)),
                'total_item_deposit' => (float) ($item['deposit_total'] ?? $item['depositTotal'] ?? ($depositPerItem * $quantity)),
            ]);
        }

        if ($paymentMethod === 'cod' && !$order->email_sent_at) {
            $order->email_sent_at = now();
            $order->save();

            try {
                if (!empty($user->email)) {
                    $order->load(['user', 'items.productSize.product']);
                    Mail::to($user->email)->send(new OrderSuccessMail($order));
                }
            } catch (Throwable $e) {
                Log::error('Order email error: ' . $e->getMessage());
            }
        }

        return response()->json([
            'status' => 'success',
            'order' => new OrderResource($order->load(['user', 'items.productSize.product'])),
            'order_code' => $orderCode,
        ], 201);
    }

    private function resolveProductSizeId(array $item): int
    {
        if (!empty($item['product_size_id'])) {
            return (int) $item['product_size_id'];
        }

        $matchingSize = ProductSize::where('product_id', $item['product_id'] ?? null)
            ->where('size', $item['size'] ?? '')
            ->first();

        if ($matchingSize) {
            return $matchingSize->id;
        }

        $fallbackId = ProductSize::where('product_id', $item['product_id'] ?? null)->value('id');
        if ($fallbackId) {
            return (int) $fallbackId;
        }

        return (int) (ProductSize::value('id') ?? 1);
    }

    public function show(Request $request, $code)
    {
        $user = $request->user();
        $query = Order::with(['user', 'items.productSize.product'])
            ->where('order_code', $code);

        if ($user && $user->role !== 'admin') {
            $query->where('user_id', $user->id);
        }

        $order = $query->firstOrFail();

        return new OrderResource($order);
    }

    public function updateStatus(Request $request, $code)
    {
        $request->validate([
            'status' => 'required|string',
        ]);

        $order = Order::where('order_code', $code)->firstOrFail();
        $order->status = $request->status;
        $order->save();

        return new OrderResource($order->load(['user', 'items.productSize.product']));
    }

    public function destroy($id)
    {
        $order = Order::where(function ($q) use ($id) {
            if (is_numeric($id)) {
                $q->where('id', $id);
            } else {
                $q->where('order_code', $id);
            }
        })->firstOrFail();

        $order->update(['status' => 'cancelled']);
        $order->delete();

        return response()->json([
            'message' => 'Chuyển đơn hàng vào thùng rác thành công',
            'code' => 200,
        ]);
    }

    public function trash()
    {
        $orders = Order::withTrashed()
            ->with(['user', 'items.productSize.product'])
            ->where(function ($q) {
                $q->where('status', 'cancelled')
                  ->orWhereNotNull('deleted_at');
            })
            ->latest('updated_at')
            ->get();

        return OrderResource::collection($orders);
    }

    public function restore($id)
    {
        $order = Order::withTrashed()
            ->where(function ($q) use ($id) {
                if (is_numeric($id)) {
                    $q->where('id', $id);
                } else {
                    $q->where('order_code', $id);
                }
            })
            ->firstOrFail();

        if ($order->trashed()) {
            $order->restore();
        }
        $order->status = 'confirmed';
        $order->save();

        return response()->json([
            'message' => 'Khôi phục đơn hàng thành công',
            'code' => 200,
        ]);
    }

    public function forceDelete($id)
    {
        $order = Order::withTrashed()
            ->where(function ($q) use ($id) {
                if (is_numeric($id)) {
                    $q->where('id', $id);
                } else {
                    $q->where('order_code', $id);
                }
            })
            ->firstOrFail();

        $order->items()->delete();
        $order->forceDelete();

        return response()->json([
            'message' => 'Xóa vĩnh viễn đơn hàng thành công',
            'code' => 200,
        ]);
    }

    public function myOrders(Request $request)
    {
        $user = $request->user('sanctum') ?? auth('sanctum')->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $orders = Order::with(['user', 'items.productSize.product'])
            ->where('user_id', $user->id)
            ->latest('id')
            ->get();

        return OrderResource::collection($orders);
    }
}
