<?php

namespace App\Http\Controllers;

use App\Http\Requests\Voucher\StoreVoucherRequest;
use App\Http\Requests\Voucher\UpdateVoucherRequest;
use App\Http\Resources\VoucherResource;
use App\Models\Voucher;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class VoucherController extends Controller
{
    public function indexAdmin(Request $request): JsonResponse
    {
        $query = Voucher::query();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('code', 'like', "%{$search}%")
                  ->orWhere('name', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        $vouchers = $query->latest()->paginate($request->integer('per_page', 15));

        return response()->json([
            'status' => 'success',
            'data' => VoucherResource::collection($vouchers)->response()->getData(true),
        ]);
    }

    public function store(StoreVoucherRequest $request): JsonResponse
    {
        $voucher = Voucher::create($request->validated());

        return response()->json([
            'status' => 'success',
            'message' => 'Tạo mã giảm giá thành công',
            'data' => new VoucherResource($voucher),
        ], 201);
    }

    public function show($id): JsonResponse
    {
        $voucher = Voucher::findOrFail($id);

        return response()->json([
            'status' => 'success',
            'data' => new VoucherResource($voucher),
        ]);
    }

    public function update(UpdateVoucherRequest $request, $id): JsonResponse
    {
        $voucher = Voucher::findOrFail($id);
        $voucher->update($request->validated());

        return response()->json([
            'status' => 'success',
            'message' => 'Cập nhật mã giảm giá thành công',
            'data' => new VoucherResource($voucher),
        ]);
    }

    public function destroy($id): JsonResponse
    {
        $voucher = Voucher::findOrFail($id);
        $voucher->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Đã xóa mã giảm giá',
        ]);
    }

    public function indexClient(): JsonResponse
    {
        $vouchers = Voucher::where('status', 'active')
            ->orderBy('min_order_amount', 'asc')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => VoucherResource::collection($vouchers),
        ]);
    }

    public function validateVoucher(Request $request): JsonResponse
    {
        $request->validate([
            'code' => 'required|string',
            'order_amount' => 'required|numeric|min:0',
        ]);

        $code = strtoupper(trim((string) $request->code));
        $voucher = Voucher::where('code', $code)->first();

        if (! $voucher || $voucher->status !== 'active') {
            return response()->json([
                'valid' => false,
                'message' => 'Mã giảm giá không tồn tại hoặc đã hết hạn.',
            ], 422);
        }

        $orderAmount = (float) $request->order_amount;
        if ($orderAmount < $voucher->min_order_amount) {
            $diff = $voucher->min_order_amount - $orderAmount;
            return response()->json([
                'valid' => false,
                'message' => 'Đơn hàng cần đạt tối thiểu ' . number_format($voucher->min_order_amount, 0, ',', '.') . 'đ để áp dụng mã này (còn thiếu ' . number_format($diff, 0, ',', '.') . 'đ).',
                'min_order_amount' => $voucher->min_order_amount,
            ], 422);
        }

        return response()->json([
            'valid' => true,
            'message' => 'Áp dụng mã giảm giá thành công!',
            'voucher' => new VoucherResource($voucher),
            'discount_amount' => (int) $voucher->discount_amount,
        ]);
    }
}
