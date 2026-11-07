<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class HomepageApiTest extends TestCase
{
    use RefreshDatabase;

    private function product(array $attributes = [], ?Category $category = null): Product
    {
        $category ??= Category::create([
            'name' => 'Áo dài', 'slug' => 'category-'.uniqid(), 'status' => 'active',
        ]);

        return Product::create(array_merge([
            'category_id' => $category->id,
            'name' => 'Sản phẩm kiểm thử',
            'slug' => 'product-'.uniqid(),
            'thumbnail' => 'https://example.com/product.jpg',
            'rental_price_per_day' => 300000,
            'original_value' => 1000000,
            'status' => 'active',
        ], $attributes));
    }

    public function test_hot_products_exclude_normal_hidden_and_deleted_products(): void
    {
        $featured = $this->product(['is_featured' => true]);
        $this->product(['is_featured' => false]);
        $this->product(['is_featured' => true, 'status' => 'hidden']);
        $this->product(['is_featured' => true])->delete();
        $hiddenCategory = Category::create(['name' => 'Ẩn', 'slug' => 'hidden', 'status' => 'hidden']);
        $this->product(['is_featured' => true], $hiddenCategory);

        $this->getJson('/api/products?is_featured=1&per_page=4')
            ->assertOk()->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $featured->id);
    }

    public function test_sale_products_require_a_valid_discount(): void
    {
        $sale = $this->product(['is_sale' => true, 'sale_rental_price' => 240000]);
        foreach ([null, 0, -1, 300000, 350000] as $price) {
            $this->product(['is_sale' => true, 'sale_rental_price' => $price]);
        }
        $this->product(['is_sale' => false, 'sale_rental_price' => 200000]);
        $this->product(['is_sale' => true, 'sale_rental_price' => 100000, 'status' => 'hidden']);

        $this->getJson('/api/products?is_sale=1')
            ->assertOk()->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $sale->id)
            ->assertJsonPath('data.0.effective_price', 240000)
            ->assertJsonPath('data.0.discount_percent', 20);
    }

    public function test_categories_use_real_active_product_counts_and_preview_images(): void
    {
        $visible = $this->product();
        $this->product(['status' => 'hidden'], $visible->category);
        $this->product([], $visible->category)->delete();
        $this->product(['status' => 'hidden']);
        Category::create(['name' => 'Trống', 'slug' => 'empty', 'status' => 'active']);

        $this->getJson('/api/categories?has_products=1&per_page=6')
            ->assertOk()->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $visible->category_id)
            ->assertJsonPath('data.0.products_count', 1)
            ->assertJsonPath('data.0.preview_image', $visible->thumbnail);
    }

    public function test_product_category_filter_accepts_slug_and_id(): void
    {
        $product = $this->product();
        $this->product();
        foreach ([$product->category->slug, $product->category_id] as $category) {
            $this->getJson('/api/products?category='.$category)
                ->assertOk()->assertJsonCount(1, 'data')
                ->assertJsonPath('data.0.id', $product->id)
                ->assertJsonPath('data.0.category.slug', $product->category->slug);
        }
    }

    public function test_new_arrivals_are_ordered_and_paginated(): void
    {
        $this->product(['created_at' => now()->subDays(2)]);
        $middle = $this->product(['created_at' => now()->subDay()]);
        $newest = $this->product(['created_at' => now()]);

        $this->getJson('/api/products?per_page=1')
            ->assertOk()->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $newest->id)
            ->assertJsonPath('meta.total', 3);
        $this->getJson('/api/products?per_page=1&page=2')
            ->assertOk()->assertJsonPath('data.0.id', $middle->id);
    }

    public function test_empty_database_returns_empty_lists_and_invalid_filters_are_rejected(): void
    {
        $this->getJson('/api/products?is_featured=1')->assertOk()->assertJsonCount(0, 'data');
        $this->getJson('/api/products?is_sale=1')->assertOk()->assertJsonCount(0, 'data');
        $this->getJson('/api/categories?has_products=1')->assertOk()->assertJsonCount(0, 'data');
        $this->getJson('/api/products?per_page=0')->assertUnprocessable();
        $this->getJson('/api/products?is_featured=wrong')->assertUnprocessable();
        $this->getJson('/api/categories?per_page=101')->assertUnprocessable();
    }
}
