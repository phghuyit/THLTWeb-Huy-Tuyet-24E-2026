<?php

namespace App\Http\Controllers;

use App\Http\Requests\Cart\AddToCartRequest;
use App\Http\Requests\Cart\UpdateCartItemRequest;
use App\Http\Resources\Cart\CartResource;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    private function getCartUser(): ?User
    {
        return Auth::user();
    }

    private function getOrCreateCart(User $user): Cart
    {
        return Cart::firstOrCreate(['user_id' => $user->id]);
    }

    public function index(): JsonResponse
    {
        $user = $this->getCartUser();

        if (! $user) {
            return response()->json([
                'message' => 'Vui long dang nhap de su dung gio hang',
            ], 401);
        }

        $cart = $this->getOrCreateCart($user)->load(['items.product.sizes', 'items.productSize']);

        return response()->json([
            'message' => 'Lay gio hang thanh cong',
            'data' => new CartResource($cart),
        ]);
    }

    public function store(AddToCartRequest $request): JsonResponse
    {
        $user = $this->getCartUser();

        if (! $user) {
            return response()->json([
                'message' => 'Vui long dang nhap de su dung gio hang',
            ], 401);
        }

        $validated = $request->validated();
        $cart = $this->getOrCreateCart($user);
        $quantity = $validated['quantity'] ?? 1;

        $cartItem = CartItem::where('cart_id', $cart->id)
            ->where('product_id', $validated['product_id'])
            ->where('product_size_id', $validated['product_size_id'] ?? null)
            ->first();

        if ($cartItem) {
            $cartItem->quantity += $quantity;
            if (! empty($validated['rent_start_date'])) {
                $cartItem->rent_start_date = $validated['rent_start_date'];
            }
            if (! empty($validated['rent_end_date'])) {
                $cartItem->rent_end_date = $validated['rent_end_date'];
            }
            $cartItem->save();
        } else {
            CartItem::create([
                'cart_id' => $cart->id,
                'product_id' => $validated['product_id'],
                'product_size_id' => $validated['product_size_id'] ?? null,
                'quantity' => $quantity,
                'rent_start_date' => $validated['rent_start_date'] ?? null,
                'rent_end_date' => $validated['rent_end_date'] ?? null,
            ]);
        }

        $cart->load(['items.product.sizes', 'items.productSize']);

        return response()->json([
            'message' => 'Them vao gio hang thanh cong',
            'data' => new CartResource($cart),
        ]);
    }

    public function update(UpdateCartItemRequest $request, string $id): JsonResponse
    {
        $user = $this->getCartUser();

        if (! $user) {
            return response()->json([
                'message' => 'Vui long dang nhap de su dung gio hang',
            ], 401);
        }

        $validated = $request->validated();
        $cart = $this->getOrCreateCart($user);

        $cartItem = CartItem::where('cart_id', $cart->id)->find($id);

        if (! $cartItem) {
            return response()->json([
                'message' => 'Khong tim thay san pham trong gio hang',
            ], 404);
        }

        $cartItem->quantity = $validated['quantity'];
        if (array_key_exists('rent_start_date', $validated)) {
            $cartItem->rent_start_date = $validated['rent_start_date'];
        }
        if (array_key_exists('rent_end_date', $validated)) {
            $cartItem->rent_end_date = $validated['rent_end_date'];
        }
        $cartItem->save();

        $cart->load(['items.product.sizes', 'items.productSize']);

        return response()->json([
            'message' => 'Cap nhat gio hang thanh cong',
            'data' => new CartResource($cart),
        ]);
    }

    public function destroy(string $id): JsonResponse
    {
        $user = $this->getCartUser();

        if (! $user) {
            return response()->json([
                'message' => 'Vui long dang nhap de su dung gio hang',
            ], 401);
        }

        $cart = $this->getOrCreateCart($user);

        $cartItem = CartItem::where('cart_id', $cart->id)->find($id);

        if (! $cartItem) {
            return response()->json([
                'message' => 'Khong tim thay san pham trong gio hang',
            ], 404);
        }

        $cartItem->delete();
        $cart->load(['items.product.sizes', 'items.productSize']);

        return response()->json([
            'message' => 'Xoa san pham khoi gio hang thanh cong',
            'data' => new CartResource($cart),
        ]);
    }

    public function clear(): JsonResponse
    {
        $user = $this->getCartUser();

        if (! $user) {
            return response()->json([
                'message' => 'Vui long dang nhap de su dung gio hang',
            ], 401);
        }

        $cart = $this->getOrCreateCart($user);
        $cart->items()->delete();

        $cart->load(['items.product.sizes', 'items.productSize']);

        return response()->json([
            'message' => 'Xoa toan bo gio hang thanh cong',
            'data' => new CartResource($cart),
        ]);
    }
}
